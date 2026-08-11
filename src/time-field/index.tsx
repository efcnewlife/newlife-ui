import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { cn } from "../cn";
import FormField from "../form-field";
import { type Dayjs } from "../lib/dayjs";
import {
  dayjsToTimeString,
  parseTimeString,
  toTimeOfDay,
  type TimePrecision,
} from "../picker/time";
import type { PickerChangeMeta, PickerValidationError } from "../picker/types";
import { fieldBase, fieldDisabled, fieldError } from "../theme/role-classes";

export interface TimeFieldProps {
  id: string;
  value?: Dayjs | null;
  defaultValue?: Dayjs | null;
  onChange?: (value: Dayjs | null, meta: PickerChangeMeta) => void;
  timePrecision?: TimePrecision;
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
  /** Trailing control inside the input shell (used by TimePicker). Not a clock icon by default. */
  endAdornment?: ReactNode;
}

const toDisplay = (
  value: Dayjs | null | undefined,
  timePrecision: TimePrecision
): string => {
  if (value == null || !value.isValid()) {
    return "";
  }
  return dayjsToTimeString(toTimeOfDay(value), timePrecision);
};

export default function TimeField({
  id,
  value,
  defaultValue = null,
  onChange,
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
}: TimeFieldProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<Dayjs | null>(
    defaultValue
  );
  const selectedValue = isControlled ? value : uncontrolledValue;
  const resolvedPlaceholder =
    placeholder ?? (timePrecision === "seconds" ? "HH:mm:ss" : "HH:mm");
  const [text, setText] = useState(() => toDisplay(selectedValue, timePrecision));

  useEffect(() => {
    setText(toDisplay(selectedValue, timePrecision));
  }, [selectedValue, timePrecision]);

  const emit = (next: Dayjs | null, validationError: PickerValidationError) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next, { validationError, source: "field" });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextText = event.target.value;
    setText(nextText);

    if (nextText === "") {
      emit(null, null);
      return;
    }

    const parsed = parseTimeString(nextText, timePrecision);
    if (parsed == null) {
      emit(null, "invalidDate");
      return;
    }

    emit(parsed, null);
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
