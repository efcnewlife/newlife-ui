import { useEffect, useMemo, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { cn } from "../cn";
import type { WeekStartsOn } from "../date-calendar";
import { dayjs, type Dayjs } from "../lib/dayjs";
import {
  applyDateRangeDayClick,
  isHalfDateRange,
  normalizeDateRange,
  validateDateRangeValue,
  type DateRangeShortcut,
  type DateRangeValue,
} from "../picker/date-range";
import { dayjsToCalendarString, toDayjsBound, validateCalendarDate } from "../picker/datetime";
import type { PickerChangeMeta } from "../picker/types";
import {
  accentPrimarySolid,
  calendarDayBase,
  calendarDayHover,
  calendarDayInRange,
  calendarDayPreviewEnd,
  calendarDayPreviewIn,
  calendarDayPreviewStart,
  calendarDayPreviewStartEnd,
  calendarDaySelected,
  calendarNavButton,
  calendarRangeCellEnd,
  calendarRangeCellIn,
  calendarRangeCellStart,
  calendarShortcutButton,
  surfacePanel,
  textMuted,
  textOnSurface,
} from "../theme/role-classes";

export interface DateRangeCalendarLabels {
  submit?: string;
}

export interface DateRangeCalendarProps {
  value?: DateRangeValue | null;
  defaultValue?: DateRangeValue | null;
  onChange?: (value: DateRangeValue | null, meta: PickerChangeMeta) => void;
  timezone?: string;
  minDate?: Dayjs | Date | string;
  maxDate?: Dayjs | Date | string;
  weekStartsOn?: WeekStartsOn;
  /** Left month of the fixed dual-month layout. */
  defaultMonth?: Dayjs;
  showSubmitButton?: boolean;
  onSubmit?: () => void;
  shortcuts?: DateRangeShortcut[];
  /** Side column for shortcuts. Default `left`. Not rendered below the calendar. */
  shortcutsPlacement?: "left" | "right";
  labels?: DateRangeCalendarLabels;
  className?: string;
  disabled?: boolean;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "TH", "F", "S"] as const;

const rotateWeekdayLabels = (weekStartsOn: WeekStartsOn): string[] => {
  return [...WEEKDAY_LABELS.slice(weekStartsOn), ...WEEKDAY_LABELS.slice(0, weekStartsOn)];
};

const buildMonthGrid = (viewMonth: Dayjs, weekStartsOn: WeekStartsOn): Dayjs[] => {
  const startOfMonth = viewMonth.startOf("month");
  const startOffset = (startOfMonth.day() - weekStartsOn + 7) % 7;
  const gridStart = startOfMonth.subtract(startOffset, "day");
  const days: Dayjs[] = [];
  for (let index = 0; index < 42; index += 1) {
    days.push(gridStart.add(index, "day"));
  }
  return days;
};

type RangePosition = "start" | "end" | "start-end" | "in-range" | null;

type PreviewPosition = "preview-start" | "preview-end" | "preview-in" | "preview-start-end" | null;

const rangePositionForDay = (dayKey: string, value: DateRangeValue | null, timezone?: string): RangePosition => {
  if (value?.start == null) {
    return null;
  }

  const startKey = dayjsToCalendarString(value.start, timezone);
  const endKey = value.end != null ? dayjsToCalendarString(value.end, timezone) : null;

  if (endKey == null) {
    return dayKey === startKey ? "start" : null;
  }

  if (dayKey === startKey && dayKey === endKey) {
    return "start-end";
  }
  if (dayKey === startKey) {
    return "start";
  }
  if (dayKey === endKey) {
    return "end";
  }
  if (dayKey > startKey && dayKey < endKey) {
    return "in-range";
  }
  return null;
};

const previewPositionForDay = (dayKey: string, startKey: string | null, hoverKey: string | null): PreviewPosition => {
  if (startKey == null || hoverKey == null) {
    return null;
  }

  const fromKey = startKey <= hoverKey ? startKey : hoverKey;
  const toKey = startKey <= hoverKey ? hoverKey : startKey;

  if (dayKey === fromKey && dayKey === toKey) {
    return "preview-start-end";
  }
  if (dayKey === fromKey) {
    return "preview-start";
  }
  if (dayKey === toKey) {
    return "preview-end";
  }
  if (dayKey > fromKey && dayKey < toKey) {
    return "preview-in";
  }
  return null;
};

const previewCellClassName = (previewPos: PreviewPosition): string | false => {
  if (previewPos === "preview-start-end") {
    return calendarDayPreviewStartEnd;
  }
  if (previewPos === "preview-start") {
    return calendarDayPreviewStart;
  }
  if (previewPos === "preview-end") {
    return calendarDayPreviewEnd;
  }
  if (previewPos === "preview-in") {
    return calendarDayPreviewIn;
  }
  return false;
};

const rangeCellClassName = (rangePos: RangePosition): string | false => {
  if (rangePos === "in-range") {
    return calendarRangeCellIn;
  }
  if (rangePos === "start") {
    return calendarRangeCellStart;
  }
  if (rangePos === "end") {
    return calendarRangeCellEnd;
  }
  return false;
};

export default function DateRangeCalendar({
  value,
  defaultValue = null,
  onChange,
  timezone,
  minDate,
  maxDate,
  weekStartsOn = 0,
  defaultMonth,
  showSubmitButton = false,
  onSubmit,
  shortcuts,
  shortcutsPlacement = "left",
  labels,
  className,
  disabled = false,
}: DateRangeCalendarProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<DateRangeValue | null>(defaultValue);
  const selectedValue = isControlled ? value : uncontrolledValue;
  const [hoveredDay, setHoveredDay] = useState<Dayjs | null>(null);

  const [viewMonth, setViewMonth] = useState<Dayjs>(() =>
    (defaultMonth ?? selectedValue?.start ?? dayjs()).startOf("month")
  );

  const minBound = toDayjsBound(minDate);
  const maxBound = toDayjsBound(maxDate);
  const submitLabel = labels?.submit ?? "Done";
  const hasShortcuts = Boolean(shortcuts && shortcuts.length > 0);
  const showFooter = showSubmitButton;
  const isSelectingEnd = isHalfDateRange(selectedValue);
  const startKey =
    isSelectingEnd && selectedValue.start != null ? dayjsToCalendarString(selectedValue.start, timezone) : null;
  const hoverKey = isSelectingEnd && hoveredDay != null ? dayjsToCalendarString(hoveredDay, timezone) : null;

  useEffect(() => {
    if (selectedValue?.start?.isValid()) {
      setViewMonth(selectedValue.start.startOf("month"));
    }
  }, [selectedValue?.start]);

  useEffect(() => {
    if (!isSelectingEnd) {
      setHoveredDay(null);
    }
  }, [isSelectingEnd]);

  const weekdayLabels = useMemo(() => rotateWeekdayLabels(weekStartsOn), [weekStartsOn]);

  const leftMonth = viewMonth;
  const rightMonth = viewMonth.add(1, "month");

  const emitChange = (next: DateRangeValue | null) => {
    const normalized = normalizeDateRange(next, timezone);
    const validationError = validateDateRangeValue(normalized, {
      minDate: minBound,
      maxDate: maxBound,
      timezone,
    });
    if (!isControlled) {
      setUncontrolledValue(normalized);
    }
    onChange?.(normalized, { validationError, source: "view" });
  };

  const isDayDisabled = (day: Dayjs): boolean => {
    if (disabled) {
      return true;
    }
    return (
      validateCalendarDate(day, {
        minDate: minBound,
        maxDate: maxBound,
        timezone,
      }) != null
    );
  };

  const handleDayClick = (day: Dayjs) => {
    if (isDayDisabled(day)) {
      return;
    }
    emitChange(applyDateRangeDayClick(selectedValue ?? null, day, timezone));
  };

  const handleShortcut = (shortcut: DateRangeShortcut) => {
    if (disabled) {
      return;
    }
    emitChange(shortcut.getValue());
  };

  const renderMonth = (month: Dayjs) => {
    const calendarDays = buildMonthGrid(month, weekStartsOn);
    return (
      <div className="inline-flex w-72 flex-col items-center gap-2.5">
        <div className="flex w-64 items-center justify-center">
          <button
            type="button"
            className={cn("min-w-32 rounded px-1 text-center text-base font-bold", textOnSurface)}
            disabled
          >
            {month.format("MMMM YYYY")}
          </button>
        </div>

        <div
          role="row"
          aria-label="Weekday headers"
          className="flex w-72 items-center justify-center gap-3.5 border-b border-outline-variant px-7 pb-1"
        >
          {weekdayLabels.map((label, index) => (
            <div
              key={`${month.format("YYYY-MM")}-${label}-${index}`}
              role="columnheader"
              className={cn("w-6 text-center text-xs font-bold", textMuted)}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid w-64 grid-cols-7 gap-y-1">
          {calendarDays.map((day) => {
            const isOutside = day.month() !== month.month();
            const dayKey = dayjsToCalendarString(day, timezone);
            const rangePos = rangePositionForDay(dayKey, selectedValue ?? null, timezone);
            const previewPos = previewPositionForDay(dayKey, startKey, hoverKey);
            const isSelected = rangePos === "start" || rangePos === "end" || rangePos === "start-end";
            const ariaLabel = day.format("MMMM D, YYYY");

            return (
              <div
                key={`${month.format("YYYY-MM")}-${dayKey}`}
                className={cn(
                  "flex h-8 w-full items-center justify-center",
                  rangeCellClassName(rangePos),
                  previewCellClassName(previewPos)
                )}
                data-preview={previewPos ?? undefined}
                onMouseEnter={() => {
                  if (isSelectingEnd && !isDayDisabled(day)) {
                    setHoveredDay(day);
                  }
                }}
              >
                <button
                  type="button"
                  aria-label={ariaLabel}
                  aria-pressed={isSelected || rangePos === "in-range"}
                  data-outside-month={isOutside ? "true" : "false"}
                  data-range={rangePos ?? undefined}
                  disabled={isDayDisabled(day)}
                  className={cn(
                    calendarDayBase,
                    isOutside ? textMuted : textOnSurface,
                    rangePos === "in-range" && calendarDayInRange,
                    isSelected ? calendarDaySelected : !rangePos && calendarDayHover,
                    "disabled:pointer-events-none disabled:opacity-40"
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  {day.date()}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderShortcuts = () => {
    if (!hasShortcuts) {
      return null;
    }

    return (
      <div
        role="list"
        aria-label="Date range shortcuts"
        className={cn(
          "flex min-w-28 max-w-36 flex-col gap-1.5 px-2 py-1",
          shortcutsPlacement === "left"
            ? "border-r border-outline-variant pr-3"
            : "border-l border-outline-variant pl-3"
        )}
        data-shortcuts-placement={shortcutsPlacement}
      >
        {shortcuts!.map((shortcut) => (
          <button
            key={shortcut.id ?? shortcut.label}
            type="button"
            className={cn(calendarShortcutButton, disabled && "opacity-40")}
            onClick={() => handleShortcut(shortcut)}
            disabled={disabled}
          >
            {shortcut.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn("inline-flex flex-col items-center gap-2.5 rounded-2xl py-3.5", surfacePanel, className)}
      data-disabled={disabled || undefined}
      onMouseLeave={() => setHoveredDay(null)}
    >
      <div className="flex items-stretch gap-1 px-2">
        {shortcutsPlacement === "left" ? renderShortcuts() : null}

        <div className="flex items-start gap-2">
          <button
            type="button"
            aria-label="Previous"
            className={cn(calendarNavButton, textOnSurface, "mt-1")}
            onClick={() => setViewMonth((current) => current.subtract(1, "month"))}
            disabled={disabled}
          >
            <MdChevronLeft className="size-5" />
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
            {renderMonth(leftMonth)}
            {renderMonth(rightMonth)}
          </div>

          <button
            type="button"
            aria-label="Next"
            className={cn(calendarNavButton, textOnSurface, "mt-1")}
            onClick={() => setViewMonth((current) => current.add(1, "month"))}
            disabled={disabled}
          >
            <MdChevronRight className="size-5" />
          </button>
        </div>

        {shortcutsPlacement === "right" ? renderShortcuts() : null}
      </div>

      {showFooter ? (
        <div className="flex w-full flex-col items-center gap-2.5 px-4">
          <div className="w-full border-t border-outline-variant" />
          <div className="flex w-full items-center justify-end">
            <button
              type="button"
              className={cn("h-8 min-w-16 rounded-md px-3 text-center text-xs font-bold", accentPrimarySolid)}
              onClick={onSubmit}
              disabled={disabled}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
