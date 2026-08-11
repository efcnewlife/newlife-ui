import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { dayjs } from "../lib/dayjs";
import type { DateRangeValue } from "../picker/date-range";
import DateRangeCalendar from "./index";

const meta: Meta<typeof DateRangeCalendar> = {
  title: "Components/DateRangeCalendar",
  component: DateRangeCalendar,
  args: {
    defaultMonth: dayjs("2026-08-01"),
  },
};

export default meta;

type Story = StoryObj<typeof DateRangeCalendar>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<DateRangeValue | null>({
      start: dayjs("2026-08-10"),
      end: dayjs("2026-08-15"),
    });
    return (
      <DateRangeCalendar
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
        label: "This week",
        getValue: () => ({
          start: dayjs("2026-08-09"),
          end: dayjs("2026-08-15"),
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
      <DateRangeCalendar
        {...args}
        value={value}
        onChange={(next) => setValue(next)}
      />
    );
  },
};

export const ShortcutsOnRight: Story = {
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
    shortcutsPlacement: "right",
  },
  render: (args) => {
    const [value, setValue] = useState<DateRangeValue | null>(null);
    return (
      <DateRangeCalendar
        {...args}
        value={value}
        onChange={(next) => setValue(next)}
      />
    );
  },
};

export const WithSubmit: Story = {
  args: {
    showSubmitButton: true,
    labels: { submit: "Done" },
  },
  render: (args) => {
    const [value, setValue] = useState<DateRangeValue | null>({
      start: dayjs("2026-08-10"),
      end: dayjs("2026-08-12"),
    });
    return (
      <DateRangeCalendar
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
      <DateRangeCalendar
        {...args}
        value={value}
        onChange={(next) => setValue(next)}
        onSubmit={() => undefined}
      />
    );
  },
};
