import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CONTROL_SIZES, SizeStack } from "../../.storybook/size-stack";
import { dayjs, type Dayjs } from "../lib/dayjs";
import TimePicker from "./index";

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
  args: {
    id: "time-picker-default",
    label: "Start time",
  },
};

export default meta;

type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  render: (args) => <TimePicker {...args} />,
};

export const Sizes: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(dayjs("1970-01-01T14:30:00"));
    return (
      <SizeStack
        sizes={CONTROL_SIZES}
        render={(size) => (
          <TimePicker
            {...args}
            id={`time-picker-${size}`}
            label={`Start time (${size})`}
            size={size}
            value={value}
            onChange={(next) => setValue(next)}
          />
        )}
      />
    );
  },
};

export const WithError: Story = {
  args: { error: "Time is required", required: true },
  render: (args) => <TimePicker {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, value: dayjs("1970-01-01T09:30:00") },
  render: (args) => <TimePicker {...args} />,
};

export const SectionsVariant: Story = {
  args: { variant: "sections" },
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(dayjs("1970-01-01T14:30:00"));
    return <TimePicker {...args} value={value} onChange={(next) => setValue(next)} />;
  },
};

export const DigitalVariant: Story = {
  args: { variant: "digital", minuteStep: 15 },
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(dayjs("1970-01-01T09:00:00"));
    return <TimePicker {...args} value={value} onChange={(next) => setValue(next)} />;
  },
};

export const AmpmWithSeconds: Story = {
  args: { ampm: true, timePrecision: "seconds" },
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(dayjs("1970-01-01T09:30:00"));
    return <TimePicker {...args} value={value} onChange={(next) => setValue(next)} />;
  },
};
