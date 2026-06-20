import type { Meta, StoryObj } from "@storybook/react";
import ProgressBar from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  args: {
    progress: 45,
  },
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Small: Story = {
  args: { size: "sm" },
  render: (args) => <ProgressBar {...args} />,
};

export const OutsideLabel: Story = {
  args: { label: "outside", progress: 72 },
  render: (args) => <ProgressBar {...args} />,
};

export const InsideLabel: Story = {
  args: { label: "inside", progress: 88, size: "xl" },
  render: (args) => <ProgressBar {...args} />,
};

export const Complete: Story = {
  args: { progress: 100, label: "outside" },
  render: (args) => <ProgressBar {...args} />,
};
