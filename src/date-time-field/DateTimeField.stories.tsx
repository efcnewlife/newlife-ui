import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { dayjs, type Dayjs } from "../lib/dayjs";
import type { PickerChangeMeta } from "../picker/types";
import DateTimeField from "./index";

const meta: Meta<typeof DateTimeField> = {
  title: "Components/DateTimeField",
  component: DateTimeField,
  args: {
    id: "date-time-field-default",
    label: "Starts at",
    placeholder: "YYYY-MM-DD HH:mm",
  },
};

export default meta;

type Story = StoryObj<typeof DateTimeField>;

const validationMessage = (meta: PickerChangeMeta): string | undefined => {
  switch (meta.validationError) {
    case "invalidDate":
      return "Enter a valid date and time";
    case "minDateTime":
      return "Date time is before the minimum";
    case "maxDateTime":
      return "Date time is after the maximum";
    case "minDate":
      return "Date is before the minimum";
    case "maxDate":
      return "Date is after the maximum";
    default:
      return undefined;
  }
};

export const Default: Story = {
  render: (args) => <DateTimeField {...args} />,
};

export const WithError: Story = {
  args: { error: "Start time is required", required: true },
  render: (args) => <DateTimeField {...args} />,
};

export const ControlledUtcWithTimezone: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(
      dayjs.utc("2026-06-20T15:30:00.000Z")
    );
    return (
      <DateTimeField
        {...args}
        value={value}
        timezone="America/New_York"
        onChange={(next) => setValue(next)}
      />
    );
  },
};

export const WithSeconds: Story = {
  args: {
    timePrecision: "seconds",
    value: dayjs.utc("2026-06-20T15:30:45.000Z"),
    timezone: "UTC",
  },
  render: (args) => <DateTimeField {...args} />,
};

export const Validation: Story = {
  args: {
    id: "date-time-field-validation",
    timezone: "UTC",
    minDateTime: dayjs.utc("2026-06-01T00:00:00.000Z"),
    maxDateTime: dayjs.utc("2026-06-30T23:59:59.000Z"),
  },
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(null);
    const [error, setError] = useState<string | undefined>();
    const [meta, setMeta] = useState<PickerChangeMeta | null>(null);

    return (
      <div className="space-y-3">
        <DateTimeField
          {...args}
          value={value}
          error={error}
          onChange={(next, nextMeta) => {
            setValue(next);
            setMeta(nextMeta);
            setError(validationMessage(nextMeta));
          }}
        />
        <p className="text-sm text-on-surface-variant">
          Type digits only (for example <code>202606201530</code>); separators are
          inserted automatically.
        </p>
        {meta ? (
          <pre className="text-xs text-on-surface-variant">
            {JSON.stringify(
              {
                value: value?.toISOString() ?? null,
                validationError: meta.validationError,
                source: meta.source,
              },
              null,
              2
            )}
          </pre>
        ) : null}
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: dayjs.utc("2026-06-20T15:30:00.000Z"),
    timezone: "UTC",
  },
  render: (args) => <DateTimeField {...args} />,
};
