import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { dayjs, type Dayjs } from "../lib/dayjs";
import DateTimePicker from "./index";

const meta: Meta<typeof DateTimePicker> = {
  title: "Components/DateTimePicker",
  component: DateTimePicker,
  args: {
    id: "date-time-picker-default",
    label: "Starts at",
    placeholder: "Select date and time",
  },
};

export default meta;

type Story = StoryObj<typeof DateTimePicker>;

export const Default: Story = {
  render: (args) => <DateTimePicker {...args} />,
};

export const ControlledUtcWithTimezone: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(
      dayjs.utc("2026-06-20T15:30:00.000Z")
    );
    return (
      <DateTimePicker
        {...args}
        value={value}
        timezone="America/New_York"
        onChange={(next) => setValue(next)}
      />
    );
  },
};

export const WithMinuteStep: Story = {
  args: {
    minuteStep: 15,
    value: dayjs.utc("2026-06-20T15:00:00.000Z"),
    timezone: "UTC",
  },
  render: (args) => <DateTimePicker {...args} />,
};

export const WithSeconds: Story = {
  args: {
    timePrecision: "seconds",
    value: dayjs.utc("2026-06-20T15:30:45.000Z"),
    timezone: "UTC",
  },
  render: (args) => <DateTimePicker {...args} />,
};

export const Ampm: Story = {
  args: {
    ampm: true,
    value: dayjs.utc("2026-06-20T15:30:00.000Z"),
    timezone: "UTC",
  },
  render: (args) => <DateTimePicker {...args} />,
};

export const WithError: Story = {
  args: { error: "Start time is required", required: true },
  render: (args) => <DateTimePicker {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: dayjs.utc("2026-06-20T15:30:00.000Z"),
    timezone: "UTC",
  },
  render: (args) => <DateTimePicker {...args} />,
};
