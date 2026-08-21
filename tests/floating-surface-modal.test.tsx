import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import Button from "../src/button";
import DateTimePicker from "../src/date-time-picker";
import { dayjs } from "../src/lib/dayjs";
import { Modal } from "../src/modal";
import { Select } from "../src/select";
import Tooltip from "../src/tooltip";

function ModalWithSelect({ onClose }: { onClose: () => void }) {
  const [value, setValue] = useState<string | number | null>(null);

  return (
    <Modal isOpen onClose={onClose} title="Create booking" className="p-4 max-w-lg" footer={<Button>Save</Button>}>
      <div className="space-y-24 pb-8">
        <p>Spacer so the select sits near the footer.</p>
        <Select
          id="room"
          label="Room"
          value={value}
          onChange={(next) => setValue(Array.isArray(next) ? (next[0] ?? null) : next)}
          options={[
            { value: "a", label: "Room A" },
            { value: "b", label: "Room B" },
            { value: "c", label: "Room C" },
          ]}
        />
      </div>
    </Modal>
  );
}

describe("Floating surface inside Modal with footer", () => {
  it("portals the Select listbox outside the modal scroll body so the footer cannot clip it", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { container } = render(<ModalWithSelect onClose={onClose} />);

    await user.click(screen.getByRole("combobox"));

    const listbox = screen.getByRole("listbox");
    expect(listbox.closest("[data-floating-surface]")!.parentElement).toBe(document.body);

    const scrollBody = container.querySelector(".overflow-y-auto");
    expect(scrollBody).not.toBeNull();
    expect(scrollBody!.contains(listbox)).toBe(false);

    const footer = screen.getByRole("button", { name: "Save" }).parentElement;
    expect(footer).not.toBeNull();
    expect(footer!.contains(listbox)).toBe(false);
  });

  it("closes the Select Floating surface on Escape without closing the Modal", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ModalWithSelect onClose={onClose} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Create booking" })).toBeInTheDocument();
  });

  it("closes the Select Floating surface on outside press without closing the Modal", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ModalWithSelect onClose={onClose} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Create booking" })).toBeInTheDocument();
  });

  it("portals the DateTimePicker Floating surface outside the modal scroll body", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Modal isOpen onClose={() => undefined} title="Schedule" className="p-4 max-w-lg" footer={<Button>Save</Button>}>
        <DateTimePicker id="starts-at" label="Starts at" value={dayjs.utc("2026-06-20T15:30:00.000Z")} timezone="UTC" />
      </Modal>
    );

    await user.click(screen.getByRole("button", { name: /open calendar/i }));

    const hours = screen.getByRole("listbox", { name: /hours/i });
    expect(hours.closest("[data-floating-surface]")).not.toBeNull();
    expect(hours.closest("[data-floating-surface]")!.parentElement).toBe(document.body);

    const scrollBody = container.querySelector(".overflow-y-auto");
    expect(scrollBody!.contains(hours)).toBe(false);
  });

  it("portals the Tooltip bubble outside the modal scroll body on hover", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Modal isOpen onClose={() => undefined} title="Help" className="p-4 max-w-lg" footer={<Button>Save</Button>}>
        <Tooltip content="Room capacity help" enterDelay={0} leaveDelay={0}>
          <button type="button">Capacity</button>
        </Tooltip>
      </Modal>
    );

    await user.hover(screen.getByRole("button", { name: "Capacity" }));

    const bubble = await screen.findByText("Room capacity help");
    expect(bubble.closest("[data-floating-surface]")!.parentElement).toBe(document.body);

    const scrollBody = container.querySelector(".overflow-y-auto");
    expect(scrollBody!.contains(bubble)).toBe(false);
  });

  // Scroll/resize repositioning is wired in FloatingSurface (document scroll capture + window resize).
  // jsdom does not provide meaningful layout geometry for a regression assertion here.
});
