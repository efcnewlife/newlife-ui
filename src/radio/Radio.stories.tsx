import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Radio from "./index";

const meta: Meta<typeof Radio> = {
  title: "Components/Radio",
  component: Radio,
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const Group: Story = {
  render: () => {
    const [selected, setSelected] = useState("a");
    return (
      <div className="flex flex-col gap-3">
        <Radio id="radio-a" name="demo" value="a" label="Option A" checked={selected === "a"} onChange={setSelected} />
        <Radio id="radio-b" name="demo" value="b" label="Option B" checked={selected === "b"} onChange={setSelected} />
        <Radio
          id="radio-c"
          name="demo"
          value="c"
          label="Option C (disabled)"
          checked={selected === "c"}
          onChange={setSelected}
          disabled
        />
      </div>
    );
  },
};
