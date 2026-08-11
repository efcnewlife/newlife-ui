import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { dayjs, type Dayjs } from "../lib/dayjs";
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

export const Default: Story = {
  render: (args) => <TimeField {...args} />,
};

export const WithError: Story = {
  args: { error: "Time is required", required: true },
  render: (args) => <TimeField {...args} />,
};

export const SecondsPrecision: Story = {
  args: { timePrecision: "seconds" },
  render: (args) => <TimeField {...args} />,
};

export const ControlledDayjs: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(dayjs("1970-01-01T14:30:00"));
    return (
      <TimeField
        {...args}
        value={value}
        onChange={(next) => setValue(next)}
      />
    );
  },
};
