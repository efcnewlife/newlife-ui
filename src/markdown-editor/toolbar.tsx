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

const toolbarButtonClass = cn(
  "inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium",
  buttonOutline,
  "disabled:cursor-not-allowed disabled:opacity-40"
);

const toolbarActiveClass = "bg-primary-container text-on-primary-container ring-primary";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

const activeHeadingLevel = (editor: Editor | null): string => {
  if (!editor) return "paragraph";
  for (const level of HEADING_LEVELS) {
    if (editor.isActive("heading", { level })) return String(level);
  }
  return "paragraph";
};

const MarkdownEditorToolbar: FC<MarkdownEditorToolbarProps> = ({
  editor,
  profile,
  disabled = false,
  labels = {},
  headingSelectId = "markdown-heading",
}) => {
  const resolved = { ...DEFAULT_MARKDOWN_EDITOR_LABELS, ...labels };
  const isDisabled = disabled || !editor;

  const runWhenEnabled = (action: () => void) => {
    if (isDisabled || !editor) return;
    action();
  };

  const headingLevel = activeHeadingLevel(editor);

  return (
    <div
      className={cn("flex flex-wrap items-center gap-1 border-b px-2 py-1.5", borderOutlineVariant)}
      role="toolbar"
      aria-label={resolved.toolbar}
    >
      <label className={cn("sr-only")} htmlFor={headingSelectId}>
        {resolved.heading}
      </label>
      <select
        id={headingSelectId}
        aria-label={resolved.heading}
        className={cn("rounded-md border bg-surface px-2 py-1 text-xs", borderOutlineVariant, textMuted)}
        disabled={isDisabled}
        value={headingLevel}
        onChange={(event) => {
          const next = event.target.value;
          runWhenEnabled(() => {
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
        <option value="paragraph">{resolved.paragraph}</option>
        <option value="1">{resolved.heading1}</option>
        <option value="2">{resolved.heading2}</option>
        <option value="3">{resolved.heading3}</option>
        <option value="4">{resolved.heading4}</option>
        <option value="5">{resolved.heading5}</option>
        <option value="6">{resolved.heading6}</option>
      </select>

      <button
        type="button"
        aria-label={resolved.bold}
        aria-pressed={editor?.isActive("bold") ?? false}
        className={cn(toolbarButtonClass, editor?.isActive("bold") && toolbarActiveClass)}
        disabled={isDisabled}
        onClick={() => runWhenEnabled(() => editor!.chain().focus().toggleBold().run())}
      >
        B
      </button>
      <button
        type="button"
        aria-label={resolved.italic}
        aria-pressed={editor?.isActive("italic") ?? false}
        className={cn(toolbarButtonClass, editor?.isActive("italic") && toolbarActiveClass)}
        disabled={isDisabled}
        onClick={() => runWhenEnabled(() => editor!.chain().focus().toggleItalic().run())}
      >
        I
      </button>
      <button
        type="button"
        aria-label={resolved.strike}
        aria-pressed={editor?.isActive("strike") ?? false}
        className={cn(toolbarButtonClass, editor?.isActive("strike") && toolbarActiveClass)}
        disabled={isDisabled}
        onClick={() => runWhenEnabled(() => editor!.chain().focus().toggleStrike().run())}
      >
        S
      </button>
      <button
        type="button"
        aria-label={resolved.link}
        aria-pressed={editor?.isActive("link") ?? false}
        className={cn(toolbarButtonClass, editor?.isActive("link") && toolbarActiveClass)}
        disabled={isDisabled}
        onClick={() =>
          runWhenEnabled(() => {
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
        className={cn(toolbarButtonClass, editor?.isActive("bulletList") && toolbarActiveClass)}
        disabled={isDisabled}
        onClick={() => runWhenEnabled(() => editor!.chain().focus().toggleBulletList().run())}
      >
        UL
      </button>
      <button
        type="button"
        aria-label={resolved.orderedList}
        aria-pressed={editor?.isActive("orderedList") ?? false}
        className={cn(toolbarButtonClass, editor?.isActive("orderedList") && toolbarActiveClass)}
        disabled={isDisabled}
        onClick={() => runWhenEnabled(() => editor!.chain().focus().toggleOrderedList().run())}
      >
        OL
      </button>
      <button
        type="button"
        aria-label={resolved.blockquote}
        aria-pressed={editor?.isActive("blockquote") ?? false}
        className={cn(toolbarButtonClass, editor?.isActive("blockquote") && toolbarActiveClass)}
        disabled={isDisabled}
        onClick={() => runWhenEnabled(() => editor!.chain().focus().toggleBlockquote().run())}
      >
        Quote
      </button>
      <button
        type="button"
        aria-label={resolved.code}
        aria-pressed={(editor?.isActive("code") || editor?.isActive("codeBlock")) ?? false}
        className={cn(
          toolbarButtonClass,
          (editor?.isActive("code") || editor?.isActive("codeBlock")) && toolbarActiveClass
        )}
        disabled={isDisabled}
        onClick={() =>
          runWhenEnabled(() => {
            if (editor!.isActive("codeBlock") || editor!.state.selection.empty) {
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
            className={toolbarButtonClass}
            disabled={isDisabled}
            onClick={() =>
              runWhenEnabled(() => editor!.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())
            }
          >
            Table
          </button>
          <button
            type="button"
            aria-label={resolved.horizontalRule}
            className={toolbarButtonClass}
            disabled={isDisabled}
            onClick={() => runWhenEnabled(() => editor!.chain().focus().setHorizontalRule().run())}
          >
            HR
          </button>
        </>
      )}
    </div>
  );
};

export default MarkdownEditorToolbar;
