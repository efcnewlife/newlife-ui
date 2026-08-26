import { useState, type FC } from "react";
import FormField from "../form-field";
import { cn } from "../cn";
import MarkdownPreview from "../markdown-preview";
import {
  borderOutlineVariant,
  tabActive,
  tabInactive,
  textareaBase,
  textareaDisabled,
  textareaError,
} from "../theme/role-classes";
import {
  DEFAULT_MARKDOWN_EDITOR_LABELS,
  type MarkdownEditorLabels,
  type MarkdownEditorMode,
  type MarkdownProfile,
} from "./types";
import MarkdownWysiwyg from "./wysiwyg";

export type { MarkdownEditorLabels, MarkdownEditorMode, MarkdownProfile };

export interface MarkdownEditorProps {
  id: string;
  value: string;
  onChange?: (markdown: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  profile?: MarkdownProfile;
  mode?: MarkdownEditorMode;
  onModeChange?: (mode: MarkdownEditorMode) => void;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  labels?: MarkdownEditorLabels;
  placeholder?: string;
}

const MODE_ORDER: MarkdownEditorMode[] = ["edit", "source", "preview"];

const MarkdownEditor: FC<MarkdownEditorProps> = ({
  id,
  value,
  onChange,
  label,
  error,
  hint,
  required = false,
  disabled = false,
  profile = "legal",
  mode: controlled_mode,
  onModeChange,
  className,
  wrapperClassName,
  labelClassName,
  labels = {},
  placeholder,
}) => {
  const resolved_labels = { ...DEFAULT_MARKDOWN_EDITOR_LABELS, ...labels };
  const [uncontrolled_mode, set_uncontrolled_mode] = useState<MarkdownEditorMode>("edit");
  const mode = controlled_mode ?? uncontrolled_mode;

  const set_mode = (next: MarkdownEditorMode) => {
    if (controlled_mode === undefined) {
      set_uncontrolled_mode(next);
    }
    onModeChange?.(next);
  };

  const mode_labels: Record<MarkdownEditorMode, string> = {
    edit: resolved_labels.modeEdit,
    source: resolved_labels.modeSource,
    preview: resolved_labels.modePreview,
  };

  let source_class_name = cn(textareaBase, "min-h-40 font-mono", className);
  if (disabled) {
    source_class_name = cn(source_class_name, textareaDisabled);
  } else if (error) {
    source_class_name = cn(source_class_name, textareaError);
  }

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      hint={hint}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
    >
      <div className="space-y-2">
        <nav
          role="tablist"
          aria-label={resolved_labels.modeGroup}
          className={cn("-mb-px flex flex-wrap gap-x-1 border-b", borderOutlineVariant)}
        >
          {MODE_ORDER.map((item) => {
            const is_active = mode === item;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                id={`${id}-mode-${item}`}
                aria-selected={is_active}
                tabIndex={is_active ? 0 : -1}
                disabled={disabled && item !== "preview"}
                className={cn(
                  "inline-flex items-center border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                  is_active ? tabActive : tabInactive,
                  disabled && item !== "preview" && "cursor-not-allowed opacity-50"
                )}
                onClick={() => set_mode(item)}
              >
                {mode_labels[item]}
              </button>
            );
          })}
        </nav>

        {mode === "edit" && (
          <MarkdownWysiwyg
            id={id}
            value={value}
            onChange={onChange}
            profile={profile}
            disabled={disabled}
            className={className}
            labels={labels}
            placeholder={placeholder}
          />
        )}

        {mode === "source" && (
          <textarea
            id={id}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            className={source_class_name}
            rows={10}
            onChange={(event) => onChange?.(event.target.value)}
          />
        )}

        {mode === "preview" && (
          <div
            className={cn("min-h-40 rounded-lg border px-4 py-2.5", borderOutlineVariant, className)}
            data-testid={`${id}-preview`}
          >
            <MarkdownPreview value={value} profile={profile} />
          </div>
        )}
      </div>
    </FormField>
  );
};

export default MarkdownEditor;
