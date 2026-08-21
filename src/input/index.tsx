import type React from "react";
import type { FC } from "react";
import { MdClose } from "react-icons/md";
import { cn } from "../cn";
import FormField from "../form-field";
import {
  CONTROL_SIZE_CLASSES,
  type ControlSize,
  fieldBase,
  fieldDisabled,
  fieldError,
  fieldSuccess,
} from "../theme/role-classes";

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
  labelClassName?: string;
  size?: ControlSize;
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
  labelClassName,
  size = "md",
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

  const isXs = size === "xs";
  const rightPadding = shouldShowClear ? (isXs ? "pr-8" : "pr-10") : "";
  const iconPadding = icon ? (iconPosition === "left" ? (isXs ? "pl-8" : "pl-11") : isXs ? "pr-8" : "pr-11") : "";

  const inputClasses = cn(
    fieldBase,
    disabled && fieldDisabled,
    !disabled && error && fieldError,
    !disabled && !error && success && fieldSuccess,
    CONTROL_SIZE_CLASSES[size],
    rightPadding,
    iconPadding,
    className
  );

  const iconInsetClass = isXs
    ? iconPosition === "left"
      ? "left-2.5"
      : "right-2.5"
    : iconPosition === "left"
      ? "left-4"
      : "right-4";
  const iconClasses = cn("absolute z-30 -translate-y-1/2 top-1/2", iconInsetClass, iconClick && "cursor-pointer");

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      hint={hint}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
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
          className={inputClasses}
        />

        {shouldShowClear && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className={cn(
              "absolute inset-y-0 right-0 flex items-center focus:outline-hidden text-on-surface-variant hover:text-on-surface",
              isXs ? "pr-2" : "pr-3"
            )}
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
