import { useCallback, useRef, useState } from "react";
import { MdCalendarMonth, MdClear } from "react-icons/md";
import { cn } from "../cn";
import DateRangeCalendar from "../date-range-calendar";
import type { DateRangeCalendarLabels } from "../date-range-calendar";
import DateRangeField from "../date-range-field";
import { FloatingSurface } from "../floating-surface";
import type { Dayjs } from "../lib/dayjs";
import type { WeekStartsOn } from "../date-calendar";
import {
  isCompleteDateRange,
  type DateRangeShortcut,
  type DateRangeValue,
} from "../picker/date-range";
import type { PickerChangeMeta } from "../picker/types";
import {
  CONTROL_ADORNMENT_BUTTON_CLASSES,
  CONTROL_ADORNMENT_ICON_CLASSES,
  type ControlSize,
  textMuted,
} from "../theme/role-classes";

export interface DateRangePickerLabels extends DateRangeCalendarLabels {
  clear?: string;
}

export interface DateRangePickerProps {
  id: string;
  value?: DateRangeValue | null;
  defaultValue?: DateRangeValue | null;
  onChange?: (value: DateRangeValue | null, meta: PickerChangeMeta) => void;
  timezone?: string;
  minDate?: Dayjs | Date | string;
  maxDate?: Dayjs | Date | string;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  className?: string;
  size?: ControlSize;
  weekStartsOn?: WeekStartsOn;
  defaultMonth?: Dayjs;
  showSubmitButton?: boolean;
  onSubmit?: () => void;
  shortcuts?: DateRangeShortcut[];
  /** Side column for shortcuts on the calendar. Default `left`. */
  shortcutsPlacement?: "left" | "right";
  labels?: DateRangePickerLabels;
}

export type DateRangePickerValue = DateRangeValue | null;

export default function DateRangePicker({
  id,
  value,
  defaultValue = null,
  onChange,
  timezone,
  minDate,
  maxDate,
  label,
  placeholder,
  error,
  required,
  disabled,
  clearable = true,
  wrapperClassName,
  labelClassName,
  className,
  size = "md",
  weekStartsOn,
  defaultMonth,
  showSubmitButton,
  onSubmit,
  shortcuts,
  shortcutsPlacement,
  labels,
}: DateRangePickerProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<DateRangeValue | null>(
    defaultValue
  );
  const selectedValue = isControlled ? value : uncontrolledValue;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hasValue =
    selectedValue != null &&
    selectedValue.start != null &&
    selectedValue.start.isValid();
  const showClear = clearable && !disabled && hasValue;
  const clearLabel = labels?.clear ?? "Clear";
  const dismissSurface = useCallback(() => setOpen(false), []);

  const maybeCloseAfterComplete = (
    next: DateRangeValue | null,
    meta: PickerChangeMeta
  ) => {
    if (showSubmitButton) {
      return;
    }
    if (isCompleteDateRange(next)) {
      setOpen(false);
      return;
    }
    // Close on explicit clear, not on in-progress invalid field edits.
    if (next == null && meta.validationError == null) {
      setOpen(false);
    }
  };

  const handleChange = (next: DateRangeValue | null, meta: PickerChangeMeta) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next, meta);
    maybeCloseAfterComplete(next, meta);
  };

  const handleCalendarChange = (next: DateRangeValue | null, meta: PickerChangeMeta) => {
    handleChange(next, meta);
  };

  const handleClear = () => {
    if (disabled) {
      return;
    }
    handleChange(null, { validationError: null, source: "field" });
  };

  const handleSubmit = () => {
    onSubmit?.();
    setOpen(false);
  };

  const iconButtonClassName = cn(
    "inline-flex items-center justify-center rounded-md transition-colors",
    CONTROL_ADORNMENT_BUTTON_CLASSES[size],
    textMuted,
    disabled && "cursor-not-allowed"
  );

  return (
    <div ref={rootRef} className="relative">
      <DateRangeField
        id={id}
        label={label}
        value={selectedValue}
        onChange={handleChange}
        timezone={timezone}
        minDate={minDate}
        maxDate={maxDate}
        placeholder={placeholder}
        error={error}
        required={required}
        disabled={disabled}
        wrapperClassName={wrapperClassName}
        labelClassName={labelClassName}
        className={cn(showClear && "pr-16", className)}
        size={size}
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
                <MdClear className={CONTROL_ADORNMENT_ICON_CLASSES[size]} />
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
              <MdCalendarMonth className={CONTROL_ADORNMENT_ICON_CLASSES[size]} />
            </button>
          </span>
        }
      />

      <FloatingSurface open={open} anchorRef={rootRef} onDismiss={dismissSurface} placement="bottom-start" offset={8}>
        <DateRangeCalendar
          value={selectedValue}
          onChange={handleCalendarChange}
          timezone={timezone}
          minDate={minDate}
          maxDate={maxDate}
          weekStartsOn={weekStartsOn}
          defaultMonth={defaultMonth}
          showSubmitButton={showSubmitButton}
          onSubmit={handleSubmit}
          shortcuts={shortcuts}
          shortcutsPlacement={shortcutsPlacement}
          labels={labels}
          disabled={disabled}
        />
      </FloatingSurface>
    </div>
  );
}
