import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CONTROL_SIZES, SizeStack } from "../../.storybook/size-stack";
import { dayjs, type Dayjs } from "../lib/dayjs";
import type { PickerChangeMeta } from "../picker/types";
import DateField from "./index";

const meta: Meta<typeof DateField> = {
  title: "Components/DateField",
  component: DateField,
  args: {
    id: "date-field-default",
    label: "Start date",
    placeholder: "YYYY-MM-DD",
  },
};

export default meta;

type Story = StoryObj<typeof DateField>;

const validationMessage = (meta: PickerChangeMeta): string | undefined => {
  switch (meta.validationError) {
    case "invalidDate":
      return "Enter a valid date (YYYY-MM-DD)";
    case "minDate":
      return "Date is before the minimum";
    case "maxDate":
      return "Date is after the maximum";
    default:
      return undefined;
  }
};

export const Default: Story = {
  render: (args) => <DateField {...args} />,
};

export const Sizes: Story = {
  args: { value: dayjs("2026-06-20") },
  render: (args) => (
    <SizeStack
      sizes={CONTROL_SIZES}
      render={(size) => <DateField {...args} id={`date-field-${size}`} label={`Start date (${size})`} size={size} />}
    />
  ),
};

export const WithError: Story = {
  args: { error: "Date is required", required: true },
  render: (args) => <DateField {...args} />,
};

export const ControlledDayjs: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(dayjs("2026-06-20"));
    return <DateField {...args} value={value} onChange={(next) => setValue(next)} />;
  },
};

export const Validation: Story = {
  args: {
    id: "date-field-validation",
    minDate: dayjs("1990-06-01"),
    maxDate: dayjs("2030-06-30"),
  },
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(null);
    const [error, setError] = useState<string | undefined>();
    const [meta, setMeta] = useState<PickerChangeMeta | null>(null);

    return (
      <div className="space-y-3">
        <DateField
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
          Type digits only (for example <code>20260815</code>); dashes are inserted automatically. Incomplete or
          out-of-range values set <code>meta.validationError</code>, which hosts map to <code>error</code>.
        </p>
        <pre className="rounded-lg bg-surface-variant p-3 text-xs text-on-surface">
          {JSON.stringify(
            {
              value: value?.format("YYYY-MM-DD") ?? null,
              validationError: meta?.validationError ?? null,
              source: meta?.source ?? null,
            },
            null,
            2
          )}
        </pre>
      </div>
    );
  },
};
