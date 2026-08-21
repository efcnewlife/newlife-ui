import { cn } from "../cn";
import type { Dayjs } from "../lib/dayjs";
import { calendarGridOption, calendarGridOptionSelected, surfacePanel, textMuted } from "../theme/role-classes";
import { createTimeOfDay, dayjsToTimeString, toTimeOfDay, type TimePrecision } from "./time";
import type { PickerChangeMeta } from "./types";

export type DigitalTimeVariant = "digital" | "sections";

export interface DigitalTimeSurfaceProps {
  value?: Dayjs | null;
  onChange?: (value: Dayjs, meta: PickerChangeMeta) => void;
  variant?: DigitalTimeVariant;
  minuteStep?: number;
  ampm?: boolean;
  timePrecision?: TimePrecision;
  disabled?: boolean;
  className?: string;
}

const pad = (value: number): string => String(value).padStart(2, "0");

const buildSteppedValues = (maxExclusive: number, step: number): number[] => {
  const values: number[] = [];
  const safeStep = Math.max(1, step);
  for (let value = 0; value < maxExclusive; value += safeStep) {
    values.push(value);
  }
  return values;
};

const hourOptions = (ampm: boolean): number[] => {
  if (ampm) {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  }
  return Array.from({ length: 24 }, (_, index) => index);
};

const toDisplayHour = (hour24: number, ampm: boolean): number => {
  if (!ampm) {
    return hour24;
  }
  const mod = hour24 % 12;
  return mod === 0 ? 12 : mod;
};

const toHour24 = (displayHour: number, isPm: boolean, ampm: boolean): number => {
  if (!ampm) {
    return displayHour;
  }
  if (displayHour === 12) {
    return isPm ? 12 : 0;
  }
  return isPm ? displayHour + 12 : displayHour;
};

const resolveParts = (value: Dayjs | null | undefined) => {
  if (value == null || !value.isValid()) {
    return { hour: 0, minute: 0, second: 0 };
  }
  const anchored = toTimeOfDay(value);
  return {
    hour: anchored.hour(),
    minute: anchored.minute(),
    second: anchored.second(),
  };
};

const buildDigitalOptions = (minuteStep: number, timePrecision: TimePrecision): Dayjs[] => {
  const options: Dayjs[] = [];
  const minuteValues = buildSteppedValues(60, minuteStep);
  const secondValues = timePrecision === "seconds" ? buildSteppedValues(60, 1) : [0];

  for (let hour = 0; hour < 24; hour += 1) {
    for (const minute of minuteValues) {
      for (const second of secondValues) {
        options.push(createTimeOfDay(hour, minute, second));
      }
    }
  }

  return options;
};

const formatDigitalLabel = (value: Dayjs, timePrecision: TimePrecision, ampm: boolean): string => {
  if (!ampm) {
    return dayjsToTimeString(value, timePrecision);
  }
  const suffix = value.hour() >= 12 ? "PM" : "AM";
  const hour12 = toDisplayHour(value.hour(), true);
  if (timePrecision === "seconds") {
    return `${pad(hour12)}:${pad(value.minute())}:${pad(value.second())} ${suffix}`;
  }
  return `${pad(hour12)}:${pad(value.minute())} ${suffix}`;
};

interface TimeColumnProps {
  label: string;
  options: Array<{ value: number | string; label: string }>;
  selected: number | string | null;
  disabled?: boolean;
  onSelect: (value: number | string) => void;
}

const TimeColumn = ({ label, options, selected, disabled, onSelect }: TimeColumnProps) => {
  return (
    <div className="flex min-w-14 flex-col">
      <div className={cn("px-2 pb-1 text-center text-xs font-medium", textMuted)}>{label}</div>
      <ul role="listbox" aria-label={label} className="max-h-56 overflow-y-auto py-1">
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <li key={String(option.value)} role="none">
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={disabled}
                className={cn(
                  "w-full",
                  calendarGridOption,
                  isSelected && calendarGridOptionSelected,
                  disabled && "cursor-not-allowed opacity-40"
                )}
                onClick={() => onSelect(option.value)}
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/**
 * Private digital time surface shared by TimePicker and DateTimePicker.
 * Not part of the public package API.
 */
export default function DigitalTimeSurface({
  value = null,
  onChange,
  variant = "sections",
  minuteStep = 1,
  ampm = false,
  timePrecision = "minutes",
  disabled = false,
  className,
}: DigitalTimeSurfaceProps) {
  const parts = resolveParts(value);
  const isPm = parts.hour >= 12;

  const emit = (hour: number, minute: number, second: number) => {
    if (disabled) {
      return;
    }
    const next = createTimeOfDay(hour, minute, second);
    onChange?.(next, { validationError: null, source: "view" });
  };

  if (variant === "digital") {
    const options = buildDigitalOptions(minuteStep, timePrecision);
    const selectedKey = value != null && value.isValid() ? dayjsToTimeString(toTimeOfDay(value), timePrecision) : null;

    return (
      <div className={cn(surfacePanel, "rounded-xl p-2", className)}>
        <ul role="listbox" aria-label="Times" className="max-h-64 overflow-y-auto py-1">
          {options.map((option) => {
            const key = dayjsToTimeString(option, timePrecision);
            const isSelected = selectedKey === key;
            return (
              <li key={key} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={disabled}
                  className={cn(
                    "w-full text-left",
                    calendarGridOption,
                    isSelected && calendarGridOptionSelected,
                    disabled && "cursor-not-allowed opacity-40"
                  )}
                  onClick={() => emit(option.hour(), option.minute(), option.second())}
                >
                  {formatDigitalLabel(option, timePrecision, ampm)}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const selectedDisplayHour = toDisplayHour(parts.hour, ampm);
  const minuteValues = buildSteppedValues(60, minuteStep);
  const secondValues = buildSteppedValues(60, 1);

  return (
    <div className={cn(surfacePanel, "flex gap-1 rounded-xl p-2", className)}>
      <TimeColumn
        label="Hours"
        selected={selectedDisplayHour}
        disabled={disabled}
        options={hourOptions(ampm).map((hour) => ({
          value: hour,
          label: pad(hour),
        }))}
        onSelect={(nextHour) =>
          emit(toHour24(Number(nextHour), isPm, ampm), parts.minute, timePrecision === "seconds" ? parts.second : 0)
        }
      />
      <TimeColumn
        label="Minutes"
        selected={parts.minute}
        disabled={disabled}
        options={minuteValues.map((minute) => ({
          value: minute,
          label: pad(minute),
        }))}
        onSelect={(nextMinute) => emit(parts.hour, Number(nextMinute), timePrecision === "seconds" ? parts.second : 0)}
      />
      {timePrecision === "seconds" ? (
        <TimeColumn
          label="Seconds"
          selected={parts.second}
          disabled={disabled}
          options={secondValues.map((second) => ({
            value: second,
            label: pad(second),
          }))}
          onSelect={(nextSecond) => emit(parts.hour, parts.minute, Number(nextSecond))}
        />
      ) : null}
      {ampm ? (
        <TimeColumn
          label="Meridiem"
          selected={isPm ? "PM" : "AM"}
          disabled={disabled}
          options={[
            { value: "AM", label: "AM" },
            { value: "PM", label: "PM" },
          ]}
          onSelect={(nextMeridiem) =>
            emit(
              toHour24(selectedDisplayHour, nextMeridiem === "PM", true),
              parts.minute,
              timePrecision === "seconds" ? parts.second : 0
            )
          }
        />
      ) : null}
    </div>
  );
}
