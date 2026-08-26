import type { Editor } from "@tiptap/react";
import type { FC } from "react";
import { cn } from "../cn";
import { borderOutlineVariant, buttonOutline, textMuted } from "../theme/role-classes";
import { DEFAULT_MARKDOWN_EDITOR_LABELS, type MarkdownEditorLabels, type MarkdownProfile } from "./types";

export interface MarkdownEditorToolbarProps {
  editor: Editor | null;
  profile: MarkdownProfile;
  disabled?: boolean;
  labels?: MarkdownEditorLabels;
  headingSelectId?: string;
}

const toolbar_button_class = cn(
  "inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium",
  buttonOutline,
  "disabled:cursor-not-allowed disabled:opacity-40"
);

const toolbar_active_class = "bg-primary-container text-on-primary-container ring-primary";

const MarkdownEditorToolbar: FC<MarkdownEditorToolbarProps> = ({
  editor,
  profile,
  disabled = false,
  labels = {},
  headingSelectId = "markdown-heading",
}) => {
  const resolved = { ...DEFAULT_MARKDOWN_EDITOR_LABELS, ...labels };
  const is_disabled = disabled || !editor;

  const run = (action: () => void) => {
    if (is_disabled || !editor) return;
    action();
  };

  const heading_level = editor?.isActive("heading", { level: 1 })
    ? "1"
    : editor?.isActive("heading", { level: 2 })
      ? "2"
      : editor?.isActive("heading", { level: 3 })
        ? "3"
        : editor?.isActive("heading", { level: 4 })
          ? "4"
          : editor?.isActive("heading", { level: 5 })
            ? "5"
            : editor?.isActive("heading", { level: 6 })
              ? "6"
              : "paragraph";

  return (
    <div
      className={cn("flex flex-wrap items-center gap-1 border-b px-2 py-1.5", borderOutlineVariant)}
      role="toolbar"
      aria-label="Markdown formatting"
    >
      <label className={cn("sr-only")} htmlFor={headingSelectId}>
        {resolved.heading}
      </label>
      <select
        id={headingSelectId}
        aria-label={resolved.heading}
        className={cn("rounded-md border bg-surface px-2 py-1 text-xs", borderOutlineVariant, textMuted)}
        disabled={is_disabled}
        value={heading_level}
        onChange={(event) => {
          const next = event.target.value;
          run(() => {
            if (next === "paragraph") {
              editor!.chain().focus().setParagraph().run();
              return;
            }
            editor!
              .chain()
              .focus()
              .toggleHeading({ level: Number(next) as 1 | 2 | 3 | 4 | 5 | 6 })
              .run();
          });
        }}
      >
        <option value="paragraph">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
        <option value="5">Heading 5</option>
        <option value="6">Heading 6</option>
      </select>

      <button
        type="button"
        aria-label={resolved.bold}
        aria-pressed={editor?.isActive("bold") ?? false}
        className={cn(toolbar_button_class, editor?.isActive("bold") && toolbar_active_class)}
        disabled={is_disabled}
        onClick={() => run(() => editor!.chain().focus().toggleBold().run())}
      >
        B
      </button>
      <button
        type="button"
        aria-label={resolved.italic}
        aria-pressed={editor?.isActive("italic") ?? false}
        className={cn(toolbar_button_class, editor?.isActive("italic") && toolbar_active_class)}
        disabled={is_disabled}
        onClick={() => run(() => editor!.chain().focus().toggleItalic().run())}
      >
        I
      </button>
      <button
        type="button"
        aria-label={resolved.strike}
        aria-pressed={editor?.isActive("strike") ?? false}
        className={cn(toolbar_button_class, editor?.isActive("strike") && toolbar_active_class)}
        disabled={is_disabled}
        onClick={() => run(() => editor!.chain().focus().toggleStrike().run())}
      >
        S
      </button>
      <button
        type="button"
        aria-label={resolved.link}
        aria-pressed={editor?.isActive("link") ?? false}
        className={cn(toolbar_button_class, editor?.isActive("link") && toolbar_active_class)}
        disabled={is_disabled}
        onClick={() =>
          run(() => {
            const previous = editor!.getAttributes("link").href as string | undefined;
            const url = window.prompt(resolved.linkPrompt, previous ?? "https://");
            if (url === null) return;
            if (url === "") {
              editor!.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          })
        }
      >
        Link
      </button>
      <button
        type="button"
        aria-label={resolved.unorderedList}
        aria-pressed={editor?.isActive("bulletList") ?? false}
        className={cn(toolbar_button_class, editor?.isActive("bulletList") && toolbar_active_class)}
        disabled={is_disabled}
        onClick={() => run(() => editor!.chain().focus().toggleBulletList().run())}
      >
        UL
      </button>
      <button
        type="button"
        aria-label={resolved.orderedList}
        aria-pressed={editor?.isActive("orderedList") ?? false}
        className={cn(toolbar_button_class, editor?.isActive("orderedList") && toolbar_active_class)}
        disabled={is_disabled}
        onClick={() => run(() => editor!.chain().focus().toggleOrderedList().run())}
      >
        OL
      </button>
      <button
        type="button"
        aria-label={resolved.blockquote}
        aria-pressed={editor?.isActive("blockquote") ?? false}
        className={cn(toolbar_button_class, editor?.isActive("blockquote") && toolbar_active_class)}
        disabled={is_disabled}
        onClick={() => run(() => editor!.chain().focus().toggleBlockquote().run())}
      >
        Quote
      </button>
      <button
        type="button"
        aria-label={resolved.code}
        aria-pressed={(editor?.isActive("code") || editor?.isActive("codeBlock")) ?? false}
        className={cn(
          toolbar_button_class,
          (editor?.isActive("code") || editor?.isActive("codeBlock")) && toolbar_active_class
        )}
        disabled={is_disabled}
        onClick={() =>
          run(() => {
            if (editor!.isActive("codeBlock")) {
              editor!.chain().focus().toggleCodeBlock().run();
              return;
            }
            editor!.chain().focus().toggleCode().run();
          })
        }
      >
        Code
      </button>

      {profile === "standard" && (
        <>
          <button
            type="button"
            aria-label={resolved.table}
            className={toolbar_button_class}
            disabled={is_disabled}
            onClick={() =>
              run(() => editor!.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())
            }
          >
            Table
          </button>
          <button
            type="button"
            aria-label={resolved.horizontalRule}
            className={toolbar_button_class}
            disabled={is_disabled}
            onClick={() => run(() => editor!.chain().focus().setHorizontalRule().run())}
          >
            HR
          </button>
        </>
      )}
    </div>
  );
};

export default MarkdownEditorToolbar;
