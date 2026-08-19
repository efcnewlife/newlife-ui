import type { ReactNode } from "react";
import { cn } from "../src/cn";
import type { ControlSize } from "../src/theme/role-classes";

export const CONTROL_SIZES: ControlSize[] = ["xs", "sm", "md", "lg"];

export const BUTTON_SIZES = CONTROL_SIZES;

export const SPINNER_SIZES = ["sm", "md", "lg", "xl"] as const;

export const ALERT_SIZES = ["sm", "md", "lg"] as const;

export const BADGE_SIZES = ["sm", "md"] as const;

export function SizeStack<T extends string>({
  sizes,
  render,
  className,
}: {
  sizes: readonly T[];
  render: (size: T) => ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full max-w-md flex-col gap-5", className)}>
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">{size}</p>
          {render(size)}
        </div>
      ))}
    </div>
  );
}
