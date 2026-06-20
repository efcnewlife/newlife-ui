import type { Meta, StoryObj } from "@storybook/react";
import Button from "../button";
import Tooltip from "./index";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  args: {
    content: "Tooltip content",
    children: <Button>Hover me</Button>,
  },
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Bottom: Story = {
  args: { placement: "bottom" },
  render: (args) => <Tooltip {...args} />,
};

export const Top: Story = {
  args: { placement: "top" },
  render: (args) => <Tooltip {...args} />,
};

export const Left: Story = {
  args: { placement: "left" },
  render: (args) => <Tooltip {...args} />,
};

export const Right: Story = {
  args: { placement: "right" },
  render: (args) => <Tooltip {...args} />,
};

export const DarkTheme: Story = {
  args: { theme: "dark" },
  render: (args) => <Tooltip {...args} />,
};

export const LightTheme: Story = {
  args: { theme: "light" },
  render: (args) => <Tooltip {...args} />,
};
