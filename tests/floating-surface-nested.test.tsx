import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Dropdown } from "../src/dropdown/Dropdown";
import { Select } from "../src/select";

function DropdownWithSelect({ onDropdownClose }: { onDropdownClose: () => void }) {
  const [isOpen, setIsOpen] = useState(true);
  const [value, setValue] = useState<string | number | null>("zh-TW");

  return (
    <div>
      <button className="dropdown-toggle" type="button">
        User
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          onDropdownClose();
        }}
      >
        <Select
          id="user-language"
          value={value}
          onChange={(next) => setValue(Array.isArray(next) ? (next[0] ?? null) : next)}
          options={[
            { value: "en", label: "English" },
            { value: "zh-TW", label: "Traditional Chinese" },
          ]}
        />
      </Dropdown>
    </div>
  );
}

describe("Select nested inside Dropdown", () => {
  it("applies the selected option without dismissing the parent Dropdown", async () => {
    const user = userEvent.setup();
    const onDropdownClose = vi.fn();

    render(<DropdownWithSelect onDropdownClose={onDropdownClose} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "English" }));

    expect(onDropdownClose).not.toHaveBeenCalled();
    expect(screen.getByRole("combobox")).toHaveTextContent("English");
  });

  it("closes the Select surface on outside press without closing the Dropdown", async () => {
    const user = userEvent.setup();
    const onDropdownClose = vi.fn();

    render(<DropdownWithSelect onDropdownClose={onDropdownClose} />);

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "User" }));

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onDropdownClose).not.toHaveBeenCalled();
  });
});
