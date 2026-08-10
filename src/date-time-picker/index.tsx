import { cn } from "../cn";
import FormField from "../form-field";
import type { Dayjs } from "../lib/dayjs";
import {
  fromWallClockDateToUtc,
  resolveDisplayTimezone,
  toWallClockDate,
  validateDatetimeBounds,
} from "../picker/datetime";
import type { PickerChangeMeta } from "../picker/types";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useEffect, useRef, useState } from "react";
import { MdCalendarToday, MdClear } from "react-icons/md";
import { fieldBase, fieldDisabled, fieldError, textMuted } from "../theme/role-classes";

export type DateTimePickerTimePrecision = "minutes" | "seconds";

export interface DateTimePickerProps {
  id: string;
  value?: Dayjs | null;
  defaultValue?: Dayjs | null;
  onChange?: (value: Dayjs | null, meta: PickerChangeMeta) => void;
  timezone?: string;
  minDate?: Dayjs | null;
  maxDate?: Dayjs | null;
  minDateTime?: Dayjs | null;
  maxDateTime?: Dayjs | null;
  clearable?: boolean;
  minuteStep?: number;
  timePrecision?: DateTimePickerTimePrecision;
  ampm?: boolean;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  wrapperClassName?: string;
}

const boundToFlatpickrDate = (
  bound: Dayjs | null | undefined,
  displayTimezone: string
): Date | undefined => {
  if (bound == null) {
    return undefined;
  }
  return toWallClockDate(bound.utc(), displayTimezone);
};

export default function DateTimePicker({
  id,
  value,
  defaultValue,
  onChange,
  timezone,
  minDate,
  maxDate,
  minDateTime,
  maxDateTime,
  clearable = true,
  minuteStep = 1,
  timePrecision = "minutes",
  ampm = false,
  label,
  placeholder,
  error,
  required,
  disabled,
  wrapperClassName,
}: DateTimePickerProps) {
  const flatpickrRef = useRef<flatpickr.Instance | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onChangeRef = useRef(onChange);
  const boundsRef = useRef({ minDate, maxDate, minDateTime, maxDateTime });
  const displayTimezone = resolveDisplayTimezone(timezone, value, defaultValue);
  const displayTimezoneRef = useRef(displayTimezone);
  const initialSource = value !== undefined ? value : defaultValue;
  const [hasValue, setHasValue] = useState(initialSource != null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    boundsRef.current = { minDate, maxDate, minDateTime, maxDateTime };
  }, [minDate, maxDate, minDateTime, maxDateTime]);

  useEffect(() => {
    displayTimezoneRef.current = displayTimezone;
  }, [displayTimezone]);

  useEffect(() => {
    if (value !== undefined) {
      setHasValue(value != null);
    }
  }, [value]);

  const emitChange = (next: Dayjs | null, source: PickerChangeMeta["source"]) => {
    setHasValue(next != null);
    if (!onChangeRef.current) {
      return;
    }

    const validationError = validateDatetimeBounds(next, {
      minDate: boundsRef.current.minDate,
      maxDate: boundsRef.current.maxDate,
      minDateTime: boundsRef.current.minDateTime,
      maxDateTime: boundsRef.current.maxDateTime,
      displayTimezone: displayTimezoneRef.current,
    });

    onChangeRef.current(next, {
      validationError,
      source,
    });
  };

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    const source = value !== undefined ? value : defaultValue;
    const initialDate =
      source != null ? toWallClockDate(source.utc(), displayTimezone) : undefined;

    const dateFormat =
      timePrecision === "seconds"
        ? ampm
          ? "Y-m-d G:i:S K"
          : "Y-m-d H:i:S"
        : ampm
          ? "Y-m-d G:i K"
          : "Y-m-d H:i";

    const options: flatpickr.Options.Options = {
      enableTime: true,
      enableSeconds: timePrecision === "seconds",
      time_24hr: !ampm,
      minuteIncrement: minuteStep,
      static: true,
      monthSelectorType: "static",
      dateFormat,
      defaultDate: initialDate,
      disableMobile: true,
      onChange: (selectedDates) => {
        if (selectedDates.length === 0) {
          emitChange(null, "view");
          return;
        }

        const utcValue = fromWallClockDateToUtc(
          selectedDates[0],
          displayTimezoneRef.current
        );
        emitChange(utcValue, "view");
      },
    };

    if (minDate != null) {
      options.minDate = boundToFlatpickrDate(minDate, displayTimezone);
    }
    if (maxDate != null) {
      options.maxDate = boundToFlatpickrDate(maxDate, displayTimezone);
    }
    if (disabled) {
      options.clickOpens = false;
    }

    flatpickrRef.current = flatpickr(inputRef.current, options);

    return () => {
      if (flatpickrRef.current && !Array.isArray(flatpickrRef.current)) {
        flatpickrRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, disabled, displayTimezone, minuteStep, timePrecision, ampm]);

  useEffect(() => {
    if (!flatpickrRef.current || Array.isArray(flatpickrRef.current)) {
      return;
    }
    if (value === undefined) {
      return;
    }
    if (value == null) {
      if (flatpickrRef.current.selectedDates.length > 0) {
        flatpickrRef.current.clear(false);
      }
      return;
    }

    const nextDate = toWallClockDate(value.utc(), displayTimezone);
    const current = flatpickrRef.current.selectedDates[0];
    if (!current || current.getTime() !== nextDate.getTime()) {
      flatpickrRef.current.setDate(nextDate, false);
    }
  }, [value, displayTimezone]);

  useEffect(() => {
    if (!flatpickrRef.current || Array.isArray(flatpickrRef.current)) {
      return;
    }
    flatpickrRef.current.set(
      "minDate",
      minDate != null ? boundToFlatpickrDate(minDate, displayTimezone) : undefined
    );
    flatpickrRef.current.set(
      "maxDate",
      maxDate != null ? boundToFlatpickrDate(maxDate, displayTimezone) : undefined
    );
  }, [minDate, maxDate, displayTimezone]);

  useEffect(() => {
    if (!flatpickrRef.current || Array.isArray(flatpickrRef.current)) {
      return;
    }
    if (disabled) {
      flatpickrRef.current.close();
      flatpickrRef.current.set("clickOpens", false);
    } else {
      flatpickrRef.current.set("clickOpens", true);
    }
  }, [disabled]);

  const handleClear = () => {
    if (disabled) {
      return;
    }
    if (flatpickrRef.current && !Array.isArray(flatpickrRef.current)) {
      flatpickrRef.current.clear(false);
    }
    emitChange(null, "field");
  };

  const showClear = clearable && !disabled && hasValue;
  const inputClasses = cn(fieldBase, "pr-20", error && fieldError, disabled && fieldDisabled);

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      wrapperClassName={wrapperClassName}
    >
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
          readOnly
        />

        <span
          className={cn(
            "absolute -translate-y-1/2 right-3 top-1/2 flex items-center gap-1",
            textMuted
          )}
        >
          {showClear && (
            <button
              type="button"
              aria-label="Clear"
              className="pointer-events-auto p-0.5 hover:text-on-surface"
              onClick={handleClear}
            >
              <MdClear className="size-5" />
            </button>
          )}
          <span className="pointer-events-none">
            <MdCalendarToday className="size-6" />
          </span>
        </span>
      </div>
    </FormField>
  );
}
