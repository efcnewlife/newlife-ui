import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import MarkdownPreview from "./index";

const SAMPLE_LEGAL = `# Terms

Hello **bold**, _italic_, ~~strike~~, and \`code\`.

- One
- Two

1. First
2. Second

> A quote

\`\`\`
fenced code
\`\`\`

[Link](https://example.com)
`;

const SAMPLE_STANDARD = `${SAMPLE_LEGAL}

| Col A | Col B |
| --- | --- |
| 1 | 2 |

---

After the rule.
`;

const meta: Meta<typeof MarkdownPreview> = {
  title: "Components/MarkdownPreview",
  component: MarkdownPreview,
  args: {
    profile: "legal",
    value: SAMPLE_LEGAL,
  },
};

export default meta;

type Story = StoryObj<typeof MarkdownPreview>;

export const Legal: Story = {
  args: { profile: "legal", value: SAMPLE_LEGAL },
};

export const Standard: Story = {
  args: { profile: "standard", value: SAMPLE_STANDARD },
};

export const Empty: Story = {
  args: { value: "" },
};

export const OnDark: Story = {
  globals: { colorTheme: "dark" },
  args: { profile: "standard", value: SAMPLE_STANDARD },
};

export const Interactive: Story = {
  render: (args) => {
    const [value, set_value] = useState(args.value);
    return (
      <div className="space-y-3">
        <textarea
          className="w-full rounded-lg border border-outline bg-surface p-2 text-sm text-on-surface"
          rows={8}
          value={value}
          onChange={(event) => set_value(event.target.value)}
        />
        <MarkdownPreview {...args} value={value} />
      </div>
    );
  },
};
