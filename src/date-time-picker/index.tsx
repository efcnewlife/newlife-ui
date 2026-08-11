import { useEffect, useRef, useState } from "react";
import { MdCalendarMonth, MdClear } from "react-icons/md";
import { cn } from "../cn";
import DateCalendar from "../date-calendar";
import type { DateCalendarLabels, WeekStartsOn } from "../date-calendar";
import DateTimeField from "../date-time-field";
import type { Dayjs } from "../lib/dayjs";
import {
  applyDatePreservingTime,
  applyTimePreservingDate,
  resolveDisplayTimezone,
  utcToDisplayCalendarDate,
  utcToDisplayTimeOfDay,
  validateDatetimeBounds,
} from "../picker/datetime";
import DigitalTimeSurface, {
  type DigitalTimeVariant,
} from "../picker/digital-time-surface";
import type { TimePrecision } from "../picker/time";
import type { PickerChangeMeta } from "../picker/types";
import { surfacePanel, textMuted } from "../theme/role-classes";

export type { DigitalTimeVariant };
export type DateTimePickerTimePrecision = TimePrecision;

export interface DateTimePickerLabels extends DateCalendarLabels {
  clear?: string;
}

export interface DateTimePickerProps {
  id: string;
  value?: Dayjs | null;
  defaultValue?: Dayjs | null;
  onChange?: (value: Dayjs | null, meta: PickerChangeMeta) => void;
  timezone?: string;
  minDate?: Dayjs | null;
  maxDate?: Dayjs | null;
  minDateTime?: Dayjs | null;
  maxDateTime?: Dayjs | null;
  clearable?: boolean;
  minuteStep?: number;
  timePrecision?: DateTimePickerTimePrecision;
  ampm?: boolean;
  variant?: DigitalTimeVariant;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  wrapperClassName?: string;
  weekStartsOn?: WeekStartsOn;
  showSubmitButton?: boolean;
  onSubmit?: () => void;
  labels?: DateTimePickerLabels;
}

export type DateTimePickerValue = Dayjs | null;

export default function DateTimePicker({
  id,
  value,
  defaultValue = null,
  onChange,
  timezone,
  minDate,
  maxDate,
  minDateTime,
  maxDateTime,
  clearable = true,
  minuteStep = 1,
  timePrecision = "minutes",
  ampm = false,
  variant = "sections",
  label,
  placeholder,
  error,
  required,
  disabled,
  wrapperClassName,
  weekStartsOn,
  showSubmitButton = false,
  onSubmit,
  labels,
}: DateTimePickerProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<Dayjs | null>(defaultValue);
  const selectedValue = isControlled ? value : uncontrolledValue;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const displayTimezone = resolveDisplayTimezone(timezone, value, defaultValue);
  const hasValue = selectedValue != null && selectedValue.isValid();
  const showClear = clearable && !disabled && hasValue;
  const clearLabel = labels?.clear ?? "Clear";

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const emitChange = (next: Dayjs | null, source: PickerChangeMeta["source"]) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    const validationError = validateDatetimeBounds(next, {
      minDate,
      maxDate,
      minDateTime,
      maxDateTime,
      displayTimezone,
    });

    onChange?.(next, { validationError, source });
  };

  const handleFieldChange = (next: Dayjs | null, meta: PickerChangeMeta) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next, meta);
  };

  const handleCalendarChange = (nextCalendarDate: Dayjs | null) => {
    if (nextCalendarDate == null) {
      return;
    }
    const next = applyDatePreservingTime(
      selectedValue,
      nextCalendarDate,
      displayTimezone
    );
    emitChange(next, "view");
  };

  const handleTimeChange = (nextTimeOfDay: Dayjs) => {
    const next = applyTimePreservingDate(
      selectedValue,
      nextTimeOfDay,
      displayTimezone
    );
    emitChange(next, "view");
  };

  const handleClear = () => {
    if (disabled) {
      return;
    }
    emitChange(null, "field");
  };

  const handleSubmit = () => {
    onSubmit?.();
    setOpen(false);
  };

  const calendarValue =
    selectedValue != null && selectedValue.isValid()
      ? utcToDisplayCalendarDate(selectedValue, displayTimezone)
      : null;
  const timeValue =
    selectedValue != null && selectedValue.isValid()
      ? utcToDisplayTimeOfDay(selectedValue, displayTimezone)
      : null;

  const iconButtonClassName = cn(
    "inline-flex size-7 items-center justify-center rounded-md transition-colors",
    textMuted,
    disabled && "cursor-not-allowed"
  );

  return (
    <div ref={rootRef} className="relative">
      <DateTimeField
        id={id}
        label={label}
        value={selectedValue}
        onChange={handleFieldChange}
        timezone={timezone}
        minDate={minDate}
        maxDate={maxDate}
        minDateTime={minDateTime}
        maxDateTime={maxDateTime}
        timePrecision={timePrecision}
        placeholder={placeholder}
        error={error}
        required={required}
        disabled={disabled}
        wrapperClassName={wrapperClassName}
        className={showClear ? "pr-16" : undefined}
        onFocus={() => {
          if (!disabled) {
            setOpen(true);
          }
        }}
        endAdornment={
          <span className="flex items-center gap-0.5">
            {showClear ? (
              <button
                type="button"
                aria-label={clearLabel}
                className={cn(iconButtonClassName, "hover:text-on-surface")}
                onClick={handleClear}
              >
                <MdClear className="size-5" />
              </button>
            ) : null}
            <button
              type="button"
              aria-label="Open calendar"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                iconButtonClassName,
                "hover:bg-surface-variant hover:text-on-surface"
              )}
              onClick={() => {
                if (!disabled) {
                  setOpen((current) => !current);
                }
              }}
            >
              <MdCalendarMonth className="size-5" />
            </button>
          </span>
        }
      />

      {open ? (
        <div
          className={cn(
            "absolute z-20 mt-2 flex flex-col gap-2 p-2 sm:flex-row",
            surfacePanel,
            "rounded-2xl"
          )}
        >
          <DateCalendar
            value={calendarValue}
            onChange={handleCalendarChange}
            timezone={timezone}
            minDate={minDate ?? undefined}
            maxDate={maxDate ?? undefined}
            weekStartsOn={weekStartsOn}
            showSubmitButton={showSubmitButton}
            onSubmit={handleSubmit}
            labels={labels}
            disabled={disabled}
          />
          <DigitalTimeSurface
            value={timeValue}
            onChange={handleTimeChange}
            variant={variant}
            minuteStep={minuteStep}
            ampm={ampm}
            timePrecision={timePrecision}
            disabled={disabled}
          />
        </div>
      ) : null}
    </div>
  );
}
