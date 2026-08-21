import type { FC, ReactNode } from "react";
import { cn } from "../cn";
import Label from "../label";
import { textMuted } from "../theme/role-classes";

export interface FormFieldProps {
  id: string;
  label?: string;
  required?: boolean;
  error?: string | undefined;
  hint?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  children: ReactNode;
}

const FormField: FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  error,
  hint,
  wrapperClassName,
  labelClassName,
  children,
}) => {
  return (
    <div className={wrapperClassName}>
      {label && (
        <Label htmlFor={id} className={labelClassName}>
          {label} {required && <span className="text-error">*</span>}
        </Label>
      )}
      {children}
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      {hint && !error && <p className={cn("mt-1.5 text-xs", textMuted)}>{hint}</p>}
    </div>
  );
};

export default FormField;
