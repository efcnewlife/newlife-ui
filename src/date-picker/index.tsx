import { useEffect, useRef, useState } from "react";
import { MdCalendarToday } from "react-icons/md";
import { cn } from "../cn";
import DateCalendar from "../date-calendar";
import type { DateCalendarLabels, WeekStartsOn } from "../date-calendar";
import DateField from "../date-field";
import type { Dayjs } from "../lib/dayjs";
import type { PickerChangeMeta } from "../picker/types";
import { textMuted } from "../theme/role-classes";

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
  wrapperClassName?: string;
  weekStartsOn?: WeekStartsOn;
  showSubmitButton?: boolean;
  onSubmit?: () => void;
  labels?: DateCalendarLabels;
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
  wrapperClassName,
  weekStartsOn,
  showSubmitButton,
  onSubmit,
  labels,
}: DatePickerProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<Dayjs | null>(defaultValue);
  const selectedValue = isControlled ? value : uncontrolledValue;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

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

  const handleSubmit = () => {
    onSubmit?.();
    setOpen(false);
  };

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
        onFocus={() => {
          if (!disabled) {
            setOpen(true);
          }
        }}
        endAdornment={
          <button
            type="button"
            aria-label="Open calendar"
            aria-expanded={open}
            disabled={disabled}
            className={cn(textMuted, disabled && "cursor-not-allowed")}
            onClick={() => {
              if (!disabled) {
                setOpen((current) => !current);
              }
            }}
          >
            <MdCalendarToday className="size-6" />
          </button>
        }
      />

      {open ? (
        <div className="absolute z-20 mt-2">
          <DateCalendar
            value={selectedValue}
            onChange={handleCalendarChange}
            timezone={timezone}
            minDate={minDate}
            maxDate={maxDate}
            weekStartsOn={weekStartsOn}
            showSubmitButton={showSubmitButton}
            onSubmit={handleSubmit}
            labels={labels}
            disabled={disabled}
          />
        </div>
      ) : null}
    </div>
  );
}
