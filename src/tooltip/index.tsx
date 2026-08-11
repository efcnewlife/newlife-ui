import React, { useEffect, useMemo, useRef, useState } from "react";
import { FloatingSurface } from "../floating-surface";
import { useHtmlDarkClass } from "../hooks/use-html-dark-class";
import { inversePanel, surfacePanel } from "../theme/role-classes";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";
type TooltipTheme = "light" | "dark" | "auto";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  theme?: TooltipTheme;
  enterDelay?: number;
  leaveDelay?: number;
  className?: string;
  /** Tooltip The style class name of the content container (applies only to tooltip Bubbles, does not affect trigger elements) */
  contentClassName?: string;
  wrapContent?: boolean;
}

function arrowClasses(placement: TooltipPlacement) {
  switch (placement) {
    case "top":
      return "-bottom-1 left-1/2 -translate-x-1/2";
    case "right":
      return "-left-1.5 top-1/2 -translate-y-1/2";
    case "left":
      return "-right-1.5 top-1/2 -translate-y-1/2";
    case "bottom":
    default:
      return "-top-1 left-1/2 -translate-x-1/2";
  }
}

export default function Tooltip({
  content,
  children,
  placement = "bottom",
  theme = "auto",
  enterDelay = 100,
  leaveDelay = 100,
  className = "",
  contentClassName = "",
  wrapContent = true,
}: TooltipProps) {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const hasDarkClass = useHtmlDarkClass();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDark = useMemo(() => {
    if (theme === "dark") return true;
    if (theme === "light") return false;
    return !hasDarkClass;
  }, [theme, hasDarkClass]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearTimer();
    if (enterDelay <= 0) {
      setOpen(true);
      return;
    }
    timeoutRef.current = setTimeout(() => setOpen(true), enterDelay);
  };

  const handleMouseLeave = () => {
    clearTimer();
    if (leaveDelay <= 0) {
      setOpen(false);
      return;
    }
    timeoutRef.current = setTimeout(() => setOpen(false), leaveDelay);
  };

  const bubbleClass = isDark ? inversePanel : surfacePanel;
  const arrowBg = isDark ? "bg-inverse-surface" : "bg-surface";

  return (
    <div
      ref={triggerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <FloatingSurface
        open={open}
        anchorRef={triggerRef}
        placement={placement}
        offset={10}
        onDismiss={() => setOpen(false)}
        dismissOnOutsidePress={false}
        className="pointer-events-none"
      >
        <div className={`relative ${contentClassName}`}>
          <div
            className={`drop-shadow-4xl rounded-lg px-3 py-3 text-xs font-medium ${
              wrapContent ? "text-pretty" : "whitespace-nowrap"
            } ${bubbleClass}`}
          >
            {content}
          </div>
          <div className={`absolute ${arrowClasses(placement)} h-3 w-4 rotate-45 ${arrowBg}`} />
        </div>
      </FloatingSurface>
    </div>
  );
}
