import { cn } from "../cn";
import FormField from "../form-field";
import { dayjs, type Dayjs } from "../lib/dayjs";
import {
  calendarStringToDayjs,
  dayjsOrNullToFlatpickr,
  dayjsToCalendarString,
} from "../picker/datetime";
import type { PickerChangeMeta, PickerValidationError } from "../picker/types";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useEffect, useRef } from "react";
import { MdCalendarToday } from "react-icons/md";
import { fieldBase, fieldDisabled, fieldError, textMuted } from "../theme/role-classes";

export type DatePickerMode = "single" | "multiple" | "range" | "time";

export type DatePickerValue = Dayjs | Dayjs[] | null;

export interface DatePickerProps {
  id: string;
  mode?: DatePickerMode;
  onChange?: (value: DatePickerValue, meta: PickerChangeMeta) => void;
  value?: DatePickerValue;
  defaultValue?: DatePickerValue;
  timezone?: string;
  minDate?: Dayjs | Date | string;
  maxDate?: Dayjs | Date | string;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  wrapperClassName?: string;
}

const toDayjsBound = (value: Dayjs | Date | string | undefined): Dayjs | undefined => {
  if (value == null) {
    return undefined;
  }
  if (dayjs.isDayjs(value)) {
    return value;
  }
  return dayjs(value);
};

const selectedDatesToValue = (
  selectedDates: Date[],
  mode: DatePickerMode,
  timezone?: string
): DatePickerValue => {
  if (selectedDates.length === 0) {
    return null;
  }

  const mapped = selectedDates.map((date) =>
    calendarStringToDayjs(dayjs(date).format("YYYY-MM-DD"), timezone)
  );

  if (mode === "single" || mode === "time") {
    return mapped[0] ?? null;
  }

  return mapped;
};

const validateDateValue = (
  value: DatePickerValue,
  minDate?: Dayjs,
  maxDate?: Dayjs
): PickerValidationError => {
  if (value == null) {
    return null;
  }

  const values = Array.isArray(value) ? value : [value];
  for (const item of values) {
    if (!item.isValid()) {
      return "invalidDate";
    }
    if (minDate && item.startOf("day").isBefore(minDate.startOf("day"))) {
      return "minDate";
    }
    if (maxDate && item.startOf("day").isAfter(maxDate.startOf("day"))) {
      return "maxDate";
    }
  }

  return null;
};

export default function DatePicker({
  id,
  mode = "single",
  onChange,
  value,
  defaultValue,
  timezone,
  minDate,
  maxDate,
  label,
  placeholder,
  error,
  required,
  disabled,
  wrapperClassName,
}: DatePickerProps) {
  const flatpickrRef = useRef<flatpickr.Instance | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onChangeRef = useRef(onChange);
  const timezoneRef = useRef(timezone);
  const minDateRef = useRef(toDayjsBound(minDate));
  const maxDateRef = useRef(toDayjsBound(maxDate));

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    timezoneRef.current = timezone;
  }, [timezone]);

  useEffect(() => {
    minDateRef.current = toDayjsBound(minDate);
  }, [minDate]);

  useEffect(() => {
    maxDateRef.current = toDayjsBound(maxDate);
  }, [maxDate]);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    const initial =
      value !== undefined
        ? dayjsOrNullToFlatpickr(value, timezone)
        : dayjsOrNullToFlatpickr(defaultValue, timezone);

    const options: flatpickr.Options.Options = {
      mode,
      static: true,
      monthSelectorType: "static",
      dateFormat: mode === "time" ? "H:i" : "Y-m-d",
      defaultDate: initial,
      onChange: (selectedDates) => {
        if (!onChangeRef.current) {
          return;
        }

        const nextValue = selectedDatesToValue(selectedDates, mode, timezoneRef.current);
        const validationError = validateDateValue(
          nextValue,
          minDateRef.current,
          maxDateRef.current
        );

        onChangeRef.current(nextValue, {
          validationError,
          source: "view",
        });
      },
      disableMobile: true,
    };

    if (minDate != null) {
      options.minDate = dayjsToCalendarString(toDayjsBound(minDate)!, timezone);
    }
    if (maxDate != null) {
      options.maxDate = dayjsToCalendarString(toDayjsBound(maxDate)!, timezone);
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
  }, [mode, id, disabled]);

  useEffect(() => {
    if (!flatpickrRef.current || Array.isArray(flatpickrRef.current)) {
      return;
    }

    if (value === undefined) {
      return;
    }

    if (value == null) {
      flatpickrRef.current.clear();
      return;
    }

    const next = dayjsOrNullToFlatpickr(value, timezone);
    if (next == null) {
      return;
    }
    const current = flatpickrRef.current.input.value;
    const nextDisplay = Array.isArray(next) ? next.join(" to ") : next;
    if (nextDisplay && current !== nextDisplay) {
      flatpickrRef.current.setDate(next, false);
    }
  }, [value, timezone]);

  useEffect(() => {
    if (!flatpickrRef.current || Array.isArray(flatpickrRef.current)) {
      return;
    }
    if (minDate !== undefined) {
      flatpickrRef.current.set(
        "minDate",
        dayjsToCalendarString(toDayjsBound(minDate)!, timezone)
      );
    }
  }, [minDate, timezone]);

  useEffect(() => {
    if (!flatpickrRef.current || Array.isArray(flatpickrRef.current)) {
      return;
    }
    if (maxDate !== undefined) {
      flatpickrRef.current.set(
        "maxDate",
        dayjsToCalendarString(toDayjsBound(maxDate)!, timezone)
      );
    }
  }, [maxDate, timezone]);

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

  const inputClasses = cn(fieldBase, error && fieldError, disabled && fieldDisabled);

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

        <span className={cn("absolute -translate-y-1/2 pointer-events-none right-3 top-1/2", textMuted)}>
          <MdCalendarToday className="size-6" />
        </span>
      </div>
    </FormField>
  );
}
