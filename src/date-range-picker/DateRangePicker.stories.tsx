import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { dayjs } from "../lib/dayjs";
import type { DateRangeValue } from "../picker/date-range";
import DateRangePicker from "./index";

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  args: {
    id: "date-range-picker-default",
    label: "Date range",
    defaultMonth: dayjs("2026-08-01"),
    wrapperClassName: "w-96",
  },
};

export default meta;

type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  render: (args) => <DateRangePicker {...args} />,
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<DateRangeValue | null>({
      start: dayjs("2026-08-10"),
      end: dayjs("2026-08-15"),
    });
    return (
      <DateRangePicker
        {...args}
        value={value}
        onChange={(next) => setValue(next)}
      />
    );
  },
};

export const WithSubmitButton: Story = {
  args: {
    showSubmitButton: true,
    labels: { submit: "Done" },
  },
  render: (args) => {
    const [value, setValue] = useState<DateRangeValue | null>(null);
    return (
      <DateRangePicker
        {...args}
        value={value}
        onChange={(next) => setValue(next)}
      />
    );
  },
};

export const WithShortcuts: Story = {
  args: {
    shortcuts: [
      {
        label: "Last 7 days",
        getValue: () => ({
          start: dayjs("2026-08-04"),
          end: dayjs("2026-08-10"),
        }),
      },
      {
        label: "Clear",
        getValue: () => null,
      },
    ],
    shortcutsPlacement: "left",
  },
  render: (args) => {
    const [value, setValue] = useState<DateRangeValue | null>(null);
    return (
      <DateRangePicker
        {...args}
        value={value}
        onChange={(next) => setValue(next)}
      />
    );
  },
};

export const WithShortcutsAndSubmit: Story = {
  args: {
    showSubmitButton: true,
    labels: { submit: "Done" },
    shortcutsPlacement: "left",
    shortcuts: [
      {
        label: "This week",
        getValue: () => ({
          start: dayjs("2026-08-09"),
          end: dayjs("2026-08-15"),
        }),
      },
      {
        label: "Last 7 days",
        getValue: () => ({
          start: dayjs("2026-08-04"),
          end: dayjs("2026-08-10"),
        }),
      },
      {
        label: "Clear",
        getValue: () => null,
      },
    ],
  },
  render: (args) => {
    const [value, setValue] = useState<DateRangeValue | null>({
      start: dayjs("2026-08-10"),
      end: dayjs("2026-08-15"),
    });
    return (
      <DateRangePicker
        {...args}
        value={value}
        onChange={(next) => setValue(next)}
      />
    );
  },
};

export const Clearable: Story = {
  args: { clearable: true },
  render: (args) => {
    const [value, setValue] = useState<DateRangeValue | null>({
      start: dayjs("2026-08-10"),
      end: dayjs("2026-08-15"),
    });
    return (
      <DateRangePicker
        {...args}
        value={value}
        onChange={(next) => setValue(next)}
      />
    );
  },
};
