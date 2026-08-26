import { useState, type FC } from "react";
import { cn } from "../cn";
import FormField from "../form-field";
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
  mode: controlledMode,
  onModeChange,
  className,
  wrapperClassName,
  labelClassName,
  labels = {},
  placeholder,
}) => {
  const resolvedLabels = { ...DEFAULT_MARKDOWN_EDITOR_LABELS, ...labels };
  const [uncontrolledMode, setUncontrolledMode] = useState<MarkdownEditorMode>("edit");
  const mode = controlledMode ?? uncontrolledMode;

  const setMode = (next: MarkdownEditorMode) => {
    if (controlledMode === undefined) {
      setUncontrolledMode(next);
    }
    onModeChange?.(next);
  };

  const modeLabels: Record<MarkdownEditorMode, string> = {
    edit: resolvedLabels.modeEdit,
    source: resolvedLabels.modeSource,
    preview: resolvedLabels.modePreview,
  };

  let sourceClassName = cn(textareaBase, "min-h-40 font-mono", className);
  if (disabled) {
    sourceClassName = cn(sourceClassName, textareaDisabled);
  } else if (error) {
    sourceClassName = cn(sourceClassName, textareaError);
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
          aria-label={resolvedLabels.modeGroup}
          className={cn("-mb-px flex flex-wrap gap-x-1 border-b", borderOutlineVariant)}
        >
          {MODE_ORDER.map((item) => {
            const isActive = mode === item;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                id={`${id}-mode-${item}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                disabled={disabled && item !== "preview"}
                className={cn(
                  "inline-flex items-center border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? tabActive : tabInactive,
                  disabled && item !== "preview" && "cursor-not-allowed opacity-50"
                )}
                onClick={() => setMode(item)}
              >
                {modeLabels[item]}
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
            className={sourceClassName}
            rows={10}
            onChange={(event) => onChange?.(event.target.value)}
          />
        )}

        {mode === "preview" && (
          <div className={cn("min-h-40 rounded-lg border px-4 py-2.5", borderOutlineVariant, className)}>
            <MarkdownPreview value={value} profile={profile} />
          </div>
        )}
      </div>
    </FormField>
  );
};

export default MarkdownEditor;
