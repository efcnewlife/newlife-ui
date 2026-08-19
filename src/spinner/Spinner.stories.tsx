import type { Meta, StoryObj } from "@storybook/react";
import { SizeStack, SPINNER_SIZES } from "../../.storybook/size-stack";
import Spinner from "./index";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Primary: Story = {
  args: { color: "primary", size: "md" },
  render: (args) => <Spinner {...args} />,
};

export const Secondary: Story = {
  args: { color: "secondary", size: "lg" },
  render: (args) => <Spinner {...args} />,
};

export const OnDarkSurface: Story = {
  args: { color: "white", size: "xl" },
  render: (args) => (
    <div className="rounded-lg bg-inverse-surface p-6">
      <Spinner {...args} />
    </div>
  ),
};

export const Gray: Story = {
  args: { color: "gray", size: "sm" },
  render: (args) => <Spinner {...args} />,
};

export const Sizes: Story = {
  args: { color: "primary" },
  render: (args) => <SizeStack sizes={SPINNER_SIZES} render={(size) => <Spinner {...args} size={size} />} />,
};
