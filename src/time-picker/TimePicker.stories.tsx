import type { Meta, StoryObj } from "@storybook/react";
import TimePicker from "./index";

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
  args: {
    id: "time-picker-default",
    label: "Start time",
  },
};

export default meta;

type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  render: (args) => <TimePicker {...args} />,
};

export const WithError: Story = {
  args: { error: "Time is required", required: true },
  render: (args) => <TimePicker {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, value: "09:30" },
  render: (args) => <TimePicker {...args} />,
};
