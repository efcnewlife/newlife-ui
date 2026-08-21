import { useState } from "react";
import {
  switchKnob,
  switchTrackDisabled,
  switchTrackOff,
  switchTrackOn,
  textMuted,
  textOnSurface,
} from "../theme/role-classes";

export type SwitchColor = "primary" | "neutral";

interface SwitchProps {
  label?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  /** @deprecated Use `"primary"` instead of `"blue"`. */
  color?: SwitchColor | "blue" | "gray";
}

const resolveColor = (color: SwitchProps["color"]): SwitchColor => {
  if (color === "blue") return "primary";
  if (color === "gray") return "neutral";
  return color ?? "primary";
};

const Switch: React.FC<SwitchProps> = ({
  label,
  defaultChecked = false,
  disabled = false,
  onChange,
  color = "primary",
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);
  const resolvedColor = resolveColor(color);

  const handleToggle = () => {
    if (disabled) return;
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(newCheckedState);
    }
  };

  const switchColors =
    resolvedColor === "primary"
      ? {
          background: isChecked ? switchTrackOn : switchTrackOff,
          knob: isChecked ? "translate-x-full" : "translate-x-0",
        }
      : {
          background: isChecked ? "bg-on-surface" : switchTrackOff,
          knob: isChecked ? "translate-x-full" : "translate-x-0",
        };

  return (
    <label
      className={`flex cursor-pointer select-none items-center gap-3 text-sm font-medium ${
        disabled ? textMuted : textOnSurface
      }`}
      onClick={handleToggle}
    >
      <div className="relative">
        <div
          className={`block transition duration-150 ease-linear h-6 w-11 rounded-full ${
            disabled ? switchTrackDisabled : switchColors.background
          }`}
        ></div>
        <div
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full duration-150 ease-linear transform ${switchKnob} ${switchColors.knob}`}
        ></div>
      </div>
      {label}
    </label>
  );
};

export default Switch;
