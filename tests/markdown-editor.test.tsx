import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type FC } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import MarkdownEditor from "../src/markdown-editor";

beforeAll(() => {
  if (!document.elementFromPoint) {
    document.elementFromPoint = () => screen.queryByLabelText("Markdown rich text editor");
  }
});

const ControlledSourceEditor: FC<{ onChange?: (value: string) => void }> = ({ onChange }) => {
  const [value, setValue] = useState("");
  return (
    <MarkdownEditor
      id="body"
      mode="source"
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
};

const ControlledEditEditor: FC<{
  initial: string;
  onChange?: (value: string) => void;
  profile?: "legal" | "standard";
}> = ({ initial, onChange, profile = "legal" }) => {
  const [value, setValue] = useState(initial);
  return (
    <MarkdownEditor
      id="body"
      value={value}
      profile={profile}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
};

const insertTableFromPicker = async (user: ReturnType<typeof userEvent.setup>, rows: number, cols: number) => {
  await user.click(screen.getByRole("button", { name: "Table" }));
  await user.click(screen.getByRole("gridcell", { name: `${rows} × ${cols}` }));
};

describe("MarkdownEditor", () => {
  it("renders FormField chrome for label, error, and hint", () => {
    render(<MarkdownEditor id="body" label="Body" error="Required" hint="Use Markdown" value="" />);
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.queryByText("Use Markdown")).not.toBeInTheDocument();
  });

  it("defaults to edit mode and exposes a three-way mode segment", () => {
    render(<MarkdownEditor id="body" label="Body" value="Hello" />);
    expect(screen.getByRole("tab", { name: "Edit" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Source" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Preview" })).toHaveAttribute("aria-selected", "false");
  });

  it("supports controlled mode and onModeChange", async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();
    const { rerender } = render(<MarkdownEditor id="body" value="Hello" mode="edit" onModeChange={onModeChange} />);

    await user.click(screen.getByRole("tab", { name: "Source" }));
    expect(onModeChange).toHaveBeenCalledWith("source");

    rerender(<MarkdownEditor id="body" value="Hello" mode="source" onModeChange={onModeChange} />);
    expect(screen.getByRole("tab", { name: "Source" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("textbox")).toHaveValue("Hello");
  });

  it("emits onChange with a Markdown string from Source mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledSourceEditor onChange={onChange} />);

    await user.type(screen.getByRole("textbox"), "Hi");
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)?.[0]).toBe("Hi");
  });

  it("Preview mode composes MarkdownPreview rendering", async () => {
    const user = userEvent.setup();
    render(<MarkdownEditor id="body" value="Hello **world**" />);
    await user.click(screen.getByRole("tab", { name: "Preview" }));
    expect(screen.getByText("world").tagName).toBe("STRONG");
  });

  it("disables Source editing when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MarkdownEditor id="body" value="Hello" mode="source" disabled onChange={onChange} />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    await user.type(screen.getByRole("textbox"), "x");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies bold from the Edit toolbar into the Markdown string", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledEditEditor initial="Hello" onChange={onChange} />);

    const editor = await screen.findByLabelText("Markdown rich text editor");
    editor.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    selection?.removeAllRanges();
    selection?.addRange(range);
    await user.click(screen.getByRole("button", { name: "Bold" }));

    await waitFor(() => {
      const markdown = String(onChange.mock.calls.at(-1)?.[0] ?? "");
      expect(markdown).toMatch(/\*\*Hello\*\*|__Hello__/);
    });
  });

  it("renders heading and blockquote as rich blocks in Edit mode", async () => {
    render(<MarkdownEditor id="body" value={"# Title\n\n> Quoted line"} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
    });
    expect(screen.getByText("Quoted line").closest("blockquote")).not.toBeNull();
  });

  it("shows table and horizontal rule toolbar actions only for standard profile", async () => {
    const { rerender } = render(<MarkdownEditor id="body" value="" profile="legal" />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: "Table" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Horizontal rule" })).toBeNull();

    rerender(<MarkdownEditor id="body" value="" profile="standard" />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Table" })).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "Horizontal rule" })).toBeInTheDocument();
  });

  it("shows compact toolbar tooltips above the editor content layer", async () => {
    const user = userEvent.setup();
    const { container } = render(<MarkdownEditor id="body" value="Hello" />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    });

    const toolbar = container.querySelector('[role="toolbar"]');
    expect(toolbar).toHaveClass("z-10");

    await user.hover(screen.getByRole("button", { name: "Bold" }));

    const tooltip = screen.getByRole("tooltip", { name: "Bold" });
    expect(toolbar).toContainElement(tooltip);
    expect(tooltip).toHaveClass("z-50");
  });

  it("shows table editing controls in Edit mode when the cursor is inside a table", async () => {
    const user = userEvent.setup();

    render(<MarkdownEditor id="body" value="" profile="standard" />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Table" })).toBeInTheDocument();
    });

    expect(screen.queryByRole("button", { name: "Add row below" })).toBeNull();

    await insertTableFromPicker(user, 3, 3);

    await waitFor(() => {
      expect(document.querySelector("table")).not.toBeNull();
      expect(screen.getByRole("button", { name: "Add row below" })).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Add column right" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete table" })).toBeInTheDocument();
  });

  it("adds a table row from the Edit toolbar without using Source mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ControlledEditEditor initial="" onChange={onChange} profile="standard" />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Table" })).toBeInTheDocument();
    });

    await insertTableFromPicker(user, 3, 3);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Add row below" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Add row below" }));

    await waitFor(() => {
      expect(document.querySelectorAll("tr").length).toBe(4);
    });

    await waitFor(() => {
      const markdown = String(onChange.mock.calls.at(-1)?.[0] ?? "");
      expect(markdown).toContain("|");
    });
  });

  it("inserts a table with the size selected from the picker grid", async () => {
    const user = userEvent.setup();

    render(<MarkdownEditor id="body" value="" profile="standard" />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Table" })).toBeInTheDocument();
    });

    await insertTableFromPicker(user, 2, 4);

    await waitFor(() => {
      expect(document.querySelectorAll("tr").length).toBe(2);
      expect(document.querySelectorAll("tr")[0]?.querySelectorAll("th, td").length).toBe(4);
    });
  });
});
