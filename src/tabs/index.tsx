import type React from "react";
import { cn } from "../cn";
import Label from "../label";
import { borderOutlineVariant, tabActive, tabInactive } from "../theme/role-classes";

export interface TabItem {
  value: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  id?: string;
  label?: string;
  required?: boolean;
  className?: string;
  "aria-label"?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  onChange,
  id = "tabs",
  label,
  required = false,
  className,
  "aria-label": ariaLabel,
}) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} className="mb-1.5 block">
          {label}
          {required && <span className="text-error"> *</span>}
        </Label>
      )}
      <nav
        id={id}
        role="tablist"
        aria-label={ariaLabel ?? label ?? "Tabs"}
        className={`-mb-px flex flex-wrap gap-x-1 overflow-x-auto border-b ${borderOutlineVariant}`}
      >
        {tabs.map((tab) => {
          const isActive = value === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              id={`${id}-tab-${tab.value}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={cn(
                "inline-flex items-center border-b-2 px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out",
                isActive ? tabActive : tabInactive
              )}
              onClick={() => onChange(tab.value)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
