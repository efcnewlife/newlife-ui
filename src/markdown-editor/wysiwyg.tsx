import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import { useEffect, type FC } from "react";
import { cn } from "../cn";
import { markdownProseClasses } from "../markdown/prose-classes";
import { borderOutlineVariant, textareaBase } from "../theme/role-classes";
import { buildEditorExtensions } from "./extensions";
import MarkdownEditorToolbar from "./toolbar";
import { DEFAULT_MARKDOWN_EDITOR_LABELS, type MarkdownEditorLabels, type MarkdownProfile } from "./types";

export interface MarkdownWysiwygProps {
  value: string;
  onChange?: (markdown: string) => void;
  profile: MarkdownProfile;
  disabled?: boolean;
  id: string;
  className?: string;
  labels?: MarkdownEditorLabels;
  placeholder?: string;
}

const getMarkdown = (editor: Editor): string => {
  const storage = editor.storage as { markdown?: { getMarkdown?: () => string } };
  return storage.markdown?.getMarkdown?.() ?? "";
};

const MarkdownWysiwyg: FC<MarkdownWysiwygProps> = ({
  value,
  onChange,
  profile,
  disabled = false,
  id,
  className,
  labels = {},
  placeholder = "Write Markdown...",
}) => {
  const resolved = { ...DEFAULT_MARKDOWN_EDITOR_LABELS, ...labels };
  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: buildEditorExtensions(profile, placeholder),
      content: value,
      editable: !disabled,
      editorProps: {
        attributes: {
          id,
          class: cn(
            "min-h-40 px-4 py-3 outline-none focus:outline-none",
            markdownProseClasses,
            "[&_.is-empty::before]:pointer-events-none",
            "[&_.is-empty::before]:float-left",
            "[&_.is-empty::before]:h-0",
            "[&_.is-empty::before]:text-on-surface-variant",
            "[&_.is-empty::before]:content-[attr(data-placeholder)]",
            disabled && "cursor-not-allowed opacity-50"
          ),
          "aria-label": resolved.editor,
        },
      },
      onUpdate: ({ editor: current }) => {
        onChange?.(getMarkdown(current));
      },
    },
    [profile]
  );

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) return;
    const current = getMarkdown(editor);
    if (current === value) return;
    editor.commands.setContent(value);
  }, [editor, value]);

  return (
    <div className={cn("rounded-lg border bg-surface", borderOutlineVariant, className)}>
      <MarkdownEditorToolbar
        editor={editor}
        profile={profile}
        disabled={disabled}
        labels={labels}
        headingSelectId={`${id}-heading`}
      />
      <div className="relative z-0 rounded-b-lg">
        <EditorContent editor={editor} className={cn(textareaBase, "rounded-none border-0 shadow-none focus:ring-0")} />
      </div>
    </div>
  );
};

export default MarkdownWysiwyg;
