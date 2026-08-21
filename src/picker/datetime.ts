import type { Dayjs } from "../lib/dayjs";
import { dayjs } from "../lib/dayjs";
import type { PickerValidationError } from "../picker/types";
import { pushTwoDigitSection } from "./digit-section";
import { extractMeridianSuffix, hour12To24, isUnambiguous24hHour } from "./meridian";
import { createTimeOfDay, type TimePrecision } from "./time";

export const resolveDisplayTimezone = (
  timezone: string | undefined,
  value: Dayjs | null | undefined,
  defaultValue: Dayjs | null | undefined
): string => {
  if (timezone) {
    return timezone;
  }

  const candidate = value ?? defaultValue;
  if (candidate) {
    const candidateTimezone = (candidate as Dayjs & { $x?: { $timezone?: string } }).$x?.$timezone;
    if (candidateTimezone) {
      return candidateTimezone;
    }
    if ((candidate as Dayjs & { $u?: boolean }).$u) {
      return "UTC";
    }
  }

  return "system";
};

export const calendarStringToDayjs = (dateStr: string, timezone?: string): Dayjs => {
  // Strict parse rejects impossible calendar dates (e.g. 2020-12-34) instead of
  // overflowing them to another day (2021-01-03).
  const strict = dayjs(dateStr, "YYYY-MM-DD", true);
  if (!strict.isValid()) {
    return strict;
  }
  if (timezone && timezone !== "system") {
    return dayjs.tz(dateStr, "YYYY-MM-DD", timezone);
  }
  return strict;
};

export const dayjsToCalendarString = (value: Dayjs, timezone?: string): string => {
  if (timezone && timezone !== "system") {
    return value.tz(timezone).format("YYYY-MM-DD");
  }
  return value.format("YYYY-MM-DD");
};

/** Keep digits only and insert `-`; month/day restart when exceeding 12/31. */
export const formatCalendarDateInput = (text: string): string => {
  const digits = text.replace(/\D/g, "");
  let year = "";
  let month = "";
  let day = "";
  let section: "year" | "month" | "day" = "year";

  for (const digit of digits) {
    if (section === "year") {
      year += digit;
      if (year.length >= 4) {
        year = year.slice(0, 4);
        section = "month";
      }
      continue;
    }

    if (section === "month") {
      const result = pushTwoDigitSection(month, digit, 12, 1);
      month = result.value;
      if (result.complete) {
        section = "day";
      }
      continue;
    }

    const result = pushTwoDigitSection(day, digit, 31, 1);
    day = result.value;
    if (result.complete) {
      break;
    }
  }

  if (!month && !day) {
    return year;
  }
  if (!day) {
    return `${year}-${month}`;
  }
  return `${year}-${month}-${day}`;
};

export const toZonedDayjs = (value: Dayjs, displayTimezone: string): Dayjs => {
  if (displayTimezone === "system") {
    return value.local();
  }
  if (displayTimezone === "UTC") {
    return value.utc();
  }
  return value.tz(displayTimezone);
};

export const defaultDatetimeFormat = (timePrecision: TimePrecision = "minutes", ampm = false): string => {
  if (ampm) {
    return timePrecision === "seconds" ? "YYYY-MM-DD hh:mm:ss A" : "YYYY-MM-DD hh:mm A";
  }
  return timePrecision === "seconds" ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD HH:mm";
};

export const dayjsToDatetimeString = (
  value: Dayjs,
  displayTimezone: string,
  timePrecision: TimePrecision = "minutes",
  ampm = false,
  format?: string
): string => {
  const zoned = toZonedDayjs(value, displayTimezone);
  if (format) {
    return zoned.format(format);
  }
  return zoned.format(defaultDatetimeFormat(timePrecision, ampm));
};

export const wallClockToUtc = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  displayTimezone: string
): Dayjs => {
  const wall = `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`;
  if (displayTimezone === "system") {
    return dayjs(wall, "YYYY-MM-DD HH:mm:ss").utc();
  }
  return dayjs.tz(wall, "YYYY-MM-DD HH:mm:ss", displayTimezone).utc();
};

const DATETIME_24H_MINUTES = /^(\d{4})-(\d{2})-(\d{2}) ([01]\d|2[0-3]):([0-5]\d)$/;
const DATETIME_24H_SECONDS = /^(\d{4})-(\d{2})-(\d{2}) ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
const DATETIME_12H_MINUTES = /^(\d{4})-(\d{2})-(\d{2}) (0?[1-9]|1[0-2]):([0-5]\d) (AM|PM)$/i;
const DATETIME_12H_SECONDS = /^(\d{4})-(\d{2})-(\d{2}) (0?[1-9]|1[0-2]):([0-5]\d):([0-5]\d) (AM|PM)$/i;

const parseDatetimePartsToUtc = (
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  displayTimezone: string
): Dayjs | null => {
  const calendarCheck = dayjs(`${year}-${pad(month)}-${pad(day)}`, "YYYY-MM-DD", true);
  if (!calendarCheck.isValid()) {
    return null;
  }
  return wallClockToUtc(year, month, day, hour, minute, second, displayTimezone);
};

export const isCompleteDatetimeString = (
  text: string,
  timePrecision: TimePrecision = "minutes",
  ampm = false
): boolean => {
  if (ampm) {
    const twelveOk = timePrecision === "seconds" ? DATETIME_12H_SECONDS.test(text) : DATETIME_12H_MINUTES.test(text);
    if (twelveOk) {
      return true;
    }
    const twentyFour = timePrecision === "seconds" ? DATETIME_24H_SECONDS.exec(text) : DATETIME_24H_MINUTES.exec(text);
    if (!twentyFour) {
      return false;
    }
    const hour = Number(twentyFour[4]);
    // Hours 1-12 without a meridian are ambiguous in ampm mode (wait for AM/PM).
    return isUnambiguous24hHour(hour);
  }
  return timePrecision === "seconds" ? DATETIME_24H_SECONDS.test(text) : DATETIME_24H_MINUTES.test(text);
};

export const parseDatetimeString = (
  text: string,
  displayTimezone: string,
  timePrecision: TimePrecision = "minutes",
  ampm = false
): Dayjs | null => {
  if (ampm) {
    const twelve = timePrecision === "seconds" ? DATETIME_12H_SECONDS.exec(text) : DATETIME_12H_MINUTES.exec(text);
    if (twelve) {
      const year = Number(twelve[1]);
      const month = Number(twelve[2]);
      const day = Number(twelve[3]);
      const hour12 = Number(twelve[4]);
      const minute = Number(twelve[5]);
      const second = timePrecision === "seconds" ? Number(twelve[6]) : 0;
      const meridian = timePrecision === "seconds" ? twelve[7]! : twelve[6]!;
      return parseDatetimePartsToUtc(year, month, day, hour12To24(hour12, meridian), minute, second, displayTimezone);
    }
  }

  if (!isCompleteDatetimeString(text, timePrecision, ampm)) {
    return null;
  }

  const twentyFour = timePrecision === "seconds" ? DATETIME_24H_SECONDS.exec(text) : DATETIME_24H_MINUTES.exec(text);
  if (!twentyFour) {
    return null;
  }

  const year = Number(twentyFour[1]);
  const month = Number(twentyFour[2]);
  const day = Number(twentyFour[3]);
  const hour = Number(twentyFour[4]);
  const minute = Number(twentyFour[5]);
  const second = timePrecision === "seconds" ? Number(twentyFour[6]) : 0;
  return parseDatetimePartsToUtc(year, month, day, hour, minute, second, displayTimezone);
};

/** Keep digits (and optional AM/PM when ampm) and insert date/time separators. */
export const formatDatetimeInput = (text: string, timePrecision: TimePrecision = "minutes", ampm = false): string => {
  const { body, meridian } = ampm ? extractMeridianSuffix(text) : { body: text, meridian: "" };
  const digits = body.replace(/\D/g, "");
  let year = "";
  let month = "";
  let day = "";
  let hour = "";
  let minute = "";
  let second = "";
  let section: "year" | "month" | "day" | "hour" | "minute" | "second" = "year";

  for (const digit of digits) {
    if (section === "year") {
      year += digit;
      if (year.length >= 4) {
        year = year.slice(0, 4);
        section = "month";
      }
      continue;
    }

    if (section === "month") {
      const result = pushTwoDigitSection(month, digit, 12, 1);
      month = result.value;
      if (result.complete) {
        section = "day";
      }
      continue;
    }

    if (section === "day") {
      const result = pushTwoDigitSection(day, digit, 31, 1);
      day = result.value;
      if (result.complete) {
        section = "hour";
      }
      continue;
    }

    if (section === "hour") {
      const result = pushTwoDigitSection(hour, digit, 23, 0);
      hour = result.value;
      if (result.complete) {
        section = "minute";
      }
      continue;
    }

    if (section === "minute") {
      const result = pushTwoDigitSection(minute, digit, 59, 0);
      minute = result.value;
      if (result.complete) {
        if (timePrecision === "seconds") {
          section = "second";
        } else {
          break;
        }
      }
      continue;
    }

    const result = pushTwoDigitSection(second, digit, 59, 0);
    second = result.value;
    if (result.complete) {
      break;
    }
  }

  let result = year;
  if (month || day || hour || minute || second) {
    result = `${year}-${month}`;
  }
  if (day || hour || minute || second) {
    result = `${year}-${month}-${day}`;
  }
  if (hour || minute || second) {
    result = `${year}-${month}-${day} ${hour}`;
  }
  if (minute || second) {
    result = `${year}-${month}-${day} ${hour}:${minute}`;
  }
  if (timePrecision === "seconds" && second) {
    result = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  if (ampm && meridian) {
    const hourValue = Number(hour);
    const looks12h = hour.length === 2 && hourValue >= 1 && hourValue <= 12;
    const timeComplete = timePrecision === "seconds" ? Boolean(second && second.length === 2) : minute.length === 2;
    if (looks12h && (timeComplete || meridian.length === 2)) {
      result = `${result} ${meridian}`;
    }
  }

  return result;
};

export const utcToDisplayCalendarDate = (value: Dayjs, displayTimezone: string): Dayjs => {
  const dateStr = toZonedDayjs(value, displayTimezone).format("YYYY-MM-DD");
  return calendarStringToDayjs(dateStr, displayTimezone === "system" ? undefined : displayTimezone);
};

export const utcToDisplayTimeOfDay = (value: Dayjs, displayTimezone: string): Dayjs => {
  const zoned = toZonedDayjs(value, displayTimezone);
  return createTimeOfDay(zoned.hour(), zoned.minute(), zoned.second());
};

export const applyDatePreservingTime = (
  currentUtc: Dayjs | null | undefined,
  nextCalendarDate: Dayjs,
  displayTimezone: string
): Dayjs => {
  const dateStr = dayjsToCalendarString(nextCalendarDate, displayTimezone === "system" ? undefined : displayTimezone);
  const [year, month, day] = dateStr.split("-").map(Number);

  let hour = 0;
  let minute = 0;
  let second = 0;
  if (currentUtc != null && currentUtc.isValid()) {
    const zoned = toZonedDayjs(currentUtc, displayTimezone);
    hour = zoned.hour();
    minute = zoned.minute();
    second = zoned.second();
  }

  return wallClockToUtc(year, month, day, hour, minute, second, displayTimezone);
};

export const applyTimePreservingDate = (
  currentUtc: Dayjs | null | undefined,
  nextTimeOfDay: Dayjs,
  displayTimezone: string
): Dayjs => {
  let year: number;
  let month: number;
  let day: number;

  if (currentUtc != null && currentUtc.isValid()) {
    const zoned = toZonedDayjs(currentUtc, displayTimezone);
    year = zoned.year();
    month = zoned.month() + 1;
    day = zoned.date();
  } else {
    const today = toZonedDayjs(dayjs(), displayTimezone);
    year = today.year();
    month = today.month() + 1;
    day = today.date();
  }

  return wallClockToUtc(
    year,
    month,
    day,
    nextTimeOfDay.hour(),
    nextTimeOfDay.minute(),
    nextTimeOfDay.second(),
    displayTimezone
  );
};

export const toDayjsBound = (value: Dayjs | Date | string | null | undefined): Dayjs | undefined => {
  if (value == null) {
    return undefined;
  }
  if (dayjs.isDayjs(value)) {
    return value;
  }
  return dayjs(value);
};

export const validateCalendarDate = (
  value: Dayjs | null,
  options: {
    minDate?: Dayjs | null;
    maxDate?: Dayjs | null;
    timezone?: string;
  } = {}
): PickerValidationError => {
  if (value == null) {
    return null;
  }
  if (!value.isValid()) {
    return "invalidDate";
  }

  const dayKey = dayjsToCalendarString(value, options.timezone);
  if (options.minDate && dayKey < dayjsToCalendarString(options.minDate, options.timezone)) {
    return "minDate";
  }
  if (options.maxDate && dayKey > dayjsToCalendarString(options.maxDate, options.timezone)) {
    return "maxDate";
  }
  return null;
};

const calendarDayKey = (value: Dayjs, displayTimezone: string): string => {
  if (displayTimezone === "system") {
    return value.local().format("YYYY-MM-DD");
  }
  return value.tz(displayTimezone).format("YYYY-MM-DD");
};

export const validateDatetimeBounds = (
  value: Dayjs | null,
  options: {
    minDate?: Dayjs | null;
    maxDate?: Dayjs | null;
    minDateTime?: Dayjs | null;
    maxDateTime?: Dayjs | null;
    displayTimezone?: string;
  }
): PickerValidationError => {
  if (value == null || !value.isValid()) {
    return value == null ? null : "invalidDate";
  }

  if (options.minDateTime && value.isBefore(options.minDateTime)) {
    return "minDateTime";
  }
  if (options.maxDateTime && value.isAfter(options.maxDateTime)) {
    return "maxDateTime";
  }

  const displayTimezone = options.displayTimezone ?? "system";
  if (options.minDate) {
    const valueDay = calendarDayKey(value, displayTimezone);
    const minDay = calendarDayKey(options.minDate, displayTimezone);
    if (valueDay < minDay) {
      return "minDate";
    }
  }
  if (options.maxDate) {
    const valueDay = calendarDayKey(value, displayTimezone);
    const maxDay = calendarDayKey(options.maxDate, displayTimezone);
    if (valueDay > maxDay) {
      return "maxDate";
    }
  }

  return null;
};

const pad = (value: number, size = 2): string => String(value).padStart(size, "0");
