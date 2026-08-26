# Markdown value, profiles, and editor/preview surfaces

We need shared Markdown authoring and read-only display for Newlife hosts (Portal admin later; Facility Booking public legal pages). The public value contract is a **Markdown string** (not HTML or editor JSON), matching Core API Legal Document bodies.

We ship two library products: **MarkdownEditor** (FormField-shaped; modes `edit` | `source` | `preview`) and **MarkdownPreview** (read-only; composed by the editor’s Preview mode). v1 Markdown profiles are **`legal`** (default: headings h1–h6, emphasis, strike, links, lists, blockquote, code; no tables/images/HTML/underline) and **`standard`** (`legal` plus GFM tables and thematic breaks). Source may hold any string; WYSIWYG only introduces profile-allowed constructs; Preview never executes raw HTML.

MarkdownPreview uses a **lightweight** Markdown render pipeline (not the WYSIWYG engine) so member-facing hosts are not forced to load the editor stack. Profile rules stay aligned across both surfaces.
