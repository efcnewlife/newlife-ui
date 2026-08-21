import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { cn } from "../cn";
import FormField from "../form-field";
import type { Dayjs } from "../lib/dayjs";
import {
  DATE_RANGE_SEPARATOR,
  formatDateRangeDisplay,
  formatDateRangeInput,
  parseDateRangeInput,
  type DateRangeValue,
} from "../picker/date-range";
import type { PickerChangeMeta, PickerValidationError } from "../picker/types";
import { CONTROL_SIZE_CLASSES, type ControlSize, fieldBase, fieldDisabled, fieldError } from "../theme/role-classes";

export interface DateRangeFieldProps {
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
  wrapperClassName?: string;
  labelClassName?: string;
  className?: string;
  size?: ControlSize;
  readOnly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  /** Trailing control inside the input shell (used by DateRangePicker). */
  endAdornment?: ReactNode;
}

export default function DateRangeField({
  id,
  value,
  defaultValue = null,
  onChange,
  timezone,
  minDate,
  maxDate,
  label,
  placeholder = `YYYY-MM-DD${DATE_RANGE_SEPARATOR}YYYY-MM-DD`,
  error,
  required,
  disabled,
  wrapperClassName,
  labelClassName,
  className,
  size = "md",
  readOnly,
  onFocus,
  onBlur,
  endAdornment,
}: DateRangeFieldProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<DateRangeValue | null>(defaultValue);
  const selectedValue = isControlled ? value : uncontrolledValue;
  const [text, setText] = useState(() => formatDateRangeDisplay(selectedValue, timezone));

  useEffect(() => {
    setText((current) => {
      if (selectedValue != null && selectedValue.start != null && selectedValue.start.isValid()) {
        return formatDateRangeDisplay(selectedValue, timezone);
      }

      // Keep in-progress edits when the committed value becomes null (e.g. backspace).
      // Clear when the field previously showed a committed range (external clear).
      const parsed = parseDateRangeInput(current, { timezone });
      if (parsed.value != null) {
        return "";
      }
      return current;
    });
  }, [selectedValue, timezone]);

  const emit = (next: DateRangeValue | null, validationError: PickerValidationError) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next, { validationError, source: "field" });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextText = formatDateRangeInput(event.target.value);
    setText(nextText);

    const parsed = parseDateRangeInput(nextText, { timezone, minDate, maxDate });
    emit(parsed.value, parsed.validationError);
  };

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
    >
      <div className="relative">
        <input
          id={id}
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={cn(
            fieldBase,
            error && fieldError,
            disabled && fieldDisabled,
            CONTROL_SIZE_CLASSES[size],
            endAdornment && "pr-11",
            className
          )}
          autoComplete="off"
          inputMode="text"
        />
        {endAdornment ? (
          <span
            className={cn("pointer-events-none absolute inset-y-0 right-3 flex items-center", disabled && "opacity-40")}
          >
            <span className="pointer-events-auto flex items-center">{endAdornment}</span>
          </span>
        ) : null}
      </div>
    </FormField>
  );
}
