import { radioChecked, radioUnchecked, textMuted, textOnSurface } from "../theme/role-classes";

interface RadioProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  label: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const Radio: React.FC<RadioProps> = ({
  id,
  name,
  value,
  checked,
  label,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      htmlFor={id}
      className={`relative flex cursor-pointer select-none items-center gap-3 text-sm font-medium ${
        disabled ? `${textMuted} cursor-not-allowed` : textOnSurface
      } ${className}`}
    >
      <input
        id={id}
        name={name}
        type="radio"
        value={value}
        checked={checked}
        onChange={() => !disabled && onChange(value)}
        className="sr-only"
        disabled={disabled}
      />
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-[1.25px] ${
          checked ? radioChecked : radioUnchecked
        } ${disabled ? "bg-surface-variant border-outline opacity-60" : ""}`}
      >
        <span className={`h-2 w-2 rounded-full bg-on-primary ${checked ? "block" : "hidden"}`}></span>
      </span>
      {label}
    </label>
  );
};

export default Radio;
