import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Input from "./index";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  args: {
    id: "input-default",
    label: "Email",
    placeholder: "Enter email",
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { size: "md" },
  render: (args) => <Input {...args} />,
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <Input
        {...args}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        clearable
      />
    );
  },
};

export const WithError: Story = {
  args: {
    error: "Invalid email address",
    value: "bad@",
  },
  render: (args) => <Input {...args} />,
};

export const Success: Story = {
  args: {
    success: true,
    value: "valid@example.com",
    hint: "Looks good",
  },
  render: (args) => <Input {...args} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Disabled value",
  },
  render: (args) => <Input {...args} />,
};

export const Required: Story = {
  args: { required: true },
  render: (args) => <Input {...args} />,
};

export const ControlSizeXs: Story = {
  args: {
    id: "input-xs",
    size: "xs",
    label: "Compact email",
  },
  render: (args) => <Input {...args} />,
};
