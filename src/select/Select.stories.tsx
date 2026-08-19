import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Select } from "./Select";

const options = [
  { value: "en", label: "English" },
  { value: "zh-TW", label: "Traditional Chinese" },
  { value: "zh-CN", label: "Simplified Chinese" },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  args: {
    id: "select-locale",
    label: "Locale",
    options,
    placeholder: "Choose locale",
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: { size: "md" },
  render: (args) => <Select {...args} />,
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <Select
        {...args}
        value={value}
        onChange={(next) => setValue(next as string | number | null)}
        clearable
        searchable
      />
    );
  },
};

export const Multiple: Story = {
  render: (args) => {
    const [value, setValue] = useState<(string | number | null)[]>([]);
    return (
      <Select
        {...args}
        multiple
        value={value}
        onChange={(next) => setValue((next as (string | number | null)[]) ?? [])}
        searchable
      />
    );
  },
};

export const WithError: Story = {
  args: { error: "Selection required" },
  render: (args) => <Select {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, value: "en" },
  render: (args) => <Select {...args} />,
};

export const GhostVariant: Story = {
  args: { variant: "ghost", value: "en" },
  render: (args) => <Select {...args} />,
};

export const ControlSizeXs: Story = {
  args: { size: "xs", value: "en" },
  render: (args) => <Select {...args} />,
};

export const OpenWithSelection: Story = {
  args: { value: "zh-TW", searchable: true },
  render: (args) => (
    <div className="w-full max-w-sm">
      <Select {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Open the dropdown to verify option hover, focus, and selected colors.",
      },
    },
  },
};
