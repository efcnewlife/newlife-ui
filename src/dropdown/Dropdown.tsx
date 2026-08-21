import type React from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../cn";
import { FloatingSurface } from "../floating-surface";
import { surfacePanel } from "../theme/role-classes";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ isOpen, onClose, children, className = "" }) => {
  const sentinelRef = useRef<HTMLSpanElement | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const [anchorReady, setAnchorReady] = useState(false);
  const dismissSurface = useCallback(() => onClose(), [onClose]);

  useLayoutEffect(() => {
    const parent = sentinelRef.current?.parentElement ?? null;
    anchorRef.current = parent;
    setAnchorReady(Boolean(parent));
  }, [isOpen]);

  return (
    <>
      <span ref={sentinelRef} className="hidden" aria-hidden />
      <FloatingSurface
        open={isOpen && anchorReady}
        anchorRef={anchorRef}
        onDismiss={dismissSurface}
        placement="bottom-end"
        offset={8}
        ignoreOutsidePressSelector=".dropdown-toggle"
        className={cn("rounded-xl", surfacePanel, className)}
      >
        {children}
      </FloatingSurface>
    </>
  );
};
