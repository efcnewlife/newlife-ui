import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { cn } from "../cn";
import FormField from "../form-field";
import { type Dayjs } from "../lib/dayjs";
import {
  calendarStringToDayjs,
  dayjsToCalendarString,
  formatCalendarDateInput,
  toDayjsBound,
  validateCalendarDate,
} from "../picker/datetime";
import type { PickerChangeMeta, PickerValidationError } from "../picker/types";
import { CONTROL_SIZE_CLASSES, type ControlSize, fieldBase, fieldDisabled, fieldError } from "../theme/role-classes";

export interface DateFieldProps {
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
  labelClassName?: string;
  className?: string;
  size?: ControlSize;
  readOnly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  /** Trailing control inside the input shell (used by DatePicker). Not a calendar icon by default. */
  endAdornment?: ReactNode;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const toDisplay = (value: Dayjs | null | undefined, timezone?: string): string => {
  if (value == null || !value.isValid()) {
    return "";
  }
  return dayjsToCalendarString(value, timezone);
};

export default function DateField({
  id,
  value,
  defaultValue = null,
  onChange,
  timezone,
  minDate,
  maxDate,
  label,
  placeholder = "YYYY-MM-DD",
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
}: DateFieldProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<Dayjs | null>(defaultValue);
  const selectedValue = isControlled ? value : uncontrolledValue;
  const [text, setText] = useState(() => toDisplay(selectedValue, timezone));

  useEffect(() => {
    setText((current) => {
      if (selectedValue != null && selectedValue.isValid()) {
        return toDisplay(selectedValue, timezone);
      }

      // Keep in-progress edits when the committed value becomes null (e.g. backspace).
      // Clear when the field previously showed a complete date (external clear).
      if (DATE_PATTERN.test(current)) {
        const parsed = calendarStringToDayjs(current, timezone);
        if (parsed.isValid()) {
          return "";
        }
      }
      return current;
    });
  }, [selectedValue, timezone]);

  const emit = (next: Dayjs | null, validationError: PickerValidationError) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next, { validationError, source: "field" });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextText = formatCalendarDateInput(event.target.value);
    setText(nextText);

    if (nextText === "") {
      emit(null, null);
      return;
    }

    if (!DATE_PATTERN.test(nextText)) {
      emit(null, "invalidDate");
      return;
    }

    const parsed = calendarStringToDayjs(nextText, timezone);
    if (!parsed.isValid()) {
      emit(null, "invalidDate");
      return;
    }

    const validationError = validateCalendarDate(parsed, {
      minDate: toDayjsBound(minDate),
      maxDate: toDayjsBound(maxDate),
      timezone,
    });
    emit(parsed, validationError);
  };

  return (
    <FormField id={id} label={label} required={required} error={error} wrapperClassName={wrapperClassName} labelClassName={labelClassName}>
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
            className,
          )}
          autoComplete="off"
          inputMode="numeric"
        />
        {endAdornment ? (
          <span className={cn("pointer-events-none absolute inset-y-0 right-3 flex items-center", disabled && "opacity-40")}>
            <span className="pointer-events-auto flex items-center">{endAdornment}</span>
          </span>
        ) : null}
      </div>
    </FormField>
  );
}
