import type { Meta, StoryObj } from "@storybook/react";
import FileInput from "./index";

const meta: Meta<typeof FileInput> = {
  title: "Components/FileInput",
  component: FileInput,
};

export default meta;

type Story = StoryObj<typeof FileInput>;

export const Default: Story = {
  render: (args) => <FileInput {...args} />,
};

export const WithHandler: Story = {
  args: {
    onChange: () => undefined,
  },
  render: (args) => <FileInput {...args} />,
};
