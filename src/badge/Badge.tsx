import type { FC, ReactNode } from "react";
import {
  badgeLightError,
  badgeLightInfo,
  badgeLightNeutral,
  badgeLightPrimary,
  badgeLightSuccess,
  badgeLightWarning,
  badgeSolidError,
  badgeSolidInfo,
  badgeSolidNeutral,
  badgeSolidPrimary,
  badgeSolidSuccess,
  badgeSolidWarning,
} from "../theme/role-classes";

type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children: ReactNode;
}

const Badge: FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium";

  const sizeStyles = {
    sm: "text-theme-xs",
    md: "text-sm",
  };

  const variants = {
    light: {
      primary: badgeLightPrimary,
      success: badgeLightSuccess,
      error: badgeLightError,
      warning: badgeLightWarning,
      info: badgeLightInfo,
      light: badgeLightNeutral,
      dark: badgeSolidNeutral,
    },
    solid: {
      primary: badgeSolidPrimary,
      success: badgeSolidSuccess,
      error: badgeSolidError,
      warning: badgeSolidWarning,
      info: badgeSolidInfo,
      light: badgeSolidNeutral,
      dark: "bg-on-surface text-on-primary",
    },
  };

  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant][color];

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorStyles}`}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
