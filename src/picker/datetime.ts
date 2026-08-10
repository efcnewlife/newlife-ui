import type { Dayjs } from "../lib/dayjs";
import { dayjs } from "../lib/dayjs";
import type { PickerValidationError } from "../picker/types";

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
  if (timezone && timezone !== "system") {
    return dayjs.tz(dateStr, "YYYY-MM-DD", timezone);
  }
  return dayjs(dateStr, "YYYY-MM-DD");
};

export const dayjsToCalendarString = (value: Dayjs, timezone?: string): string => {
  if (timezone && timezone !== "system") {
    return value.tz(timezone).format("YYYY-MM-DD");
  }
  return value.format("YYYY-MM-DD");
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
