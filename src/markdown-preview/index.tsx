import type { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { cn } from "../cn";
import { textOnSurface } from "../theme/role-classes";

export type MarkdownProfile = "legal" | "standard";

export interface MarkdownPreviewProps {
  value: string;
  profile?: MarkdownProfile;
  className?: string;
}

const LEGAL_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "strong",
  "em",
  "del",
  "a",
  "ul",
  "ol",
  "li",
  "blockquote",
  "code",
  "pre",
  "br",
] as const;

const STANDARD_TAGS = [...LEGAL_TAGS, "table", "thead", "tbody", "tr", "th", "td", "hr"] as const;

const buildSanitizeSchema = (profile: MarkdownProfile) => {
  const tagNames = profile === "standard" ? [...STANDARD_TAGS] : [...LEGAL_TAGS];
  return {
    ...defaultSchema,
    tagNames,
    attributes: {
      ...defaultSchema.attributes,
      a: [...(defaultSchema.attributes?.a ?? []), "target", "rel"],
      code: [...(defaultSchema.attributes?.code ?? []), "className"],
    },
  };
};

const previewProseClasses = cn(
  textOnSurface,
  "text-sm leading-relaxed",
  "[&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-semibold",
  "[&_h2]:mb-2.5 [&_h2]:text-xl [&_h2]:font-semibold",
  "[&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold",
  "[&_h4]:mb-2 [&_h4]:text-base [&_h4]:font-semibold",
  "[&_h5]:mb-1.5 [&_h5]:text-sm [&_h5]:font-semibold",
  "[&_h6]:mb-1.5 [&_h6]:text-sm [&_h6]:font-medium",
  "[&_p]:mb-3 [&_p:last-child]:mb-0",
  "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li]:mb-1",
  "[&_blockquote]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-outline-variant [&_blockquote]:pl-3 [&_blockquote]:text-on-surface-variant",
  "[&_a]:text-primary [&_a]:underline",
  "[&_code]:rounded [&_code]:bg-surface-variant [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs",
  "[&_pre]:mb-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-surface-variant [&_pre]:p-3",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_table]:mb-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left",
  "[&_th]:border [&_th]:border-outline-variant [&_th]:bg-surface-variant [&_th]:px-2 [&_th]:py-1.5",
  "[&_td]:border [&_td]:border-outline-variant [&_td]:px-2 [&_td]:py-1.5",
  "[&_hr]:my-4 [&_hr]:border-outline-variant",
  "[&_del]:line-through"
);

const MarkdownPreview: FC<MarkdownPreviewProps> = ({ value, profile = "legal", className }) => {
  const sanitizeSchema = buildSanitizeSchema(profile);

  return (
    <div className={cn(previewProseClasses, className)} data-markdown-profile={profile}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}>
        {value}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
