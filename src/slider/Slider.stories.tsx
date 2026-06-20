import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Slider from "./index";

const MINUTES_IN_DAY = 24 * 60;

const formatMinutesAsTime = (minutes: number): string => {
  const clampedMinutes = Math.max(0, Math.min(MINUTES_IN_DAY, minutes));
  const hours = Math.floor(clampedMinutes / 60);
  const mins = clampedMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

const formatTimeRange = (value: number[]): string => {
  const [startMinutes, endMinutes] = value;
  return `${formatMinutesAsTime(startMinutes)} – ${formatMinutesAsTime(endMinutes)}`;
};

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  args: {
    defaultValue: [33],
    max: 100,
    step: 1,
  },
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: (args) => (
    <div className="mx-auto w-full max-w-xs">
      <Slider {...args} />
    </div>
  ),
};

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
  },
  render: (args) => (
    <div className="mx-auto w-full max-w-xs">
      <Slider {...args} />
    </div>
  ),
};

export const MultipleThumbs: Story = {
  args: {
    defaultValue: [20, 50, 80],
  },
  render: (args) => (
    <div className="mx-auto w-full max-w-xs">
      <Slider {...args} />
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    defaultValue: [33],
    orientation: "vertical",
  },
  render: (args) => (
    <div className="mx-auto flex h-48 items-center justify-center">
      <Slider {...args} />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<number[]>([0.3, 0.7]);

    return (
      <div className="mx-auto grid w-full max-w-xs gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-on-surface">Temperature</span>
          <span className="text-sm text-on-surface-variant">{value.join(", ")}</span>
        </div>
        <Slider
          value={value}
          onValueChange={(nextValue) => setValue(nextValue as number[])}
          min={0}
          max={1}
          step={0.1}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    disabled: true,
  },
  render: (args) => (
    <div className="mx-auto w-full max-w-xs">
      <Slider {...args} />
    </div>
  ),
};

export const TimeRange: Story = {
  render: () => {
    const [value, setValue] = useState<number[]>([9 * 60, 17 * 60]);

    return (
      <div className="mx-auto grid w-full max-w-md gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-on-surface">Available hours</span>
          <span className="text-sm tabular-nums text-on-surface-variant">{formatTimeRange(value)}</span>
        </div>

        <Slider
          aria-label="Available hours"
          value={value}
          onValueChange={(nextValue) => setValue(nextValue as number[])}
          min={0}
          max={MINUTES_IN_DAY}
          step={15}
          minStepsBetweenValues={1}
        />

        <div className="flex justify-between text-xs text-on-surface-variant tabular-nums">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>
    );
  },
};
