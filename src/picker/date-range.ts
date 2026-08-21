import type { Dayjs } from "../lib/dayjs";
import {
  calendarStringToDayjs,
  dayjsToCalendarString,
  formatCalendarDateInput,
  toDayjsBound,
  validateCalendarDate,
} from "./datetime";
import type { PickerValidationError } from "./types";

export type DateRangeValue = {
  start: Dayjs | null;
  end: Dayjs | null;
};

export type DateRangeShortcut = {
  id?: string;
  label: string;
  getValue: () => DateRangeValue | null;
};

/** Display separator between start and end (space + en dash + space). */
export const DATE_RANGE_SEPARATOR = " – ";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const isCompleteDateRange = (
  value: DateRangeValue | null | undefined
): value is { start: Dayjs; end: Dayjs } => {
  return value != null && value.start != null && value.end != null;
};

export const isHalfDateRange = (value: DateRangeValue | null | undefined): value is { start: Dayjs; end: null } => {
  return value != null && value.start != null && value.end == null;
};

const dayKey = (value: Dayjs, timezone?: string): string => dayjsToCalendarString(value, timezone);

export const normalizeDateRange = (value: DateRangeValue | null, timezone?: string): DateRangeValue | null => {
  if (value == null) {
    return null;
  }

  const { start, end } = value;
  if (start == null) {
    // Reject end-only; treat as empty.
    return null;
  }

  if (end == null) {
    return { start, end: null };
  }

  if (dayKey(end, timezone) < dayKey(start, timezone)) {
    return { start: end, end: start };
  }

  return { start, end };
};

export const applyDateRangeDayClick = (
  current: DateRangeValue | null,
  clicked: Dayjs,
  timezone?: string
): DateRangeValue => {
  const resolved = calendarStringToDayjs(dayjsToCalendarString(clicked, timezone), timezone);

  if (current == null || isCompleteDateRange(current) || current.start == null) {
    return { start: resolved, end: null };
  }

  const startKey = dayKey(current.start, timezone);
  const clickKey = dayKey(resolved, timezone);
  if (clickKey < startKey) {
    return { start: resolved, end: current.start };
  }
  return { start: current.start, end: resolved };
};

export const formatDateRangeDisplay = (value: DateRangeValue | null | undefined, timezone?: string): string => {
  if (value == null || value.start == null || !value.start.isValid()) {
    return "";
  }

  const startText = dayjsToCalendarString(value.start, timezone);
  if (value.end == null || !value.end.isValid()) {
    return `${startText}${DATE_RANGE_SEPARATOR}`;
  }

  return `${startText}${DATE_RANGE_SEPARATOR}${dayjsToCalendarString(value.end, timezone)}`;
};

const splitRangeText = (text: string): { startText: string; endText: string | null } => {
  const enDashIndex = text.indexOf("–");
  if (enDashIndex >= 0) {
    return {
      startText: text.slice(0, enDashIndex).trim(),
      endText: text.slice(enDashIndex + 1).trim(),
    };
  }

  // Space-hyphen-space between two calendar dates (not internal YYYY-MM-DD dashes).
  const spacedHyphen = text.match(/^(\d{4}-\d{2}-\d{0,2})\s+-\s+(.*)$/);
  if (spacedHyphen) {
    return {
      startText: spacedHyphen[1].trim(),
      endText: spacedHyphen[2].trim(),
    };
  }

  return { startText: text.trim(), endText: null };
};

/** Format typed range text; formats each side like DateField. */
export const formatDateRangeInput = (text: string): string => {
  const hasEnDash = text.includes("–");
  const hasSpacedHyphen = /\d\s+-\s+/.test(text);
  if (!hasEnDash && !hasSpacedHyphen) {
    return formatCalendarDateInput(text);
  }

  const { startText, endText } = splitRangeText(text);
  const formattedStart = formatCalendarDateInput(startText);
  if (endText == null || endText === "") {
    return `${formattedStart}${DATE_RANGE_SEPARATOR}`;
  }
  return `${formattedStart}${DATE_RANGE_SEPARATOR}${formatCalendarDateInput(endText)}`;
};

export const parseDateRangeInput = (
  text: string,
  options: {
    timezone?: string;
    minDate?: Dayjs | Date | string | null;
    maxDate?: Dayjs | Date | string | null;
  } = {}
): { value: DateRangeValue | null; validationError: PickerValidationError } => {
  const trimmed = text.trim();
  if (trimmed === "") {
    return { value: null, validationError: null };
  }

  const { startText, endText } = splitRangeText(trimmed);
  const minBound = toDayjsBound(options.minDate ?? undefined);
  const maxBound = toDayjsBound(options.maxDate ?? undefined);

  if (!DATE_PATTERN.test(startText)) {
    return { value: null, validationError: "invalidDate" };
  }

  const start = calendarStringToDayjs(startText, options.timezone);
  if (!start.isValid()) {
    return { value: null, validationError: "invalidDate" };
  }

  const startError = validateCalendarDate(start, {
    minDate: minBound,
    maxDate: maxBound,
    timezone: options.timezone,
  });
  if (startError) {
    return { value: null, validationError: startError };
  }

  if (endText == null || endText === "") {
    return { value: { start, end: null }, validationError: null };
  }

  if (!DATE_PATTERN.test(endText)) {
    return { value: null, validationError: "invalidDate" };
  }

  const end = calendarStringToDayjs(endText, options.timezone);
  if (!end.isValid()) {
    return { value: null, validationError: "invalidDate" };
  }

  const endError = validateCalendarDate(end, {
    minDate: minBound,
    maxDate: maxBound,
    timezone: options.timezone,
  });
  if (endError) {
    return { value: null, validationError: endError };
  }

  return {
    value: normalizeDateRange({ start, end }, options.timezone),
    validationError: null,
  };
};

export const validateDateRangeValue = (
  value: DateRangeValue | null,
  options: {
    timezone?: string;
    minDate?: Dayjs | null;
    maxDate?: Dayjs | null;
  } = {}
): PickerValidationError => {
  if (value == null) {
    return null;
  }
  if (value.start == null) {
    return "invalidDate";
  }

  const startError = validateCalendarDate(value.start, options);
  if (startError) {
    return startError;
  }
  if (value.end == null) {
    return null;
  }
  return validateCalendarDate(value.end, options);
};
