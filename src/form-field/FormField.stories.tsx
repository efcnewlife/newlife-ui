import type { Meta, StoryObj } from "@storybook/react";
import FormField from "./index";
import { CONTROL_SIZE_CLASSES, fieldBase } from "../theme/role-classes";
import { cn } from "../cn";

const meta: Meta<typeof FormField> = {
  title: "Components/FormField",
  component: FormField,
  args: {
    id: "form-field-demo",
    label: "Field label",
  },
};

export default meta;

type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: (args) => (
    <FormField {...args}>
      <input id={args.id} type="text" placeholder="Control slot" className={cn(fieldBase, CONTROL_SIZE_CLASSES.md)} />
    </FormField>
  ),
};

export const WithError: Story = {
  args: {
    error: "This field is required",
  },
  render: (args) => (
    <FormField {...args}>
      <input id={args.id} type="text" className={cn(fieldBase, CONTROL_SIZE_CLASSES.md)} />
    </FormField>
  ),
};

export const WithHint: Story = {
  args: {
    hint: "Optional helper text",
  },
  render: (args) => (
    <FormField {...args}>
      <input id={args.id} type="text" className={cn(fieldBase, CONTROL_SIZE_CLASSES.md)} />
    </FormField>
  ),
};

export const WithWrapperClassName: Story = {
  args: {
    wrapperClassName: "space-y-1.5 rounded-lg border border-outline-variant p-4",
    required: true,
  },
  render: (args) => (
    <FormField {...args}>
      <input id={args.id} type="text" placeholder="Wrapped field" className={cn(fieldBase, CONTROL_SIZE_CLASSES.md)} />
    </FormField>
  ),
};
