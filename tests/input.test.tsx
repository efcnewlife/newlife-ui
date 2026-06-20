import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Input from "../src/input";

describe("Input", () => {
  it("renders error message", () => {
    render(<Input id="email" label="Email" error="Invalid email" />);
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("applies error border classes", () => {
    render(<Input id="email-error" error="Required" />);
    expect(document.getElementById("email-error")).toHaveClass("border-error");
  });

  it("applies success border classes", () => {
    render(<Input id="email-success" success value="ok@example.com" />);
    expect(document.getElementById("email-success")).toHaveClass("border-success");
  });

  it("applies wrapperClassName on outer field wrapper", () => {
    const { container } = render(
      <Input id="email-wrapper" wrapperClassName="field-root" className="input-custom" />
    );
    expect(container.firstChild).toHaveClass("field-root");
    expect(document.getElementById("email-wrapper")).toHaveClass("input-custom");
  });
});
