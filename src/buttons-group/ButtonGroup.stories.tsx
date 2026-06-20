import type { Meta, StoryObj } from "@storybook/react";
import { MdGridView, MdViewList } from "react-icons/md";
import ButtonGroup from "./index";

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Primary: Story = {
  args: {
    variant: "primary",
    buttons: [
      { text: "List", icon: <MdViewList />, active: true },
      { text: "Grid", icon: <MdGridView /> },
    ],
  },
  render: (args) => <ButtonGroup {...args} />,
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    buttons: [
      { text: "Day", active: true },
      { text: "Week" },
      { text: "Month", disabled: true },
    ],
  },
  render: (args) => <ButtonGroup {...args} />,
};
