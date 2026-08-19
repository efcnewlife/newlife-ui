import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CONTROL_SIZES, SizeStack } from "../../.storybook/size-stack";
import ComboBox, { type ComboBoxOption } from "./index";

const options: ComboBoxOption<string>[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular" },
];

const meta: Meta<typeof ComboBox> = {
  title: "Components/ComboBox",
  component: ComboBox,
  args: {
    id: "combobox-default",
    label: "Framework",
    options,
    placeholder: "Search framework",
  },
};

export default meta;

type Story = StoryObj<typeof ComboBox>;

export const Single: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <ComboBox<string>
        id={args.id}
        label={args.label}
        options={options}
        placeholder={args.placeholder}
        value={value}
        onChange={setValue}
        clearable
      />
    );
  },
};

export const Multiple: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <ComboBox<string>
        id={args.id}
        label={args.label}
        options={options}
        placeholder={args.placeholder}
        multiple
        value={value}
        onChange={(next) => setValue(next ?? [])}
      />
    );
  },
};

export const WithError: Story = {
  args: { error: "Selection required" },
  render: (args) => (
    <ComboBox<string> id={args.id} label={args.label} options={options} placeholder={args.placeholder} error={args.error} />
  ),
};

export const Loading: Story = {
  args: { loading: true },
  render: (args) => (
    <ComboBox<string> id={args.id} label={args.label} options={options} placeholder={args.placeholder} loading={args.loading} />
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <SizeStack
      sizes={CONTROL_SIZES}
      render={(size) => (
        <ComboBox<string>
          id={`combobox-${size}`}
          label={`Framework (${size})`}
          options={options}
          placeholder={args.placeholder}
          size={size}
        />
      )}
    />
  ),
};
