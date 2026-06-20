import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Checkbox from "./index";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    label: "Accept terms",
    checked: false,
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  render: (args) => <Checkbox {...args} />,
};

export const Checked: Story = {
  args: { checked: true },
  render: (args) => <Checkbox {...args} />,
};

export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
  },
};

export const WithTooltip: Story = {
  args: {
    tooltip: true,
    label: "Hover for tooltip",
    checked: true,
  },
  render: (args) => <Checkbox {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, checked: true },
  render: (args) => <Checkbox {...args} />,
};
