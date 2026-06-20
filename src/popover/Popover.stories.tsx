import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Button from "../button";
import { PopoverPosition } from "../types/enums";
import Popover from "./index";

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
  args: {
    title: "Filters",
    trigger: <Button variant="outline">Open popover</Button>,
    children: (
      <div className="p-4 text-sm text-on-surface">
        Popover body content goes here.
      </div>
    ),
  },
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Bottom: Story = {
  args: { position: PopoverPosition.Bottom },
  render: (args) => <Popover {...args} />,
};

export const BottomRight: Story = {
  args: { position: PopoverPosition.BottomRight },
  render: (args) => <Popover {...args} />,
};

export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return <Popover {...args} open={open} onOpenChange={setOpen} />;
  },
};
