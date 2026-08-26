import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import { useEffect, type FC } from "react";
import { cn } from "../cn";
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
            "min-h-40 px-4 py-2.5 text-sm outline-none focus:outline-none",
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
    <div className={cn("overflow-hidden rounded-lg border bg-surface", borderOutlineVariant, className)}>
      <MarkdownEditorToolbar
        editor={editor}
        profile={profile}
        disabled={disabled}
        labels={labels}
        headingSelectId={`${id}-heading`}
      />
      <EditorContent editor={editor} className={cn(textareaBase, "rounded-none border-0 shadow-none focus:ring-0")} />
    </div>
  );
};

export default MarkdownWysiwyg;
