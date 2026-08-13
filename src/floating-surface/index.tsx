import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../cn";
import { floatingSurfaceStackManager } from "./stack";

/** Above Modal shell (`z-99999`). */
export const FLOATING_SURFACE_Z_INDEX = 100_000;

export type FloatingSurfacePlacement =
  | "bottom-start"
  | "bottom-end"
  | "bottom"
  | "top"
  | "top-start"
  | "top-end"
  | "left"
  | "right";

export interface FloatingSurfaceProps {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  className?: string;
  placement?: FloatingSurfacePlacement;
  offset?: number;
  onDismiss?: () => void;
  dismissOnOutsidePress?: boolean;
  matchAnchorWidth?: boolean;
  /** CSS selector; matching targets do not dismiss on outside press (e.g. `.dropdown-toggle`). */
  ignoreOutsidePressSelector?: string;
}

type Coords = {
  top: number;
  left: number;
  width?: number;
};

function computeCoords(
  anchor: DOMRect,
  placement: FloatingSurfacePlacement,
  offset: number,
  matchAnchorWidth: boolean
): Coords {
  const width = matchAnchorWidth ? anchor.width : undefined;

  switch (placement) {
    case "bottom-end":
      return {
        top: anchor.bottom + offset,
        left: anchor.right,
        width,
      };
    case "bottom":
      return {
        top: anchor.bottom + offset,
        left: anchor.left + anchor.width / 2,
        width,
      };
    case "top":
      return {
        top: anchor.top - offset,
        left: anchor.left + anchor.width / 2,
        width,
      };
    case "top-start":
      return {
        top: anchor.top - offset,
        left: anchor.left,
        width,
      };
    case "top-end":
      return {
        top: anchor.top - offset,
        left: anchor.right,
        width,
      };
    case "left":
      return {
        top: anchor.top + anchor.height / 2,
        left: anchor.left - offset,
        width,
      };
    case "right":
      return {
        top: anchor.top + anchor.height / 2,
        left: anchor.right + offset,
        width,
      };
    case "bottom-start":
    default:
      return {
        top: anchor.bottom + offset,
        left: anchor.left,
        width,
      };
  }
}

function placementTransform(placement: FloatingSurfacePlacement): string | undefined {
  switch (placement) {
    case "bottom":
      return "translateX(-50%)";
    case "top":
      return "translate(-50%, -100%)";
    case "top-start":
      return "translateY(-100%)";
    case "top-end":
      return "translate(-100%, -100%)";
    case "bottom-end":
      return "translateX(-100%)";
    case "left":
      return "translate(-100%, -50%)";
    case "right":
      return "translateY(-50%)";
    default:
      return undefined;
  }
}

export function FloatingSurface({
  open,
  anchorRef,
  children,
  className,
  placement = "bottom-start",
  offset = 4,
  onDismiss,
  dismissOnOutsidePress = true,
  matchAnchorWidth = false,
  ignoreOutsidePressSelector,
}: FloatingSurfaceProps) {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const onDismissRef = useRef(onDismiss);
  const stackIdRef = useRef<ReturnType<typeof floatingSurfaceStackManager.register> | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    const update = () => {
      const anchor = anchorRef.current;
      if (!anchor) {
        return;
      }
      setCoords(computeCoords(anchor.getBoundingClientRect(), placement, offset, matchAnchorWidth));
    };

    update();

    window.addEventListener("resize", update);
    document.addEventListener("scroll", update, true);

    return () => {
      window.removeEventListener("resize", update);
      document.removeEventListener("scroll", update, true);
    };
  }, [open, anchorRef, placement, offset, matchAnchorWidth]);

  useEffect(() => {
    if (!open || !onDismiss) {
      return;
    }

    const id = floatingSurfaceStackManager.register(() => {
      onDismissRef.current?.();
    });
    stackIdRef.current = id;

    return () => {
      stackIdRef.current = null;
      floatingSurfaceStackManager.unregister(id);
    };
  }, [open, onDismiss]);

  useEffect(() => {
    if (!open || !dismissOnOutsidePress || !onDismiss) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }
      if (surfaceRef.current?.contains(target) || anchorRef.current?.contains(target)) {
        return;
      }
      if (
        ignoreOutsidePressSelector &&
        target instanceof Element &&
        target.closest(ignoreOutsidePressSelector)
      ) {
        return;
      }
      // Nested portaled surfaces (Select inside Dropdown) register above this one.
      // Only the top surface may dismiss; otherwise the parent swallows the option click.
      const stackId = stackIdRef.current;
      if (!stackId || !floatingSurfaceStackManager.isTop(stackId)) {
        return;
      }

      onDismissRef.current?.();
      event.preventDefault();
      event.stopPropagation();

      const preventClick = (clickEvent: MouseEvent) => {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
        document.removeEventListener("click", preventClick, true);
      };
      document.addEventListener("click", preventClick, true);
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [open, dismissOnOutsidePress, onDismiss, anchorRef, ignoreOutsidePressSelector]);

  if (!open || typeof document === "undefined" || !coords) {
    return null;
  }

  const style: CSSProperties = {
    position: "fixed",
    top: coords.top,
    left: coords.left,
    zIndex: FLOATING_SURFACE_Z_INDEX,
    width: coords.width,
    transform: placementTransform(placement),
  };

  return createPortal(
    <div ref={surfaceRef} data-floating-surface="" className={cn(className)} style={style}>
      {children}
    </div>,
    document.body
  );
}
