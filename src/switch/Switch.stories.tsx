import type { Meta, StoryObj } from "@storybook/react";
import Switch from "./index";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  args: {
    label: "Enable notifications",
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Primary: Story = {
  args: { color: "primary", defaultChecked: true },
  render: (args) => <Switch {...args} />,
};

export const Neutral: Story = {
  args: { color: "neutral", defaultChecked: true },
  render: (args) => <Switch {...args} />,
};

export const DeprecatedBlueAlias: Story = {
  args: { color: "blue", defaultChecked: true, label: "Deprecated blue alias" },
  render: (args) => <Switch {...args} />,
};

export const DeprecatedGrayAlias: Story = {
  args: { color: "gray", defaultChecked: false, label: "Deprecated gray alias" },
  render: (args) => <Switch {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
  render: (args) => <Switch {...args} />,
};
