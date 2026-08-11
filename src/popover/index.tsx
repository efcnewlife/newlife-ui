import React, { useCallback, useEffect, useRef, useState } from "react";

import { FloatingSurface } from "../floating-surface";
import { PopoverPosition } from "../types/enums";
import { inversePanelHeader, surfacePanel, textOnSurface } from "../theme/role-classes";

interface PopoverProps {
  title: React.ReactNode;
  children: React.ReactNode;
  trigger: React.ReactNode;
  position?: PopoverPosition;
  width?: string;
  // controlled mode props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function placementForPosition(position: PopoverPosition) {
  switch (position) {
    case PopoverPosition.Top:
      return "top" as const;
    case PopoverPosition.TopLeft:
      return "top-start" as const;
    case PopoverPosition.TopRight:
      return "top-end" as const;
    case PopoverPosition.Left:
    case PopoverPosition.LeftTop:
    case PopoverPosition.LeftBottom:
      return "left" as const;
    case PopoverPosition.Right:
    case PopoverPosition.RightTop:
    case PopoverPosition.RightBottom:
      return "right" as const;
    case PopoverPosition.BottomLeft:
      return "bottom-start" as const;
    case PopoverPosition.BottomRight:
      return "bottom-end" as const;
    case PopoverPosition.Bottom:
    default:
      return "bottom" as const;
  }
}

export default function Popover({
  title,
  children,
  trigger,
  position = PopoverPosition.Bottom,
  width = "300px",
  open,
  onOpenChange,
}: PopoverProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalIsOpen;

  const updateOpenState = useCallback(
    (newOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(newOpen);
      } else {
        setInternalIsOpen(newOpen);
      }
    },
    [isControlled, onOpenChange]
  );

  const dismissSurface = useCallback(() => updateOpenState(false), [updateOpenState]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissSurface();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, dismissSurface]);

  const togglePopover = () => updateOpenState(!isOpen);

  return (
    <div className="relative inline-block">
      <div ref={triggerRef} onClick={togglePopover}>
        {trigger}
      </div>
      <FloatingSurface
        open={isOpen}
        anchorRef={triggerRef}
        onDismiss={dismissSurface}
        placement={placementForPosition(position)}
        offset={8}
        className="rounded-xl"
      >
        <div className={`w-full rounded-xl shadow-2xl ${surfacePanel}`} style={{ width }}>
          <div className={`relative rounded-t-xl px-5 py-3 ${inversePanelHeader}`}>
            <h3 className={`text-base font-semibold ${textOnSurface}`}>{title}</h3>
          </div>
          {children}
        </div>
      </FloatingSurface>
    </div>
  );
}
