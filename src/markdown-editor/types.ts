import type { MarkdownProfile } from "../markdown-preview";

export type MarkdownEditorMode = "edit" | "source" | "preview";

export interface MarkdownEditorLabels {
  modeEdit?: string;
  modeSource?: string;
  modePreview?: string;
  modeGroup?: string;
  heading?: string;
  bold?: string;
  italic?: string;
  strike?: string;
  link?: string;
  orderedList?: string;
  unorderedList?: string;
  blockquote?: string;
  code?: string;
  table?: string;
  horizontalRule?: string;
  linkPrompt?: string;
}

export const DEFAULT_MARKDOWN_EDITOR_LABELS: Required<MarkdownEditorLabels> = {
  modeEdit: "Edit",
  modeSource: "Source",
  modePreview: "Preview",
  modeGroup: "Markdown editor mode",
  heading: "Heading",
  bold: "Bold",
  italic: "Italic",
  strike: "Strike",
  link: "Link",
  orderedList: "Ordered list",
  unorderedList: "Unordered list",
  blockquote: "Blockquote",
  code: "Code",
  table: "Table",
  horizontalRule: "Horizontal rule",
  linkPrompt: "Enter link URL",
};

export type { MarkdownProfile };
