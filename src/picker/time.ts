import type { Dayjs } from "../lib/dayjs";
import { dayjs } from "../lib/dayjs";

/** Fixed conventional calendar day for time-of-day Day.js values. */
export const TIME_OF_DAY_ANCHOR = "1970-01-01";

export type TimePrecision = "minutes" | "seconds";

export const createTimeOfDay = (
  hour: number,
  minute: number,
  second = 0
): Dayjs => {
  return dayjs(
    `${TIME_OF_DAY_ANCHOR} ${pad(hour)}:${pad(minute)}:${pad(second)}`,
    "YYYY-MM-DD HH:mm:ss"
  );
};

export const toTimeOfDay = (value: Dayjs): Dayjs => {
  return createTimeOfDay(value.hour(), value.minute(), value.second());
};

export const dayjsToTimeString = (
  value: Dayjs,
  timePrecision: TimePrecision = "minutes"
): string => {
  if (timePrecision === "seconds") {
    return value.format("HH:mm:ss");
  }
  return value.format("HH:mm");
};

export const parseTimeString = (
  text: string,
  timePrecision: TimePrecision = "minutes"
): Dayjs | null => {
  const pattern =
    timePrecision === "seconds"
      ? /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
      : /^([01]\d|2[0-3]):([0-5]\d)$/;

  const match = pattern.exec(text);
  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = timePrecision === "seconds" ? Number(match[3]) : 0;
  return createTimeOfDay(hour, minute, second);
};

const pad = (value: number, size = 2): string => String(value).padStart(size, "0");
