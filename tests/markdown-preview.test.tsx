import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MarkdownPreview from "../src/markdown-preview";

describe("MarkdownPreview", () => {
  it("renders emphasis for the legal profile", () => {
    render(<MarkdownPreview value="Hello **world**" />);
    expect(screen.getByText("world").tagName).toBe("STRONG");
  });

  it("does not execute raw HTML", () => {
    render(<MarkdownPreview value={"Before <script>window.__md_xss=1</script> after"} />);
    expect(document.querySelector("script")).toBeNull();
    expect(screen.getByText(/Before/)).toBeInTheDocument();
    expect((window as unknown as { __md_xss?: number }).__md_xss).toBeUndefined();
  });

  it("does not richly render tables under the legal profile", () => {
    const table_md = "| A | B |\n| --- | --- |\n| 1 | 2 |";
    render(<MarkdownPreview value={table_md} profile="legal" />);
    expect(document.querySelector("table")).toBeNull();
  });

  it("renders GFM tables under the standard profile", () => {
    const table_md = "| A | B |\n| --- | --- |\n| 1 | 2 |";
    render(<MarkdownPreview value={table_md} profile="standard" />);
    expect(document.querySelector("table")).not.toBeNull();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders thematic breaks under the standard profile only", () => {
    const { rerender } = render(<MarkdownPreview value={"Above\n\n---\n\nBelow"} profile="legal" />);
    expect(document.querySelector("hr")).toBeNull();

    rerender(<MarkdownPreview value={"Above\n\n---\n\nBelow"} profile="standard" />);
    expect(document.querySelector("hr")).not.toBeNull();
  });
});
