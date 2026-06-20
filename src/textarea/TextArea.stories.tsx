import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import TextArea from "./index";

const meta: Meta<typeof TextArea> = {
  title: "Components/TextArea",
  component: TextArea,
  args: {
    id: "textarea-default",
    label: "Message",
  },
};

export default meta;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  render: (args) => <TextArea {...args} />,
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return <TextArea {...args} value={value} onChange={setValue} />;
  },
};

export const WithError: Story = {
  args: { error: "Message is required" },
  render: (args) => <TextArea {...args} />,
};

export const Success: Story = {
  args: { success: true, hint: "Saved locally" },
  render: (args) => <TextArea {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, value: "Read only content" },
  render: (args) => <TextArea {...args} />,
};
