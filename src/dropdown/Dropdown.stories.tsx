import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Button from "../button";
import { Dropdown } from "./Dropdown";
import { DropdownItem } from "./DropdownItem";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="relative inline-block">
        <Button className="dropdown-toggle" onClick={() => setIsOpen((open) => !open)}>
          Menu
        </Button>
        <Dropdown {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-48 py-2">
          <DropdownItem onClick={() => setIsOpen(false)}>Profile</DropdownItem>
          <DropdownItem onClick={() => setIsOpen(false)}>Settings</DropdownItem>
          <DropdownItem onClick={() => setIsOpen(false)}>Sign out</DropdownItem>
        </Dropdown>
      </div>
    );
  },
};
