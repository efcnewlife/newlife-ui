import type React from "react";
import { MdCheck } from "react-icons/md";
import Tooltip, { type TooltipPlacement } from "../tooltip";
import { checkboxBase, textOnSurface } from "../theme/role-classes";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  className?: string;
  id?: string;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  tooltip?: boolean;
  tooltipPlacement?: TooltipPlacement;
}

const checkboxInputClass = (className: string) => `${checkboxBase} ${className}`;

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  id,
  onChange = () => {},
  className = "",
  disabled = false,
  tooltip = false,
  tooltipPlacement = "right",
}) => {
  const labelContent = (
    <>
      <div className="relative w-5 h-5">
        <input
          id={id}
          type="checkbox"
          className={checkboxInputClass(className)}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        {checked && (
          <MdCheck
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2 text-on-primary"
            size={20}
          />
        )}
      </div>
      {label && <span className={`text-sm font-medium ${textOnSurface}`}>{label}</span>}
    </>
  );

  const labelClass = `flex items-center space-x-3 group cursor-pointer ${disabled ? "cursor-not-allowed opacity-60" : ""} ${className}`;

  return tooltip ? (
    <Tooltip content={label} placement={tooltipPlacement}>
      <label className={labelClass}>{labelContent}</label>
    </Tooltip>
  ) : (
    <label className={labelClass}>{labelContent}</label>
  );
};

export default Checkbox;
