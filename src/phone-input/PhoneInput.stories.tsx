import type { Meta, StoryObj } from "@storybook/react";
import { CONTROL_SIZES, SizeStack } from "../../.storybook/size-stack";
import PhoneInput from "./index";

const countries = [
  { name: "USA", code: "+1" },
  { name: "CAN", code: "+1" },
  { name: "MEX", code: "+52" },
  { name: "PER", code: "+51" },
  { name: "ARG", code: "+54" },
  { name: "BRA", code: "+55" },
  { name: "CHL", code: "+56" },
  { name: "COL", code: "+57" },
  { name: "VEN", code: "+58" },
  { name: "NLD", code: "+31" },
  { name: "ESP", code: "+34" },
  { name: "ITA", code: "+39" },
  { name: "AUT", code: "+43" },
  { name: "SWE", code: "+46" },
  { name: "POL", code: "+48" },
  { name: "FRA", code: "+33" },
  { name: "GBR", code: "+44" },
  { name: "DEU", code: "+49" },
  { name: "MYS", code: "+60" },
  { name: "IDN", code: "+62" },
  { name: "PHL", code: "+63" },
  { name: "THA", code: "+66" },
  { name: "SGP", code: "+65" },
  { name: "JPN", code: "+81" },
  { name: "VNM", code: "+84" },
  { name: "KOR", code: "+82" },
  { name: "IND", code: "+91" },
  { name: "LKA", code: "+94" },
  { name: "CHN", code: "+86" },
  { name: "HKG", code: "+852" },
  { name: "TWN", code: "+886" },
  { name: "BGD", code: "+880" },
];

const meta: Meta<typeof PhoneInput> = {
  title: "Components/PhoneInput",
  component: PhoneInput,
  args: {
    countries,
    label: "Phone number",
  },
};

export default meta;

type Story = StoryObj<typeof PhoneInput>;

export const Default: Story = {
  render: (args) => <PhoneInput {...args} />,
};

export const WithError: Story = {
  args: { error: "Invalid phone number", required: true },
  render: (args) => <PhoneInput {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, value: "5551234567" },
  render: (args) => <PhoneInput {...args} />,
};

export const SelectAtEnd: Story = {
  args: { selectPosition: "end" },
  render: (args) => <PhoneInput {...args} />,
};

export const Sizes: Story = {
  render: (args) => (
    <SizeStack
      sizes={CONTROL_SIZES}
      render={(size) => <PhoneInput {...args} id={`phone-${size}`} label={`Phone number (${size})`} size={size} />}
    />
  ),
};
