import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { dayjs, type Dayjs } from "../lib/dayjs";
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

export const Default: Story = {
  render: (args) => <DateField {...args} />,
};

export const WithError: Story = {
  args: { error: "Date is required", required: true },
  render: (args) => <DateField {...args} />,
};

export const ControlledDayjs: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(dayjs("2026-06-20"));
    return (
      <DateField
        {...args}
        value={value}
        onChange={(next) => setValue(next)}
      />
    );
  },
};
