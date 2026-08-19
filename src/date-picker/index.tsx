import { useCallback, useRef, useState } from "react";
import { MdCalendarMonth, MdClear } from "react-icons/md";
import { cn } from "../cn";
import type { DateCalendarLabels, WeekStartsOn } from "../date-calendar";
import DateCalendar from "../date-calendar";
import DateField from "../date-field";
import { FloatingSurface } from "../floating-surface";
import type { Dayjs } from "../lib/dayjs";
import type { PickerChangeMeta } from "../picker/types";
import { textMuted } from "../theme/role-classes";

export interface DatePickerLabels extends DateCalendarLabels {
  clear?: string;
}

export interface DatePickerProps {
  id: string;
  value?: Dayjs | null;
  defaultValue?: Dayjs | null;
  onChange?: (value: Dayjs | null, meta: PickerChangeMeta) => void;
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
  weekStartsOn?: WeekStartsOn;
  showSubmitButton?: boolean;
  showTodayButton?: boolean;
  onSubmit?: () => void;
  labels?: DatePickerLabels;
}

export type DatePickerValue = Dayjs | null;

export default function DatePicker({
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
  weekStartsOn,
  showSubmitButton,
  showTodayButton,
  onSubmit,
  labels,
}: DatePickerProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<Dayjs | null>(defaultValue);
  const selectedValue = isControlled ? value : uncontrolledValue;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hasValue = selectedValue != null && selectedValue.isValid();
  const showClear = clearable && !disabled && hasValue;
  const clearLabel = labels?.clear ?? "Clear";
  const dismissSurface = useCallback(() => setOpen(false), []);

  const handleChange = (next: Dayjs | null, meta: PickerChangeMeta) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next, meta);
  };

  const handleCalendarChange = (next: Dayjs | null, meta: PickerChangeMeta) => {
    handleChange(next, meta);
    if (!showSubmitButton) {
      setOpen(false);
    }
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
    "inline-flex size-7 items-center justify-center rounded-md transition-colors",
    textMuted,
    disabled && "cursor-not-allowed",
  );

  return (
    <div ref={rootRef} className="relative">
      <DateField
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

      <FloatingSurface open={open} anchorRef={rootRef} onDismiss={dismissSurface} placement="bottom-start" offset={8}>
        <DateCalendar
          value={selectedValue}
          onChange={handleCalendarChange}
          timezone={timezone}
          minDate={minDate}
          maxDate={maxDate}
          weekStartsOn={weekStartsOn}
          showSubmitButton={showSubmitButton}
          showTodayButton={showTodayButton}
          onSubmit={handleSubmit}
          labels={labels}
          disabled={disabled}
        />
      </FloatingSurface>
    </div>
  );
}
