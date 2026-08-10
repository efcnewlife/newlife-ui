import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { dayjs, type Dayjs } from "../lib/dayjs";
import DatePicker from "./index";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  args: {
    id: "date-picker-default",
    label: "Start date",
    placeholder: "Select date",
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: (args) => <DatePicker {...args} />,
};

export const WithError: Story = {
  args: { error: "Date is required", required: true },
  render: (args) => <DatePicker {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, value: dayjs("2026-06-20") },
  render: (args) => <DatePicker {...args} />,
};

export const RangeMode: Story = {
  args: { mode: "range", label: "Date range" },
  render: (args) => <DatePicker {...args} />,
};

export const ControlledDayjs: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(dayjs("2026-06-20"));
    return (
      <DatePicker
        {...args}
        value={value}
        onChange={(next) => {
          setValue(Array.isArray(next) ? next[0] ?? null : next);
        }}
      />
    );
  },
};
