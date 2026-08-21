import { cn } from "../cn";
import type { CountryCode } from "../types/common";
import type React from "react";
import { useEffect, useState } from "react";
import FormField from "../form-field";
import {
  borderOutlineVariant,
  CONTROL_SIZE_CLASSES,
  type ControlSize,
  fieldBase,
  fieldDisabled,
  fieldError,
  focusRingPrimary,
  textMuted,
  textOnSurface,
} from "../theme/role-classes";

interface PhoneInputProps {
  countries: CountryCode[];
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (phoneNumber: string) => void;
  disabled?: boolean;
  error?: string | undefined;
  hint?: string;
  required?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  size?: ControlSize;
  selectPosition?: "start" | "end";
}

const countrySelectClass = cn(
  "appearance-none bg-none border-0 bg-transparent h-full pl-3.5 pr-8 leading-none",
  textOnSurface,
  borderOutlineVariant,
  focusRingPrimary,
  "focus:outline-hidden focus:ring-3 disabled:opacity-40 disabled:cursor-not-allowed"
);

const PhoneInput: React.FC<PhoneInputProps> = ({
  countries,
  id = "phone-input",
  name,
  label,
  placeholder = "+1 (555) 000-0000",
  value,
  onChange,
  disabled = false,
  error,
  hint,
  required = false,
  wrapperClassName,
  labelClassName,
  size = "md",
  selectPosition = "start",
}) => {
  const countryCodes: Record<string, string> = countries.reduce(
    (acc, { name, code }) => ({ ...acc, [name]: code }),
    {}
  );

  const [selectedCountry, setSelectedCountry] = useState<string>("TWN");
  const [phoneNumber, setPhoneNumber] = useState<string>(value ? value : countryCodes[selectedCountry]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    setPhoneNumber(countryCodes[newCountry]);
    if (onChange) {
      onChange(countryCodes[newCountry]);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    if (onChange) {
      onChange(newPhoneNumber);
    }
  };

  useEffect(() => {
    if (value) {
      setPhoneNumber(value);
    }
  }, [value]);

  const inputClasses = cn(
    fieldBase,
    CONTROL_SIZE_CLASSES[size],
    selectPosition === "start" ? "pl-[96px]" : "pr-[84px]",
    disabled && fieldDisabled,
    !disabled && error && fieldError
  );

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      hint={hint}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
    >
      <div className="relative flex">
        {selectPosition === "start" && (
          <div className="absolute inset-y-0">
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={disabled}
              className={cn(countrySelectClass, "rounded-l-lg border-r")}
            >
              {countries.map((country) => (
                <option key={country.name} value={country.name} className={textOnSurface}>
                  {country.name}
                </option>
              ))}
            </select>
            <div className={`absolute inset-y-0 flex items-center pointer-events-none bg-none right-3 ${textMuted}`}>
              <svg
                className="stroke-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}

        <input
          id={id}
          name={name}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder={placeholder}
          className={inputClasses}
        />

        {selectPosition === "end" && (
          <div className="absolute inset-y-0 right-0">
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={disabled}
              className={cn(countrySelectClass, "rounded-r-lg border-l")}
            >
              {countries.map((country) => (
                <option key={country.name} value={country.name} className={textOnSurface}>
                  {country.name}
                </option>
              ))}
            </select>
            <div className={`absolute inset-y-0 flex items-center pointer-events-none right-3 ${textMuted}`}>
              <svg
                className="stroke-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </FormField>
  );
};

export default PhoneInput;
