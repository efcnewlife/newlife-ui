import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { cn } from "../cn";
import FormField from "../form-field";
import { type Dayjs } from "../lib/dayjs";
import {
  dayjsToTimeString,
  defaultTimeFormat,
  formatTimeInput,
  isCompleteTimeString,
  parseTimeString,
  toTimeOfDay,
  type TimePrecision,
} from "../picker/time";
import type { PickerChangeMeta, PickerValidationError } from "../picker/types";
import { CONTROL_SIZE_CLASSES, type ControlSize, fieldBase, fieldDisabled, fieldError } from "../theme/role-classes";

export interface TimeFieldProps {
  id: string;
  value?: Dayjs | null;
  defaultValue?: Dayjs | null;
  onChange?: (value: Dayjs | null, meta: PickerChangeMeta) => void;
  timePrecision?: TimePrecision;
  /** Selects parse / default display clock (24h vs 12h with English AM/PM). */
  ampm?: boolean;
  /** Day.js tokens for committed display only; does not change parse or mask. */
  format?: string;
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
  /** Trailing control inside the input shell (used by TimePicker). Not a clock icon by default. */
  endAdornment?: ReactNode;
}

const toDisplay = (
  value: Dayjs | null | undefined,
  timePrecision: TimePrecision,
  ampm: boolean,
  format?: string
): string => {
  if (value == null || !value.isValid()) {
    return "";
  }
  return dayjsToTimeString(toTimeOfDay(value), timePrecision, ampm, format);
};

export default function TimeField({
  id,
  value,
  defaultValue = null,
  onChange,
  timePrecision = "minutes",
  ampm = false,
  format,
  label,
  placeholder,
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
}: TimeFieldProps) {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<Dayjs | null>(defaultValue);
  const selectedValue = isControlled ? value : uncontrolledValue;
  const resolvedPlaceholder = placeholder ?? defaultTimeFormat(timePrecision, ampm);
  const [text, setText] = useState(() => toDisplay(selectedValue, timePrecision, ampm, format));

  useEffect(() => {
    setText((current) => {
      if (selectedValue != null && selectedValue.isValid()) {
        return toDisplay(selectedValue, timePrecision, ampm, format);
      }

      // Keep in-progress edits when the committed value becomes null (e.g. backspace).
      // Clear when the field previously showed a complete time (external clear).
      if (isCompleteTimeString(current, timePrecision, ampm)) {
        const parsed = parseTimeString(current, timePrecision, ampm);
        if (parsed != null) {
          return "";
        }
      }
      return current;
    });
  }, [selectedValue, timePrecision, ampm, format]);

  const emit = (next: Dayjs | null, validationError: PickerValidationError) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next, { validationError, source: "field" });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextText = formatTimeInput(event.target.value, timePrecision, ampm);
    setText(nextText);

    if (nextText === "") {
      emit(null, null);
      return;
    }

    if (!isCompleteTimeString(nextText, timePrecision, ampm)) {
      emit(null, "invalidDate");
      return;
    }

    const parsed = parseTimeString(nextText, timePrecision, ampm);
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
      labelClassName={labelClassName}
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
            CONTROL_SIZE_CLASSES[size],
            endAdornment && "pr-11",
            className
          )}
          autoComplete="off"
          inputMode={ampm ? "text" : "numeric"}
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
