import { describe, expect, it } from "vitest";
import { formatCalendarDateInput } from "../src/picker/datetime";
import { formatTimeInput } from "../src/picker/time";

describe("formatCalendarDateInput", () => {
  it("inserts dashes for a valid digit stream", () => {
    expect(formatCalendarDateInput("20201224")).toBe("2020-12-24");
  });

  it("restarts month when digits would exceed 12 (14 -> 04)", () => {
    expect(formatCalendarDateInput("202014")).toBe("2020-04");
    expect(formatCalendarDateInput("20201415")).toBe("2020-04-15");
  });

  it("restarts day when digits would exceed 31 (34 -> 04)", () => {
    expect(formatCalendarDateInput("20201234")).toBe("2020-12-04");
  });

  it("completes month early when the first digit cannot start a valid pair", () => {
    expect(formatCalendarDateInput("20203")).toBe("2020-03");
    expect(formatCalendarDateInput("2020315")).toBe("2020-03-15");
  });
});

describe("formatTimeInput", () => {
  it("inserts colons for a valid digit stream", () => {
    expect(formatTimeInput("0945")).toBe("09:45");
  });

  it("restarts hour when digits would exceed 23 (25 -> 05)", () => {
    expect(formatTimeInput("25")).toBe("05");
    expect(formatTimeInput("2530")).toBe("05:30");
  });

  it("restarts hour when 24 would exceed 23 (24 -> 04)", () => {
    expect(formatTimeInput("24")).toBe("04");
    expect(formatTimeInput("2459")).toBe("04:59");
  });

  it("completes minute early when the first digit cannot start a valid pair", () => {
    expect(formatTimeInput("096")).toBe("09:06");
    expect(formatTimeInput("09630")).toBe("09:06");
  });
});
