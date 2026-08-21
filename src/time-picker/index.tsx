import { useCallback, useRef, useState } from "react";
import { MdAccessTime, MdClear } from "react-icons/md";
import { cn } from "../cn";
import { FloatingSurface } from "../floating-surface";
import type { Dayjs } from "../lib/dayjs";
import DigitalTimeSurface, { type DigitalTimeVariant } from "../picker/digital-time-surface";
import type { TimePrecision } from "../picker/time";
import type { PickerChangeMeta } from "../picker/types";
import {
  CONTROL_ADORNMENT_BUTTON_CLASSES,
  CONTROL_ADORNMENT_ICON_CLASSES,
  type ControlSize,
  textMuted,
} from "../theme/role-classes";
import TimeField from "../time-field";

export type { DigitalTimeVariant };

export interface TimePickerLabels {
  clear?: string;
}

export interface TimePickerProps {
  id: string;
  value?: Dayjs | null;
  defaultValue?: Dayjs | null;
  onChange?: (value: Dayjs | null, meta: PickerChangeMeta) => void;
  variant?: DigitalTimeVariant;
  minuteStep?: number;
  ampm?: boolean;
  /** Day.js tokens for committed field display only; forwarded to TimeField. */
  format?: string;
  timePrecision?: TimePrecision;
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
  labels?: TimePickerLabels;
}

export type TimePickerValue = Dayjs | null;

export default function TimePicker({
  id,
  value,
  defaultValue = null,
  onChange,
  variant = "sections",
  minuteStep = 1,
  ampm = false,
  format,
  timePrecision = "minutes",
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
  labels,
}: TimePickerProps) {
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

  const handleViewChange = (next: Dayjs, meta: PickerChangeMeta) => {
    handleChange(next, meta);
  };

  const handleClear = () => {
    if (disabled) {
      return;
    }
    handleChange(null, { validationError: null, source: "field" });
  };

  const iconButtonClassName = cn(
    "inline-flex items-center justify-center rounded-md transition-colors",
    CONTROL_ADORNMENT_BUTTON_CLASSES[size],
    textMuted,
    disabled && "cursor-not-allowed"
  );

  return (
    <div ref={rootRef} className="relative">
      <TimeField
        id={id}
        label={label}
        value={selectedValue}
        onChange={handleChange}
        timePrecision={timePrecision}
        ampm={ampm}
        format={format}
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
              aria-label="Open time picker"
              aria-expanded={open}
              disabled={disabled}
              className={cn(iconButtonClassName, "hover:bg-surface-variant hover:text-on-surface")}
              onClick={() => {
                if (!disabled) {
                  setOpen((current) => !current);
                }
              }}
            >
              <MdAccessTime className={CONTROL_ADORNMENT_ICON_CLASSES[size]} />
            </button>
          </span>
        }
      />

      <FloatingSurface open={open} anchorRef={rootRef} onDismiss={dismissSurface} placement="bottom-start" offset={8}>
        <DigitalTimeSurface
          value={selectedValue}
          onChange={handleViewChange}
          variant={variant}
          minuteStep={minuteStep}
          ampm={ampm}
          timePrecision={timePrecision}
          disabled={disabled}
        />
      </FloatingSurface>
    </div>
  );
}
