import type { Meta, StoryObj } from "@storybook/react";
import { MdAdd } from "react-icons/md";
import Button from "./index";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Button",
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary" },
  render: (args) => <Button {...args} />,
};

export const Outline: Story = {
  args: { variant: "outline" },
  render: (args) => <Button {...args} />,
};

export const Small: Story = {
  args: { size: "sm", variant: "primary" },
  render: (args) => <Button {...args} />,
};

export const Large: Story = {
  args: { size: "lg", variant: "primary" },
  render: (args) => <Button {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, variant: "primary" },
  render: (args) => <Button {...args} />,
};

export const WithIcon: Story = {
  args: {
    variant: "primary",
    startIcon: <MdAdd />,
    children: "Add item",
  },
  render: (args) => <Button {...args} />,
};
