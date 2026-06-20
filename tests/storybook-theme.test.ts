import { afterEach, describe, expect, it } from "vitest";
import { applyStorybookTheme, resolveStorybookTheme } from "../.storybook/apply-storybook-theme";

describe("applyStorybookTheme", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
    delete document.documentElement.dataset.storybookTheme;
  });

  it("applies light with no dark class", () => {
    applyStorybookTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.dataset.storybookTheme).toBe("light");
  });

  it("applies dark class", () => {
    applyStorybookTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.dataset.storybookTheme).toBe("dark");
  });

  it("falls back to light for unknown values", () => {
    expect(resolveStorybookTheme("unknown")).toBe("light");
  });
});
