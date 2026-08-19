import type { Meta, StoryObj } from "@storybook/react";
import { BADGE_SIZES, SizeStack } from "../../.storybook/size-stack";
import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  args: {
    children: "Badge",
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const LightPrimary: Story = {
  args: { variant: "light", color: "primary" },
  render: (args) => <Badge {...args} />,
};

export const SolidSuccess: Story = {
  args: { variant: "solid", color: "success" },
  render: (args) => <Badge {...args} />,
};

export const LightError: Story = {
  args: { variant: "light", color: "error" },
  render: (args) => <Badge {...args} />,
};

export const SolidWarning: Story = {
  args: { variant: "solid", color: "warning" },
  render: (args) => <Badge {...args} />,
};

export const LightInfo: Story = {
  args: { variant: "light", color: "info" },
  render: (args) => <Badge {...args} />,
};

export const Small: Story = {
  args: { size: "sm", color: "dark", variant: "light" },
  render: (args) => <Badge {...args} />,
};

export const Sizes: Story = {
  args: { variant: "light", color: "primary" },
  render: (args) => <SizeStack sizes={BADGE_SIZES} render={(size) => <Badge {...args} size={size} />} />,
};
