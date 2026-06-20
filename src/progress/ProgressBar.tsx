import React from "react";
import { progressFill, textOnSurface, textMuted } from "../theme/role-classes";

interface ProgressBarProps {
  progress: number;
  size?: "sm" | "md" | "lg" | "xl";
  label?: "none" | "outside" | "inside";
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, size = "sm", label = "none", className = "" }) => {
  const safeProgress = Math.max(0, Math.min(100, Math.round(progress)));

  const sizeClasses: Record<NonNullable<ProgressBarProps["size"]>, string> = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
    xl: "h-5",
  };

  const baseClasses = "relative w-full bg-surface-variant rounded-full";
  const progressClasses = `absolute left-0 h-full ${progressFill} rounded-full`;

  const renderLabel = () => {
    if (label === "outside") {
      return <span className={`ml-3 text-sm font-medium ${textOnSurface}`}>{safeProgress}%</span>;
    }
    if (label === "inside") {
      return (
        <span className="absolute inset-0 flex items-center justify-center text-on-primary font-medium text-[10px] leading-tight">
          {safeProgress}%
        </span>
      );
    }
    return null;
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${baseClasses} ${sizeClasses[size]}`}>
        <div
          className={`${progressClasses} ${label === "inside" ? "flex items-center justify-center" : ""}`}
          style={{ width: `${safeProgress}%` }}
        >
          {label === "inside" && renderLabel()}
        </div>
      </div>
      {label === "outside" && renderLabel()}
    </div>
  );
};

export default ProgressBar;
