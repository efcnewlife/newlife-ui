import type { Dayjs } from "../lib/dayjs";
import { dayjs } from "../lib/dayjs";
import { pushTwoDigitSection } from "./digit-section";
import {
  extractMeridianSuffix,
  hour12To24,
  isUnambiguous24hHour,
} from "./meridian";

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

export const defaultTimeFormat = (
  timePrecision: TimePrecision = "minutes",
  ampm = false
): string => {
  if (ampm) {
    return timePrecision === "seconds" ? "hh:mm:ss A" : "hh:mm A";
  }
  return timePrecision === "seconds" ? "HH:mm:ss" : "HH:mm";
};

export const dayjsToTimeString = (
  value: Dayjs,
  timePrecision: TimePrecision = "minutes",
  ampm = false,
  format?: string
): string => {
  if (format) {
    return value.format(format);
  }
  return value.format(defaultTimeFormat(timePrecision, ampm));
};

const TIME_24H_MINUTES = /^([01]\d|2[0-3]):([0-5]\d)$/;
const TIME_24H_SECONDS = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
const TIME_12H_MINUTES = /^(0?[1-9]|1[0-2]):([0-5]\d) (AM|PM)$/i;
const TIME_12H_SECONDS = /^(0?[1-9]|1[0-2]):([0-5]\d):([0-5]\d) (AM|PM)$/i;

export const isCompleteTimeString = (
  text: string,
  timePrecision: TimePrecision = "minutes",
  ampm = false
): boolean => {
  if (ampm) {
    const twelveOk =
      timePrecision === "seconds" ? TIME_12H_SECONDS.test(text) : TIME_12H_MINUTES.test(text);
    if (twelveOk) {
      return true;
    }
    const twentyFour =
      timePrecision === "seconds" ? TIME_24H_SECONDS.exec(text) : TIME_24H_MINUTES.exec(text);
    if (!twentyFour) {
      return false;
    }
    return isUnambiguous24hHour(Number(twentyFour[1]));
  }
  return timePrecision === "seconds" ? TIME_24H_SECONDS.test(text) : TIME_24H_MINUTES.test(text);
};

export const parseTimeString = (
  text: string,
  timePrecision: TimePrecision = "minutes",
  ampm = false
): Dayjs | null => {
  if (ampm) {
    const twelve =
      timePrecision === "seconds" ? TIME_12H_SECONDS.exec(text) : TIME_12H_MINUTES.exec(text);
    if (twelve) {
      const hour12 = Number(twelve[1]);
      const minute = Number(twelve[2]);
      const second = timePrecision === "seconds" ? Number(twelve[3]) : 0;
      const meridian = timePrecision === "seconds" ? twelve[4]! : twelve[3]!;
      return createTimeOfDay(hour12To24(hour12, meridian), minute, second);
    }
  }

  if (!isCompleteTimeString(text, timePrecision, ampm)) {
    return null;
  }

  const twentyFour =
    timePrecision === "seconds" ? TIME_24H_SECONDS.exec(text) : TIME_24H_MINUTES.exec(text);
  if (!twentyFour) {
    return null;
  }

  const hour = Number(twentyFour[1]);
  const minute = Number(twentyFour[2]);
  const second = timePrecision === "seconds" ? Number(twentyFour[3]) : 0;
  return createTimeOfDay(hour, minute, second);
};

/** Keep digits (and optional AM/PM when ampm) and insert `:`. */
export const formatTimeInput = (
  text: string,
  timePrecision: TimePrecision = "minutes",
  ampm = false
): string => {
  const { body, meridian } = ampm ? extractMeridianSuffix(text) : { body: text, meridian: "" };
  const digits = body.replace(/\D/g, "");
  let hour = "";
  let minute = "";
  let second = "";
  let section: "hour" | "minute" | "second" = "hour";

  for (const digit of digits) {
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

  let result = hour;
  if (!minute && !second) {
    result = hour;
  } else if (timePrecision === "seconds" && second) {
    result = `${hour}:${minute}:${second}`;
  } else {
    result = minute ? `${hour}:${minute}` : hour;
  }

  if (ampm && meridian) {
    const hourValue = Number(hour);
    const looks12h = hour.length === 2 && hourValue >= 1 && hourValue <= 12;
    const timeComplete =
      timePrecision === "seconds" ? Boolean(second && second.length === 2) : minute.length === 2;
    if (looks12h && (timeComplete || meridian.length === 2)) {
      result = `${result} ${meridian}`;
    }
  }

  return result;
};

const pad = (value: number, size = 2): string => String(value).padStart(size, "0");
