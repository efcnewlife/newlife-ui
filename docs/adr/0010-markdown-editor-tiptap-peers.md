# MarkdownEditor uses Tiptap as a peer dependency

MarkdownEditor’s Edit mode is true WYSIWYG (toolbar + document model), not a syntax-insert textarea. We chose **Tiptap** (ProseMirror) because it matches common design-system editor chrome, has a mature extension model for `legal` / `standard` schemas, and fits Markdown serialize/parse around a Markdown-string `value`. Alternatives (Lexical, Markdown-first shells, toolbar-on-textarea) were rejected for team fit, ecosystem, or failing the WYSIWYG requirement.

Tiptap and related editor packages are **`peerDependencies`**. Preview/sanitization packages for MarkdownPreview stay in **`dependencies`**, so hosts that only render Markdown need not install Tiptap. Portal (or any host using MarkdownEditor) must install the documented peer versions. Edit↔Source may normalize Markdown on round-trip; that is accepted in exchange for real WYSIWYG.
