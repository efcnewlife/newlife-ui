import { useCallback, useRef, useState } from "react";
import { MdCalendarMonth, MdClear } from "react-icons/md";
import { cn } from "../cn";
import type { DateCalendarLabels, WeekStartsOn } from "../date-calendar";
import DateCalendar from "../date-calendar";
import DateTimeField from "../date-time-field";
import { FloatingSurface } from "../floating-surface";
import { dayjs, type Dayjs } from "../lib/dayjs";
import {
  applyDatePreservingTime,
  applyTimePreservingDate,
  resolveDisplayTimezone,
  utcToDisplayCalendarDate,
  utcToDisplayTimeOfDay,
  validateDatetimeBounds,
} from "../picker/datetime";
import DigitalTimeSurface, { type DigitalTimeVariant } from "../picker/digital-time-surface";
import type { TimePrecision } from "../picker/time";
import type { PickerChangeMeta } from "../picker/types";
import { surfacePanel, textMuted } from "../theme/role-classes";

export type { DigitalTimeVariant };
export type DateTimePickerTimePrecision = TimePrecision;

export interface DateTimePickerLabels extends DateCalendarLabels {
  clear?: string;
  cancel?: string;
  now?: string;
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
  /** Day.js tokens for committed field display only; forwarded to DateTimeField. */
  format?: string;
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
  format,
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
  const cancelLabel = labels?.cancel ?? "Cancel";
  const submitLabel = labels?.submit ?? "OK";
  const nowLabel = labels?.now ?? "Now";
  const dismissSurface = useCallback(() => setOpen(false), []);

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
    const next = applyDatePreservingTime(selectedValue, nextCalendarDate, displayTimezone);
    emitChange(next, "view");
  };

  const handleTimeChange = (nextTimeOfDay: Dayjs) => {
    const next = applyTimePreservingDate(selectedValue, nextTimeOfDay, displayTimezone);
    emitChange(next, "view");
  };

  const handleClear = () => {
    if (disabled) {
      return;
    }
    emitChange(null, "field");
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleNow = () => {
    if (disabled) {
      return;
    }
    let now = dayjs.utc();
    if (timePrecision === "minutes") {
      now = now.second(0).millisecond(0);
    } else {
      now = now.millisecond(0);
    }
    emitChange(now, "view");
  };

  const handleSubmit = () => {
    onSubmit?.();
    setOpen(false);
  };

  const calendarValue = selectedValue != null && selectedValue.isValid() ? utcToDisplayCalendarDate(selectedValue, displayTimezone) : null;
  const timeValue = selectedValue != null && selectedValue.isValid() ? utcToDisplayTimeOfDay(selectedValue, displayTimezone) : null;

  const iconButtonClassName = cn(
    "inline-flex size-7 items-center justify-center rounded-md transition-colors",
    textMuted,
    disabled && "cursor-not-allowed",
  );
  const footerActionClassName = cn(
    "h-8 rounded-md px-3 text-sm font-medium text-primary transition-colors",
    "hover:bg-primary/10",
    disabled && "cursor-not-allowed opacity-40",
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
        ampm={ampm}
        format={format}
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
              className={cn(iconButtonClassName, "hover:bg-surface-variant hover:text-on-surface")}
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

      <FloatingSurface
        open={open}
        anchorRef={rootRef}
        onDismiss={dismissSurface}
        placement="bottom-start"
        offset={8}
        className={cn("flex flex-col", surfacePanel, "rounded-2xl")}
      >
          <div className="flex flex-col gap-2 p-2 sm:flex-row">
            <DateCalendar
              value={calendarValue}
              onChange={handleCalendarChange}
              timezone={timezone}
              minDate={minDate ?? undefined}
              maxDate={maxDate ?? undefined}
              weekStartsOn={weekStartsOn}
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

          {showSubmitButton ? (
            <div className="flex flex-col">
              <div className="border-t border-outline-variant" />
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <button
                  type="button"
                  className={footerActionClassName}
                  onClick={handleNow}
                  disabled={disabled}
                >
                  {nowLabel}
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className={footerActionClassName}
                    onClick={handleCancel}
                    disabled={disabled}
                  >
                    {cancelLabel}
                  </button>
                  <button
                    type="button"
                    className={footerActionClassName}
                    onClick={handleSubmit}
                    disabled={disabled}
                  >
                    {submitLabel}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
      </FloatingSurface>
    </div>
  );
}
