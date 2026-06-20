import { cn } from "../cn";
import FormField from "../form-field";
import { ChangeEvent } from "react";
import { MdAccessTime } from "react-icons/md";
import { fieldBase, fieldDisabled, fieldError, textMuted } from "../theme/role-classes";

interface TimePickerProps {
  id: string;
  name?: string;
  label?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  step?: number;
  className?: string;
  wrapperClassName?: string;
}

const TimePicker = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  min,
  max,
  step,
  className,
  wrapperClassName,
}: TimePickerProps) => {
  const inputClasses = cn(
    fieldBase,
    "pr-11",
    error && fieldError,
    disabled && fieldDisabled,
    className
  );

  return (
    <FormField id={id} label={label} required={required} error={error} wrapperClassName={wrapperClassName}>
      <div className="relative">
        <input
          type="time"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={inputClasses}
        />

        <span className={`absolute -translate-y-1/2 pointer-events-none right-3 top-1/2 ${textMuted}`}>
          <MdAccessTime className="size-6" />
        </span>
      </div>
    </FormField>
  );
};

export default TimePicker;
