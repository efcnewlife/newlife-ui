import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { cn } from "../cn";
import FormField from "../form-field";
import { type Dayjs } from "../lib/dayjs";
import {
  dayjsToDatetimeString,
  formatDatetimeInput,
  parseDatetimeString,
  resolveDisplayTimezone,
  validateDatetimeBounds,
} from "../picker/datetime";
import type { TimePrecision } from "../picker/time";
import type { PickerChangeMeta, PickerValidationError } from "../picker/types";
import { fieldBase, fieldDisabled, fieldError } from "../theme/role-classes";

export type DateTimeFieldTimePrecision = TimePrecision;

export interface DateTimeFieldProps {
  id: string;
  value?: Dayjs | null;
  defaultValue?: Dayjs | null;
  onChange?: (value: Dayjs | null, meta: PickerChangeMeta) => void;
  timezone?: string;
  minDate?: Dayjs | null;
  maxDate?: Dayjs | null;
  minDateTime?: Dayjs | null;
  maxDateTime?: Dayjs | null;
  timePrecision?: DateTimeFieldTimePrecision;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  wrapperClassName?: string;
  className?: string;
  readOnly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  /** Trailing control inside the input shell (used by DateTimePicker). Not a calendar icon by default. */
  endAdornment?: ReactNode;
}

const DATETIME_PATTERN_MINUTES = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
const DATETIME_PATTERN_SECONDS = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

const isCompleteDatetime = (text: string, timePrecision: TimePrecision): boolean => {
  return timePrecision === "seconds"
    ? DATETIME_PATTERN_SECONDS.test(text)
    : DATETIME_PATTERN_MINUTES.test(text);
};

const toDisplay = (
  value: Dayjs | null | undefined,
  displayTimezone: string,
  timePrecision: TimePrecision
): string => {
  if (value == null || !value.isValid()) {
    return "";
  }
  return dayjsToDatetimeString(value.utc(), displayTimezone, timePrecision);
};

export default function DateTimeField({
  id,
  value,
  defaultValue = null,
  onChange,
  timezone,
  minDate,
  maxDate,
  minDateTime,
  maxDateTime,
  timePrecision = "minutes",
  label,
  placeholder,
  error,
  required,
  disabled,
  wrapperClassName,
  className,
  readOnly,
  onFocus,
  onBlur,
  endAdornment,
}: DateTimeFieldProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<Dayjs | null>(defaultValue);
  const selectedValue = isControlled ? value : uncontrolledValue;
  const displayTimezone = resolveDisplayTimezone(timezone, value, defaultValue);
  const resolvedPlaceholder =
    placeholder ??
    (timePrecision === "seconds" ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD HH:mm");
  const [text, setText] = useState(() =>
    toDisplay(selectedValue, displayTimezone, timePrecision)
  );

  useEffect(() => {
    setText((current) => {
      if (selectedValue != null && selectedValue.isValid()) {
        return toDisplay(selectedValue, displayTimezone, timePrecision);
      }

      // Keep in-progress edits when the committed value becomes null (e.g. backspace).
      // Clear when the field previously showed a complete datetime (external clear).
      if (isCompleteDatetime(current, timePrecision)) {
        const parsed = parseDatetimeString(current, displayTimezone, timePrecision);
        if (parsed != null) {
          return "";
        }
      }
      return current;
    });
  }, [selectedValue, displayTimezone, timePrecision]);

  const emit = (next: Dayjs | null, validationError: PickerValidationError) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next, { validationError, source: "field" });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextText = formatDatetimeInput(event.target.value, timePrecision);
    setText(nextText);

    if (nextText === "") {
      emit(null, null);
      return;
    }

    if (!isCompleteDatetime(nextText, timePrecision)) {
      emit(null, "invalidDate");
      return;
    }

    const parsed = parseDatetimeString(nextText, displayTimezone, timePrecision);
    if (parsed == null) {
      emit(null, "invalidDate");
      return;
    }

    const validationError = validateDatetimeBounds(parsed, {
      minDate,
      maxDate,
      minDateTime,
      maxDateTime,
      displayTimezone,
    });
    emit(parsed, validationError);
  };

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      wrapperClassName={wrapperClassName}
    >
      <div className="relative">
        <input
          id={id}
          value={text}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={cn(
            fieldBase,
            error && fieldError,
            disabled && fieldDisabled,
            endAdornment && "pr-11",
            className
          )}
          autoComplete="off"
          inputMode="numeric"
        />
        {endAdornment ? (
          <span
            className={cn(
              "pointer-events-none absolute inset-y-0 right-3 flex items-center",
              disabled && "opacity-40"
            )}
          >
            <span className="pointer-events-auto flex items-center">{endAdornment}</span>
          </span>
        ) : null}
      </div>
    </FormField>
  );
}
