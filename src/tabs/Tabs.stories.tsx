import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Tabs from "./index";

const tabs = [
  { value: "general", label: "General" },
  { value: "security", label: "Security" },
  { value: "billing", label: "Billing" },
];

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    tabs,
    label: "Settings section",
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("general");
    return <Tabs {...args} value={value} onChange={setValue} />;
  },
};
