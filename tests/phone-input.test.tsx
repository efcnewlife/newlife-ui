import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PhoneInput from "../src/phone-input";

const countries = [{ name: "TWN", code: "+886" }];

describe("PhoneInput", () => {
  it("defaults Control size to md on the number field", () => {
    render(<PhoneInput id="phone" label="Phone" countries={countries} />);
    expect(document.getElementById("phone")).toHaveClass("h-11", "text-sm", "px-4");
  });

  it("applies xs Control size on the number field", () => {
    render(<PhoneInput id="phone-xs" label="Phone" countries={countries} size="xs" />);
    expect(document.getElementById("phone-xs")).toHaveClass("h-8", "text-xs", "px-2.5");
  });

  it("does not pad the country select with competing vertical padding", () => {
    const { container } = render(<PhoneInput id="phone-select" countries={countries} />);
    const countrySelect = container.querySelector("select");
    expect(countrySelect).not.toHaveClass("py-3");
  });

  it("forwards labelClassName to the FormField label", () => {
    render(<PhoneInput id="phone-label" label="Phone" countries={countries} labelClassName="text-on-primary" />);
    expect(screen.getByText("Phone")).toHaveClass("text-on-primary");
  });
});
