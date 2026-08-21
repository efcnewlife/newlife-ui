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
    const { container } = render(<Input id="email-wrapper" wrapperClassName="field-root" className="input-custom" />);
    expect(container.firstChild).toHaveClass("field-root");
    expect(document.getElementById("email-wrapper")).toHaveClass("input-custom");
  });

  it("defaults Control size to md height", () => {
    render(<Input id="email-md" label="Email" />);
    expect(document.getElementById("email-md")).toHaveClass("h-11", "text-sm", "px-4");
    expect(document.getElementById("email-md")).not.toHaveClass("h-8");
  });

  it("applies compact xs Control size on the input, not the label", () => {
    render(<Input id="email-xs" label="Email" size="xs" />);
    expect(document.getElementById("email-xs")).toHaveClass("h-8", "text-xs", "px-2.5");
    expect(screen.getByText("Email")).not.toHaveClass("h-8");
  });

  it("lets host className override Control size height", () => {
    render(<Input id="email-override" className="h-10" size="xs" />);
    expect(document.getElementById("email-override")).toHaveClass("h-10");
    expect(document.getElementById("email-override")).not.toHaveClass("h-8");
  });

  it("forwards labelClassName to the FormField label", () => {
    render(<Input id="email-label" label="Email" labelClassName="text-on-primary" />);
    expect(screen.getByText("Email")).toHaveClass("text-on-primary");
  });
});
