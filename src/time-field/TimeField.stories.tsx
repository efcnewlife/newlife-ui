import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CONTROL_SIZES, SizeStack } from "../../.storybook/size-stack";
import { dayjs, type Dayjs } from "../lib/dayjs";
import type { PickerChangeMeta } from "../picker/types";
import TimeField from "./index";

const meta: Meta<typeof TimeField> = {
  title: "Components/TimeField",
  component: TimeField,
  args: {
    id: "time-field-default",
    label: "Start time",
  },
};

export default meta;

type Story = StoryObj<typeof TimeField>;

const validationMessage = (meta: PickerChangeMeta): string | undefined => {
  switch (meta.validationError) {
    case "invalidDate":
      return "Enter a valid time (HH:mm)";
    default:
      return undefined;
  }
};

export const Default: Story = {
  render: (args) => <TimeField {...args} />,
};

export const Sizes: Story = {
  args: { value: dayjs("1970-01-01T14:30:00") },
  render: (args) => (
    <SizeStack
      sizes={CONTROL_SIZES}
      render={(size) => <TimeField {...args} id={`time-field-${size}`} label={`Start time (${size})`} size={size} />}
    />
  ),
};

export const WithError: Story = {
  args: { error: "Time is required", required: true },
  render: (args) => <TimeField {...args} />,
};

export const SecondsPrecision: Story = {
  args: { timePrecision: "seconds" },
  render: (args) => <TimeField {...args} />,
};

export const Ampm: Story = {
  args: {
    ampm: true,
    value: dayjs("1970-01-01T14:30:00"),
  },
  render: (args) => <TimeField {...args} />,
};

export const AmpmWithDisplayFormat: Story = {
  args: {
    ampm: true,
    format: "h:mm A",
    value: dayjs("1970-01-01T14:30:00"),
  },
  render: (args) => <TimeField {...args} />,
};

export const ControlledDayjs: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(dayjs("1970-01-01T14:30:00"));
    return <TimeField {...args} value={value} onChange={(next) => setValue(next)} />;
  },
};

export const Validation: Story = {
  args: {
    id: "time-field-validation",
  },
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(null);
    const [error, setError] = useState<string | undefined>();
    const [meta, setMeta] = useState<PickerChangeMeta | null>(null);

    return (
      <div className="space-y-3">
        <TimeField
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
          Type digits only (for example <code>0945</code>); colons are inserted automatically. Partial input like{" "}
          <code>094</code> sets <code>meta.validationError</code>, which hosts map to <code>error</code>.
        </p>
        <pre className="rounded-lg bg-surface-variant p-3 text-xs text-on-surface">
          {JSON.stringify(
            {
              value: value?.format("HH:mm:ss") ?? null,
              anchor: value?.format("YYYY-MM-DD") ?? null,
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
