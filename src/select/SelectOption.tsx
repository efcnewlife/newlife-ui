import type React from "react";
import { cn } from "../cn";
import { textMuted, textOnSurface } from "../theme/role-classes";

interface SelectOptionProps {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const SelectOption: React.FC<SelectOptionProps> = ({
  value,
  label,
  disabled = false,
  icon,
  className = "",
  children,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
        disabled ? `${textMuted} cursor-not-allowed opacity-60` : `${textOnSurface} hover:bg-surface-variant`,
        className
      )}
      data-value={value}
      data-disabled={disabled}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children || label}
    </div>
  );
};
