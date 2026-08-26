import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type FC } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import MarkdownEditor from "../src/markdown-editor";

beforeAll(() => {
  if (!document.elementFromPoint) {
    document.elementFromPoint = () => document.querySelector(".ProseMirror");
  }
});

const ControlledSourceEditor: FC<{ onChange?: (value: string) => void }> = ({ onChange }) => {
  const [value, set_value] = useState("");
  return (
    <MarkdownEditor
      id="body"
      mode="source"
      value={value}
      onChange={(next) => {
        set_value(next);
        onChange?.(next);
      }}
    />
  );
};

const ControlledEditEditor: FC<{ initial: string; onChange?: (value: string) => void }> = ({ initial, onChange }) => {
  const [value, set_value] = useState(initial);
  return (
    <MarkdownEditor
      id="body"
      value={value}
      onChange={(next) => {
        set_value(next);
        onChange?.(next);
      }}
    />
  );
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
    const on_mode_change = vi.fn();
    const { rerender } = render(<MarkdownEditor id="body" value="Hello" mode="edit" onModeChange={on_mode_change} />);

    await user.click(screen.getByRole("tab", { name: "Source" }));
    expect(on_mode_change).toHaveBeenCalledWith("source");

    rerender(<MarkdownEditor id="body" value="Hello" mode="source" onModeChange={on_mode_change} />);
    expect(screen.getByRole("tab", { name: "Source" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("textbox")).toHaveValue("Hello");
  });

  it("emits onChange with a Markdown string from Source mode", async () => {
    const user = userEvent.setup();
    const on_change = vi.fn();
    render(<ControlledSourceEditor onChange={on_change} />);

    await user.type(screen.getByRole("textbox"), "Hi");
    expect(on_change).toHaveBeenCalled();
    expect(on_change.mock.calls.at(-1)?.[0]).toBe("Hi");
  });

  it("Preview mode composes MarkdownPreview rendering", async () => {
    const user = userEvent.setup();
    render(<MarkdownEditor id="body" value="Hello **world**" />);
    await user.click(screen.getByRole("tab", { name: "Preview" }));
    expect(screen.getByText("world").tagName).toBe("STRONG");
  });

  it("disables Source editing and toolbar actions when disabled", async () => {
    const user = userEvent.setup();
    const on_change = vi.fn();
    render(<MarkdownEditor id="body" value="Hello" mode="source" disabled onChange={on_change} />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    await user.type(screen.getByRole("textbox"), "x");
    expect(on_change).not.toHaveBeenCalled();
  });

  it("applies bold from the Edit toolbar into the Markdown string", async () => {
    const user = userEvent.setup();
    const on_change = vi.fn();
    render(<ControlledEditEditor initial="Hello" onChange={on_change} />);

    await waitFor(() => {
      expect(document.querySelector(".ProseMirror")).not.toBeNull();
    });

    const editor = document.querySelector(".ProseMirror") as HTMLElement;
    editor.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    selection?.removeAllRanges();
    selection?.addRange(range);
    await user.click(screen.getByRole("button", { name: "Bold" }));

    await waitFor(() => {
      const markdown = String(on_change.mock.calls.at(-1)?.[0] ?? "");
      expect(markdown).toMatch(/\*\*Hello\*\*|__Hello__/);
    });
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
});
