import React from "react";
import { spinnerPrimary, textMuted, textOnSurface } from "../theme/role-classes";

export type SpinnerSize = "sm" | "md" | "lg" | "xl";
export type SpinnerColor = "primary" | "secondary" | "white" | "gray";

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
  showText?: boolean;
  text?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-9 h-9",
  xl: "w-12 h-12",
};

const colorMap: Record<SpinnerColor, string> = {
  primary: spinnerPrimary,
  secondary: "border-on-surface-variant",
  white: "border-on-primary",
  gray: "border-outline",
};

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  className = "",
  showText = false,
  text = "Loading...",
}) => {
  const sizeClass = sizeMap[size];
  const colorClass = colorMap[color];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClass} ${colorClass} border-3 border-t-transparent rounded-full animate-spin`} />
      {showText && <span className={`text-sm ${color === "white" ? "text-on-primary" : textMuted}`}>{text}</span>}
    </div>
  );
};

export default Spinner;
