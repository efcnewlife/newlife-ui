import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ComponentProps } from "react";
import MarkdownEditor from "./index";
import type { MarkdownEditorMode } from "./types";

const SAMPLE = `# Hello

Write **Markdown** with the editor.
`;

const meta: Meta<typeof MarkdownEditor> = {
  title: "Components/MarkdownEditor",
  component: MarkdownEditor,
  args: {
    id: "markdown-editor",
    label: "Body",
    profile: "legal",
    value: SAMPLE,
  },
};

export default meta;

type Story = StoryObj<typeof MarkdownEditor>;

const ControlledEditor = (args: ComponentProps<typeof MarkdownEditor>) => {
  const [value, set_value] = useState(args.value ?? "");
  const [mode, set_mode] = useState<MarkdownEditorMode>(args.mode ?? "edit");
  return <MarkdownEditor {...args} value={value} onChange={set_value} mode={mode} onModeChange={set_mode} />;
};

export const LegalEdit: Story = {
  render: (args) => <ControlledEditor {...args} profile="legal" />,
};

export const StandardEdit: Story = {
  args: { profile: "standard" },
  render: (args) => <ControlledEditor {...args} />,
};

export const SourceMode: Story = {
  args: { mode: "source" },
  render: (args) => <ControlledEditor {...args} />,
};

export const PreviewMode: Story = {
  args: { mode: "preview" },
  render: (args) => <ControlledEditor {...args} />,
};

export const WithError: Story = {
  args: { error: "Body is required" },
  render: (args) => <ControlledEditor {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <ControlledEditor {...args} />,
};

export const OnDark: Story = {
  globals: { colorTheme: "dark" },
  args: { profile: "standard" },
  render: (args) => <ControlledEditor {...args} />,
};
