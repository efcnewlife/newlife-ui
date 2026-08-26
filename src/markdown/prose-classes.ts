import { cn } from "../cn";
import { textOnSurface } from "../theme/role-classes";

/** Shared typography for MarkdownPreview and MarkdownEditor Edit surface. */
export const markdownProseClasses = cn(
  textOnSurface,
  "text-sm leading-relaxed",
  "[&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:leading-tight [&_h1]:first:mt-0",
  "[&_h2]:mb-2.5 [&_h2]:mt-3.5 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:first:mt-0",
  "[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:first:mt-0",
  "[&_h4]:mb-2 [&_h4]:mt-2.5 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:first:mt-0",
  "[&_h5]:mb-1.5 [&_h5]:mt-2 [&_h5]:text-sm [&_h5]:font-semibold [&_h5]:first:mt-0",
  "[&_h6]:mb-1.5 [&_h6]:mt-2 [&_h6]:text-sm [&_h6]:font-medium [&_h6]:text-on-surface-variant [&_h6]:first:mt-0",
  "[&_p]:mb-3 [&_p:last-child]:mb-0",
  "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li]:mb-1 [&_li_p]:mb-0",
  "[&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-outline-variant [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-on-surface-variant",
  "[&_blockquote_p]:mb-2 [&_blockquote_p:last-child]:mb-0",
  "[&_a]:text-primary [&_a]:underline",
  "[&_strong]:font-semibold",
  "[&_em]:italic",
  "[&_s]:line-through [&_del]:line-through",
  "[&_code]:rounded [&_code]:bg-surface-variant [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs",
  "[&_pre]:mb-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-surface-variant [&_pre]:p-3",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-xs",
  "[&_table]:mb-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left",
  "[&_th]:border [&_th]:border-outline-variant [&_th]:bg-surface-variant [&_th]:px-2 [&_th]:py-1.5 [&_th]:font-semibold",
  "[&_td]:border [&_td]:border-outline-variant [&_td]:px-2 [&_td]:py-1.5",
  "[&_hr]:my-4 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-outline-variant"
);
