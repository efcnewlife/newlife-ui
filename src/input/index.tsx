import type React from "react";
import type { FC } from "react";
import { MdClose } from "react-icons/md";
import { cn } from "../cn";
import FormField from "../form-field";
import { fieldBase, fieldDisabled, fieldError, fieldSuccess } from "../theme/role-classes";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string | number | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  wrapperClassName?: string;
  min?: string | number;
  max?: string | number;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: string | undefined;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  iconClick?: () => void;
  required?: boolean;
  clearable?: boolean;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  className = "",
  wrapperClassName,
  min,
  max,
  step,
  disabled = false,
  success = false,
  error,
  hint,
  icon,
  iconPosition = "left",
  iconClick,
  required = false,
  clearable = false,
}) => {
  const shouldShowClear = clearable && value !== null && value !== undefined && value !== "" && type !== "password";

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      const syntheticEvent = {
        target: { value: "" },
        currentTarget: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const rightPadding = shouldShowClear ? "pr-10" : "";

  let inputClasses = cn(fieldBase, rightPadding, className);

  if (disabled) {
    inputClasses = cn(inputClasses, fieldDisabled);
  } else if (error && error !== undefined) {
    inputClasses = cn(inputClasses, fieldError);
  } else if (success) {
    inputClasses = cn(inputClasses, fieldSuccess);
  }

  const iconClasses = `absolute z-30 -translate-y-1/2 top-1/2 ${iconPosition === "left" ? "left-4" : "right-4"} ${
    iconClick ? "cursor-pointer" : ""
  }`;

  const inputPadding = icon ? (iconPosition === "left" ? "pl-11" : "pr-11") : "";

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      hint={hint}
      wrapperClassName={wrapperClassName}
    >
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`${inputPadding} ${inputClasses}`}
        />

        {shouldShowClear && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-hidden text-on-surface-variant hover:text-on-surface"
            aria-label="Clear input"
          >
            <MdClose className="size-4" />
          </button>
        )}
        {icon && (
          <span className={iconClasses} onClick={iconClick}>
            {icon}
          </span>
        )}
      </div>
    </FormField>
  );
};

export default Input;
