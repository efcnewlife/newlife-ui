import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CONTROL_SIZES, SizeStack } from "../../.storybook/size-stack";
import { dayjs } from "../lib/dayjs";
import type { DateRangeValue } from "../picker/date-range";
import DateRangeField from "./index";

const meta: Meta<typeof DateRangeField> = {
  title: "Components/DateRangeField",
  component: DateRangeField,
  args: {
    id: "date-range-field-default",
    label: "Date range",
    wrapperClassName: "w-96",
  },
};

export default meta;

type Story = StoryObj<typeof DateRangeField>;

export const Default: Story = {
  render: (args) => <DateRangeField {...args} />,
};

export const Sizes: Story = {
  args: {
    value: { start: dayjs("2026-08-10"), end: dayjs("2026-08-15") },
  },
  render: (args) => (
    <SizeStack
      sizes={CONTROL_SIZES}
      render={(size) => <DateRangeField {...args} id={`date-range-field-${size}`} label={`Date range (${size})`} size={size} />}
    />
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<DateRangeValue | null>({
      start: dayjs("2026-08-10"),
      end: dayjs("2026-08-15"),
    });
    return <DateRangeField {...args} value={value} onChange={(next) => setValue(next)} />;
  },
};

export const HalfSelection: Story = {
  render: (args) => {
    const [value, setValue] = useState<DateRangeValue | null>({
      start: dayjs("2026-08-10"),
      end: null,
    });
    return <DateRangeField {...args} value={value} onChange={(next) => setValue(next)} />;
  },
};

export const WithError: Story = {
  args: { error: "Range is required", required: true },
  render: (args) => <DateRangeField {...args} />,
};
