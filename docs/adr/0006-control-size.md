# Control size is a field-shell density ladder, not Button size

Single-line form controls share **Control size**: `xs` / `sm` / `md` (default) / `lg`, mapped to Tailwind height tokens `h-8` / `h-9` / `h-11` / `h-12`. Density (height, horizontal padding, type size) lives on that step. `fieldShell` / `fieldBase` keep color, border, and focus only. This is not Button size (padding and type, no fixed height) and not the Tailwind font-size scale (`base`, `xl`, `2xl`).

We rejected keeping `sm`/`md`/`lg` visually stuck at the accidental `h-11` that `fieldShell` used to overwrite; `size="sm"` must actually be `h-9`. We rejected renaming default to `base` (would break the existing `md` default and Button naming). We rejected shrinking Floating surfaces or labels with Control size. FileInput, TextArea, and Button restyle are out of this decision.

## Consequences

- Hosts that already pass `size="sm"` (for example locale Select) get a 36px shell instead of 44px.
- Input and PhoneInput join the same ladder as Select, ComboBox, date/time Fields, and Pickers. Default `md` keeps today's 44px forms.
- Compact toolbars use `xs` (`h-8`); they do not express density by stacking `className="h-8"` on every control.
