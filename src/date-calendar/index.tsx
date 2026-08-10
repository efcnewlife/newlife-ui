import { useEffect, useMemo, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { cn } from "../cn";
import { dayjs, type Dayjs } from "../lib/dayjs";
import {
  calendarStringToDayjs,
  dayjsToCalendarString,
  toDayjsBound,
  validateCalendarDate,
} from "../picker/datetime";
import type { PickerChangeMeta } from "../picker/types";
import {
  accentPrimarySolid,
  surfacePanel,
  textMuted,
  textOnSurface,
} from "../theme/role-classes";

export type DateCalendarView = "day" | "month" | "year";

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DateCalendarLabels {
  submit?: string;
}

export interface DateCalendarProps {
  value?: Dayjs | null;
  defaultValue?: Dayjs | null;
  onChange?: (value: Dayjs | null, meta: PickerChangeMeta) => void;
  timezone?: string;
  minDate?: Dayjs | Date | string;
  maxDate?: Dayjs | Date | string;
  weekStartsOn?: WeekStartsOn;
  view?: DateCalendarView;
  defaultView?: DateCalendarView;
  onViewChange?: (view: DateCalendarView) => void;
  showSubmitButton?: boolean;
  onSubmit?: () => void;
  labels?: DateCalendarLabels;
  className?: string;
  disabled?: boolean;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "TH", "F", "S"] as const;
const MONTH_SHORT_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const rotateWeekdayLabels = (weekStartsOn: WeekStartsOn): string[] => {
  return [...WEEKDAY_LABELS.slice(weekStartsOn), ...WEEKDAY_LABELS.slice(0, weekStartsOn)];
};

const buildMonthGrid = (
  viewMonth: Dayjs,
  weekStartsOn: WeekStartsOn
): Dayjs[] => {
  const startOfMonth = viewMonth.startOf("month");
  const startOffset = (startOfMonth.day() - weekStartsOn + 7) % 7;
  const gridStart = startOfMonth.subtract(startOffset, "day");
  const days: Dayjs[] = [];
  for (let index = 0; index < 42; index += 1) {
    days.push(gridStart.add(index, "day"));
  }
  return days;
};

const yearWindowStart = (year: number): number => Math.floor(year / 12) * 12;

export default function DateCalendar({
  value,
  defaultValue = null,
  onChange,
  timezone,
  minDate,
  maxDate,
  weekStartsOn = 0,
  view: viewProp,
  defaultView = "day",
  onViewChange,
  showSubmitButton = false,
  onSubmit,
  labels,
  className,
  disabled = false,
}: DateCalendarProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<Dayjs | null>(defaultValue);
  const selectedValue = isControlled ? value : uncontrolledValue;

  const [viewMonth, setViewMonth] = useState<Dayjs>(() =>
    (selectedValue ?? dayjs()).startOf("month")
  );
  const [internalView, setInternalView] = useState<DateCalendarView>(defaultView);
  const view = viewProp ?? internalView;

  const minBound = toDayjsBound(minDate);
  const maxBound = toDayjsBound(maxDate);
  const submitLabel = labels?.submit ?? "Done";

  useEffect(() => {
    if (selectedValue?.isValid()) {
      setViewMonth(selectedValue.startOf("month"));
    }
  }, [selectedValue]);

  const setView = (next: DateCalendarView) => {
    if (viewProp === undefined) {
      setInternalView(next);
    }
    onViewChange?.(next);
  };

  const emitChange = (next: Dayjs) => {
    const resolved = calendarStringToDayjs(dayjsToCalendarString(next, timezone), timezone);
    const validationError = validateCalendarDate(resolved, {
      minDate: minBound,
      maxDate: maxBound,
      timezone,
    });
    if (!isControlled) {
      setUncontrolledValue(resolved);
    }
    onChange?.(resolved, { validationError, source: "view" });
  };

  const weekdayLabels = useMemo(
    () => rotateWeekdayLabels(weekStartsOn),
    [weekStartsOn]
  );
  const calendarDays = useMemo(
    () => buildMonthGrid(viewMonth, weekStartsOn),
    [viewMonth, weekStartsOn]
  );

  const headerLabel =
    view === "day"
      ? viewMonth.format("MMMM YYYY")
      : view === "month"
        ? String(viewMonth.year())
        : `${yearWindowStart(viewMonth.year())} – ${yearWindowStart(viewMonth.year()) + 11}`;

  const navigate = (direction: -1 | 1) => {
    if (view === "day") {
      setViewMonth((current) => current.add(direction, "month"));
      return;
    }
    if (view === "month") {
      setViewMonth((current) => current.add(direction, "year"));
      return;
    }
    setViewMonth((current) => current.add(direction * 12, "year"));
  };

  const onHeaderClick = () => {
    if (view === "day") {
      setView("month");
      return;
    }
    if (view === "month") {
      setView("year");
    }
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

  return (
    <div
      className={cn(
        "inline-flex w-72 flex-col items-center gap-2.5 rounded-2xl py-3.5",
        surfacePanel,
        className
      )}
      data-disabled={disabled || undefined}
    >
      <div className="flex w-64 items-center justify-between">
        <div className="flex w-12 items-center justify-start gap-2.5">
          <button
            type="button"
            aria-label="Previous"
            className={cn("flex size-5 items-center justify-center rounded", textOnSurface)}
            onClick={() => navigate(-1)}
            disabled={disabled}
          >
            <MdChevronLeft className="size-5" />
          </button>
          {showSubmitButton ? (
            <button
              type="button"
              aria-label="Next"
              className={cn("flex size-5 items-center justify-center rounded", textOnSurface)}
              onClick={() => navigate(1)}
              disabled={disabled}
            >
              <MdChevronRight className="size-5" />
            </button>
          ) : null}
        </div>

        <button
          type="button"
          className={cn("min-w-32 text-center text-base font-bold", textOnSurface)}
          onClick={onHeaderClick}
          disabled={disabled || view === "year"}
        >
          {headerLabel}
        </button>

        <div className="flex w-12 items-center justify-end">
          {showSubmitButton ? (
            <button
              type="button"
              className={cn(
                "h-5 min-w-12 rounded-[3px] px-1 text-center text-xs font-bold",
                accentPrimarySolid
              )}
              onClick={onSubmit}
              disabled={disabled}
            >
              {submitLabel}
            </button>
          ) : (
            <button
              type="button"
              aria-label="Next"
              className={cn("flex size-5 items-center justify-center rounded", textOnSurface)}
              onClick={() => navigate(1)}
              disabled={disabled}
            >
              <MdChevronRight className="size-5" />
            </button>
          )}
        </div>
      </div>

      {view === "day" ? (
        <>
          <div
            role="row"
            aria-label="Weekday headers"
            className="flex w-72 items-center justify-center gap-3.5 border-b border-outline-variant px-7 pb-1"
          >
            {weekdayLabels.map((label, index) => (
              <div
                key={`${label}-${index}`}
                role="columnheader"
                className={cn("w-6 text-center text-xs font-bold", textMuted)}
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid w-64 grid-cols-7 gap-y-1">
            {calendarDays.map((day) => {
              const isOutside = day.month() !== viewMonth.month();
              const dayKey = dayjsToCalendarString(day, timezone);
              const selectedKey =
                selectedValue != null
                  ? dayjsToCalendarString(selectedValue, timezone)
                  : null;
              const isSelected = selectedKey === dayKey;
              const ariaLabel = day.format("MMMM D, YYYY");

              return (
                <button
                  key={dayKey}
                  type="button"
                  aria-label={ariaLabel}
                  aria-pressed={isSelected}
                  data-outside-month={isOutside ? "true" : "false"}
                  disabled={isDayDisabled(day)}
                  className={cn(
                    "mx-auto flex size-6 items-center justify-center rounded-full text-sm font-semibold",
                    isOutside ? textMuted : textOnSurface,
                    isSelected && "bg-primary text-on-primary"
                  )}
                  onClick={() => emitChange(day)}
                >
                  {day.date()}
                </button>
              );
            })}
          </div>
        </>
      ) : null}

      {view === "month" ? (
        <div className="grid w-64 grid-cols-3 gap-2 py-2">
          {MONTH_SHORT_LABELS.map((label, monthIndex) => (
            <button
              key={label}
              type="button"
              className={cn(
                "rounded-lg px-2 py-2 text-sm font-semibold",
                viewMonth.month() === monthIndex
                  ? "bg-primary text-on-primary"
                  : textOnSurface
              )}
              disabled={disabled}
              onClick={() => {
                setViewMonth(viewMonth.month(monthIndex));
                setView("day");
              }}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {view === "year" ? (
        <div className="grid w-64 grid-cols-3 gap-2 py-2">
          {Array.from({ length: 12 }, (_, index) => {
            const year = yearWindowStart(viewMonth.year()) + index;
            return (
              <button
                key={year}
                type="button"
                className={cn(
                  "rounded-lg px-2 py-2 text-sm font-semibold",
                  viewMonth.year() === year
                    ? "bg-primary text-on-primary"
                    : textOnSurface
                )}
                disabled={disabled}
                onClick={() => {
                  setViewMonth(viewMonth.year(year));
                  setView("month");
                }}
              >
                {year}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
