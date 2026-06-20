import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FormField from "../src/form-field";

describe("FormField", () => {
  it("renders label linked to control id", () => {
    render(
      <FormField id="email" label="Email">
        <input id="email" type="text" />
      </FormField>
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders error and suppresses hint when error is present", () => {
    render(
      <FormField id="email" label="Email" error="Required" hint="Optional hint">
        <input id="email" type="text" />
      </FormField>
    );
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.queryByText("Optional hint")).not.toBeInTheDocument();
  });

  it("renders hint when no error", () => {
    render(
      <FormField id="email" hint="Optional hint">
        <input id="email" type="text" />
      </FormField>
    );
    expect(screen.getByText("Optional hint")).toBeInTheDocument();
  });

  it("applies wrapperClassName on root element", () => {
    const { container } = render(
      <FormField id="email" wrapperClassName="field-root">
        <input id="email" type="text" />
      </FormField>
    );
    expect(container.firstChild).toHaveClass("field-root");
  });

  it("renders a single root DOM node", () => {
    const { container } = render(
      <FormField id="email" label="Email" error="Invalid">
        <input id="email" type="text" />
      </FormField>
    );
    expect(container.childNodes).toHaveLength(1);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });
});
