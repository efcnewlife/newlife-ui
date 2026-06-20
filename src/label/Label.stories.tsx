import type { Meta, StoryObj } from "@storybook/react";
import Label from "./index";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  args: {
    children: "Field label",
    htmlFor: "field-id",
  },
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: (args) => <Label {...args} />,
};

export const CustomClass: Story = {
  args: { className: "text-error" },
  render: (args) => <Label {...args} />,
};
