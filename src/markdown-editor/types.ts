import type { MarkdownProfile } from "../markdown-preview";

export type MarkdownEditorMode = "edit" | "source" | "preview";

export interface MarkdownEditorLabels {
  modeEdit?: string;
  modeSource?: string;
  modePreview?: string;
  modeGroup?: string;
  toolbar?: string;
  editor?: string;
  heading?: string;
  paragraph?: string;
  heading1?: string;
  heading2?: string;
  heading3?: string;
  heading4?: string;
  heading5?: string;
  heading6?: string;
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
  toolbar: "Markdown formatting",
  editor: "Markdown rich text editor",
  heading: "Heading",
  paragraph: "Paragraph",
  heading1: "Heading 1",
  heading2: "Heading 2",
  heading3: "Heading 3",
  heading4: "Heading 4",
  heading5: "Heading 5",
  heading6: "Heading 6",
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
