import React from "react";
import FormField from "../form-field";
import { cn } from "../cn";
import {
  textareaBase,
  textareaDisabled,
  textareaError,
  textareaSuccess,
} from "../theme/role-classes";

interface TextareaProps {
  id: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  wrapperClassName?: string;
  disabled?: boolean;
  error?: string | undefined;
  hint?: string;
  required?: boolean;
  success?: boolean;
}

const TextArea: React.FC<TextareaProps> = ({
  id,
  label,
  placeholder = "Please enter message",
  rows = 3,
  value = "",
  onChange,
  className = "",
  wrapperClassName,
  disabled = false,
  error = undefined,
  hint = "",
  required = false,
  success = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  let textareaClasses = cn(textareaBase, className);

  if (disabled) {
    textareaClasses = cn(textareaClasses, textareaDisabled);
  } else if (error) {
    textareaClasses = cn(textareaClasses, textareaError);
  } else if (success) {
    textareaClasses = cn(textareaClasses, textareaSuccess);
  }

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
        <textarea
          id={id}
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={textareaClasses}
        />
      </div>
    </FormField>
  );
};

export default TextArea;
