import type { Dayjs } from "../lib/dayjs";
import { dayjs } from "../lib/dayjs";
import type { PickerValidationError } from "../picker/types";
import { pushTwoDigitSection } from "./digit-section";

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
    const candidateTimezone = (candidate as Dayjs & { $x?: { $timezone?: string } }).$x
      ?.$timezone;
    if (candidateTimezone) {
      return candidateTimezone;
    }
    if ((candidate as Dayjs & { $u?: boolean }).$u) {
      return "UTC";
    }
  }

  return "system";
};

export const toWallClockDate = (value: Dayjs, displayTimezone: string): Date => {
  const zoned =
    displayTimezone === "system" ? value.local() : value.tz(displayTimezone);

  return new Date(
    zoned.year(),
    zoned.month(),
    zoned.date(),
    zoned.hour(),
    zoned.minute(),
    zoned.second(),
    zoned.millisecond()
  );
};

export const fromWallClockDateToUtc = (date: Date, displayTimezone: string): Dayjs => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const millisecond = date.getMilliseconds();
  const wall = `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}.${pad(millisecond, 3)}`;

  if (displayTimezone === "system") {
    return dayjs(wall, "YYYY-MM-DD HH:mm:ss.SSS").utc();
  }

  return dayjs.tz(wall, "YYYY-MM-DD HH:mm:ss.SSS", displayTimezone).utc();
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


export const dayjsOrNullToFlatpickr = (
  value: Dayjs | Dayjs[] | null | undefined,
  timezone?: string
): string | string[] | undefined => {
  if (value == null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.map((item) => dayjsToCalendarString(item, timezone));
  }
  return dayjsToCalendarString(value, timezone);
};

export const toDayjsBound = (
  value: Dayjs | Date | string | null | undefined
): Dayjs | undefined => {
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
