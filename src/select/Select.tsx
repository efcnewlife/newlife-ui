import type React from "react";
import { useCallback, useRef, useState } from "react";
import { MdCheck, MdClose, MdKeyboardArrowDown, MdSearch } from "react-icons/md";
import { cn } from "../cn";
import { FloatingSurface } from "../floating-surface";
import FormField from "../form-field";
import {
  comboboxCheckboxChecked,
  comboboxCheckboxUnchecked,
  comboboxOptionDefault,
  comboboxOptionFocused,
  CONTROL_ADORNMENT_ICON_CLASSES,
  CONTROL_SIZE_CLASSES,
  type ControlSize,
  fieldBase,
  fieldDisabled,
  fieldError,
  fieldSuccess,
  selectOptionActive,
  surfacePanel,
  tagPrimary,
  textMuted,
} from "../theme/role-classes";

function OptionCheckbox({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded border transition-colors",
        checked ? comboboxCheckboxChecked : comboboxCheckboxUnchecked,
        disabled && "opacity-50",
      )}
      role="checkbox"
      aria-checked={checked}
    >
      {checked ? <MdCheck className="size-3.5 text-on-primary" aria-hidden /> : null}
    </span>
  );
}

export interface SelectOption {
  value: string | number | null;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number | null | (string | number | null)[];
  onChange?: (value: string | number | null | (string | number | null)[]) => void;
  placeholder?: string;
  id: string;
  name?: string;
  label?: string;
  disabled?: boolean;
  error?: string | undefined;
  success?: boolean;
  hint?: string;
  required?: boolean;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  searchable?: boolean;
  multiple?: boolean;
  clearable?: boolean;
  size?: ControlSize;
  variant?: "default" | "bordered" | "ghost";
  /** Defaults when not using i18n in the host app */
  labels?: {
    selectPlaceholder?: string;
    clearSelection?: string;
    toggleOptions?: string;
    searchOptions?: string;
    noOptions?: string;
  };
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  id,
  name,
  label,
  disabled = false,
  error,
  success = false,
  hint,
  required = false,
  className = "",
  wrapperClassName,
  labelClassName,
  searchable = false,
  multiple = false,
  clearable = false,
  size = "md",
  variant = "default",
  labels: labelsProp,
}) => {
  const labels = {
    selectPlaceholder: "Select...",
    clearSelection: "Clear selection",
    toggleOptions: "Toggle options",
    searchOptions: "Search options",
    noOptions: "No options",
    ...labelsProp,
  };
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const dismissSurface = useCallback(() => {
    setIsOpen(false);
    setSearchTerm("");
    setFocusedIndex(-1);
  }, []);

  // Filter options
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));

  // Get selected options
  const getSelectedOptions = (): SelectOption[] => {
    if (multiple && Array.isArray(value)) {
      return options.filter((option) => value.includes(option.value));
    } else if (!multiple && value !== undefined) {
      return options.filter((option) => option.value === value);
    }
    return [];
  };

  const selectedOptions = getSelectedOptions();
  const effective_placeholder = placeholder ?? labels.selectPlaceholder;

  // Processing options click
  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;

    if (multiple) {
      const currentValue = Array.isArray(value) ? value : [];
      const newValue = currentValue.includes(option.value)
        ? currentValue.filter((v) => v !== option.value)
        : [...currentValue, option.value];
      onChange?.(newValue);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  // Clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : null);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
        if (searchable) {
          setTimeout(() => searchInputRef.current?.focus(), 0);
        }
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleOptionClick(filteredOptions[focusedIndex]);
        }
        break;
      case "Escape":
        dismissSurface();
        break;
    }
  };

  const variantClasses = {
    default: fieldBase,
    bordered: "border-2 border-outline focus:border-primary focus:ring-primary/20 bg-surface text-on-surface",
    ghost: "border-0 bg-surface-variant focus:bg-surface focus:ring-primary/20 text-on-surface",
  };

  let stateClasses = "";
  if (disabled) {
    stateClasses = fieldDisabled;
  } else if (error && error !== undefined) {
    stateClasses = fieldError;
  } else if (success) {
    stateClasses = fieldSuccess;
  } else if (variant === "default") {
    stateClasses = fieldBase;
  } else {
    stateClasses = variantClasses[variant];
  }

  const selectClasses = cn(
    "relative flex w-full items-center overflow-hidden rounded-lg border appearance-none shadow-theme-xs focus:outline-hidden focus:ring-3",
    stateClasses,
    CONTROL_SIZE_CLASSES[size],
    className,
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
      <div className="relative" ref={selectRef}>
        {/* selector trigger */}
        <div
          className={selectClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          id={id}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {selectedOptions.length > 0 ? (
                <div className="flex items-center gap-1 flex-wrap">
                  {multiple ? (
                    selectedOptions.map((option) => (
                      <span key={option.value} className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md ${tagPrimary}`}>
                        {option.icon}
                        {option.label}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionClick(option);
                          }}
                          className="hover:text-primary"
                        >
                          <MdClose className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className={`flex items-center gap-2 truncate`}>
                      {selectedOptions[0]?.icon}
                      {selectedOptions[0]?.label}
                    </span>
                  )}
                </div>
              ) : (
                <span className={textMuted}>{effective_placeholder}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {clearable && selectedOptions.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-on-surface-variant hover:text-on-surface focus:outline-hidden"
                  disabled={disabled}
                  aria-label={labels.clearSelection}
                >
                  <MdClose className={`size-4 ${textMuted}`} />
                </button>
              )}
              <button
                type="button"
                className="flex items-center focus:outline-hidden"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                aria-label={labels.toggleOptions}
              >
                <MdKeyboardArrowDown
                  className={cn(
                    textMuted,
                    "transition-transform duration-200",
                    CONTROL_ADORNMENT_ICON_CLASSES[size],
                    isOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>

        <FloatingSurface
          open={isOpen}
          anchorRef={selectRef}
          onDismiss={dismissSurface}
          matchAnchorWidth
          placement="bottom-start"
          offset={4}
          className={cn(`w-full rounded-lg shadow-theme-lg ${surfacePanel}`)}
        >
          <div role="listbox">
            {searchable && (
              <div className="p-2 border-b border-outline-variant">
                <div className="relative">
                  <MdSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${textMuted}`} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={labels.searchOptions}
                    className={`w-full pl-9 pr-3 py-2 text-sm border border-outline rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-outline-focus bg-surface text-on-surface`}
                  />
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const isSelected = selectedOptions.some((selected) => selected.value === option.value);
                  const isFocused = index === focusedIndex;

                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition-colors select-none",
                        comboboxOptionDefault,
                        !option.disabled && !isFocused && !isSelected && "hover:bg-primary hover:text-on-primary",
                        isFocused && comboboxOptionFocused,
                        isSelected && !isFocused && selectOptionActive,
                        option.disabled && cn(textMuted, "cursor-not-allowed opacity-60"),
                      )}
                      onClick={() => handleOptionClick(option)}
                      onMouseEnter={() => !option.disabled && setFocusedIndex(index)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {multiple ? <OptionCheckbox checked={isSelected} disabled={option.disabled} /> : null}
                      {option.icon}
                      {option.label}
                    </div>
                  );
                })
              ) : (
                <div className={`px-4 py-3 text-sm ${textMuted} text-center`}>{labels.noOptions}</div>
              )}
            </div>
          </div>
        </FloatingSurface>

        {/* Hidden form input */}
        <input type="hidden" name={name} value={Array.isArray(value) ? value.join(",") : value || ""} />
      </div>
    </FormField>
  );
};
