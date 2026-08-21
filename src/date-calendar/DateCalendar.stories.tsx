import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { dayjs, type Dayjs } from "../lib/dayjs";
import DateCalendar from "./index";

const meta: Meta<typeof DateCalendar> = {
  title: "Components/DateCalendar",
  component: DateCalendar,
  args: {
    value: dayjs("2026-08-10"),
  },
};

export default meta;

type Story = StoryObj<typeof DateCalendar>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(args.value ?? dayjs("2026-08-10"));
    return <DateCalendar {...args} value={value} onChange={(next) => setValue(next)} />;
  },
};

export const WeekStartsMonday: Story = {
  args: { weekStartsOn: 1 },
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(dayjs("2026-08-10"));
    return <DateCalendar {...args} value={value} onChange={(next) => setValue(next)} />;
  },
};

export const WithSubmit: Story = {
  args: {
    showSubmitButton: true,
    labels: { submit: "Done" },
  },
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(dayjs("2026-08-10"));
    return <DateCalendar {...args} value={value} onChange={(next) => setValue(next)} />;
  },
};

export const WithTodayAndSubmit: Story = {
  args: {
    showTodayButton: true,
    showSubmitButton: true,
    labels: { today: "Today", submit: "Done" },
  },
  render: (args) => {
    const [value, setValue] = useState<Dayjs | null>(dayjs("2026-08-10"));
    return <DateCalendar {...args} value={value} onChange={(next) => setValue(next)} />;
  },
};
