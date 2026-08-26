import type { FC } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { cn } from "../cn";
import { markdownProseClasses } from "../markdown/prose-classes";

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

const MarkdownPreview: FC<MarkdownPreviewProps> = ({ value, profile = "legal", className }) => {
  const sanitizeSchema = buildSanitizeSchema(profile);

  return (
    <div className={cn(markdownProseClasses, className)} data-markdown-profile={profile}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}>
        {value}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
