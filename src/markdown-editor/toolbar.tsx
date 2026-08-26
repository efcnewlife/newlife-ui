import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import type { FC, ReactNode } from "react";
import {
  MdCode,
  MdDeleteOutline,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatStrikethrough,
  MdHorizontalRule,
  MdLink,
  MdRemoveCircleOutline,
  MdTableRows,
  MdViewColumn,
  MdViewWeek,
} from "react-icons/md";
import { cn } from "../cn";
import { accentPrimaryContainer, borderOutlineVariant, textOnSurface } from "../theme/role-classes";
import TableInsertPicker from "./table-insert-picker";
import { DEFAULT_MARKDOWN_EDITOR_LABELS, type MarkdownEditorLabels, type MarkdownProfile } from "./types";

export interface MarkdownEditorToolbarProps {
  editor: Editor | null;
  profile: MarkdownProfile;
  disabled?: boolean;
  labels?: MarkdownEditorLabels;
  headingSelectId?: string;
}

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

const activeHeadingLevel = (editor: Editor | null): string => {
  if (!editor) return "paragraph";
  for (const level of HEADING_LEVELS) {
    if (editor.isActive("heading", { level })) return String(level);
  }
  return "paragraph";
};

interface ToolbarIconButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

const ToolbarIconButton: FC<ToolbarIconButtonProps> = ({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}) => {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group/icon relative inline-flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/30",
        "disabled:cursor-not-allowed disabled:opacity-40",
        active ? accentPrimaryContainer : cn(textOnSurface, "hover:bg-surface-variant")
      )}
    >
      <span className="flex size-4 items-center justify-center [&_svg]:size-4" aria-hidden>
        {children}
      </span>
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2",
          "opacity-0 transition-opacity duration-150",
          "group-hover/icon:opacity-100 group-focus-visible/icon:opacity-100"
        )}
      >
        <span className="relative block">
          <span
            className={cn(
              "block whitespace-nowrap rounded-md bg-inverse-surface px-2 py-0.5",
              "text-[11px] font-medium leading-snug text-inverse-on-surface shadow-lg"
            )}
          >
            {label}
          </span>
          <span
            aria-hidden
            className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-inverse-surface"
          />
        </span>
      </span>
    </button>
  );
};

const ToolbarDivider: FC = () => (
  <span className="mx-0.5 h-5 w-px shrink-0 self-center bg-outline-variant" aria-hidden />
);

const ToolbarGroup: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-0.5">{children}</div>
);

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
  const isInTable = useEditorState({
    editor,
    selector: ({ editor: current }) => current?.isActive("table") ?? false,
  });

  return (
    <div
      className={cn(
        "relative z-10 flex flex-wrap items-center gap-y-1 overflow-visible border-b bg-surface-container px-2 py-1.5",
        borderOutlineVariant
      )}
      role="toolbar"
      aria-label={resolved.toolbar}
    >
      <ToolbarGroup>
        <label className="sr-only" htmlFor={headingSelectId}>
          {resolved.heading}
        </label>
        <select
          id={headingSelectId}
          aria-label={resolved.heading}
          className={cn(
            "h-8 min-w-28 rounded-md border bg-surface px-2 text-xs font-medium",
            borderOutlineVariant,
            textOnSurface,
            "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/30",
            "disabled:cursor-not-allowed disabled:opacity-40"
          )}
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
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <ToolbarIconButton
          label={resolved.bold}
          active={editor?.isActive("bold") ?? false}
          disabled={isDisabled}
          onClick={() => runWhenEnabled(() => editor!.chain().focus().toggleBold().run())}
        >
          <MdFormatBold />
        </ToolbarIconButton>
        <ToolbarIconButton
          label={resolved.italic}
          active={editor?.isActive("italic") ?? false}
          disabled={isDisabled}
          onClick={() => runWhenEnabled(() => editor!.chain().focus().toggleItalic().run())}
        >
          <MdFormatItalic />
        </ToolbarIconButton>
        <ToolbarIconButton
          label={resolved.strike}
          active={editor?.isActive("strike") ?? false}
          disabled={isDisabled}
          onClick={() => runWhenEnabled(() => editor!.chain().focus().toggleStrike().run())}
        >
          <MdFormatStrikethrough />
        </ToolbarIconButton>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <ToolbarIconButton
          label={resolved.link}
          active={editor?.isActive("link") ?? false}
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
          <MdLink />
        </ToolbarIconButton>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <ToolbarIconButton
          label={resolved.unorderedList}
          active={editor?.isActive("bulletList") ?? false}
          disabled={isDisabled}
          onClick={() => runWhenEnabled(() => editor!.chain().focus().toggleBulletList().run())}
        >
          <MdFormatListBulleted />
        </ToolbarIconButton>
        <ToolbarIconButton
          label={resolved.orderedList}
          active={editor?.isActive("orderedList") ?? false}
          disabled={isDisabled}
          onClick={() => runWhenEnabled(() => editor!.chain().focus().toggleOrderedList().run())}
        >
          <MdFormatListNumbered />
        </ToolbarIconButton>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <ToolbarIconButton
          label={resolved.blockquote}
          active={editor?.isActive("blockquote") ?? false}
          disabled={isDisabled}
          onClick={() => runWhenEnabled(() => editor!.chain().focus().toggleBlockquote().run())}
        >
          <MdFormatQuote />
        </ToolbarIconButton>
        <ToolbarIconButton
          label={resolved.code}
          active={(editor?.isActive("code") || editor?.isActive("codeBlock")) ?? false}
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
          <MdCode />
        </ToolbarIconButton>
      </ToolbarGroup>

      {profile === "standard" && (
        <>
          <ToolbarDivider />
          <ToolbarGroup>
            <TableInsertPicker
              label={resolved.table}
              insertTitle={resolved.tableInsertTitle}
              disabled={isDisabled}
              onInsert={(rows, cols) =>
                runWhenEnabled(() => editor!.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run())
              }
            />
            <ToolbarIconButton
              label={resolved.horizontalRule}
              disabled={isDisabled}
              onClick={() => runWhenEnabled(() => editor!.chain().focus().setHorizontalRule().run())}
            >
              <MdHorizontalRule />
            </ToolbarIconButton>
          </ToolbarGroup>

          {isInTable && (
            <>
              <ToolbarDivider />
              <ToolbarGroup>
                <ToolbarIconButton
                  label={resolved.tableAddRowBelow}
                  disabled={isDisabled}
                  onClick={() => runWhenEnabled(() => editor!.chain().focus().addRowAfter().run())}
                >
                  <MdTableRows />
                </ToolbarIconButton>
                <ToolbarIconButton
                  label={resolved.tableAddColumnRight}
                  disabled={isDisabled}
                  onClick={() => runWhenEnabled(() => editor!.chain().focus().addColumnAfter().run())}
                >
                  <MdViewColumn />
                </ToolbarIconButton>
                <ToolbarIconButton
                  label={resolved.tableDeleteRow}
                  disabled={isDisabled}
                  onClick={() => runWhenEnabled(() => editor!.chain().focus().deleteRow().run())}
                >
                  <MdRemoveCircleOutline />
                </ToolbarIconButton>
                <ToolbarIconButton
                  label={resolved.tableDeleteColumn}
                  disabled={isDisabled}
                  onClick={() => runWhenEnabled(() => editor!.chain().focus().deleteColumn().run())}
                >
                  <MdViewWeek />
                </ToolbarIconButton>
                <ToolbarIconButton
                  label={resolved.tableDelete}
                  disabled={isDisabled}
                  onClick={() => runWhenEnabled(() => editor!.chain().focus().deleteTable().run())}
                >
                  <MdDeleteOutline />
                </ToolbarIconButton>
              </ToolbarGroup>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MarkdownEditorToolbar;
