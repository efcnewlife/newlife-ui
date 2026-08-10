import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import Alert from "../../src/alert/Alert";
import Badge from "../../src/badge/Badge";
import Button from "../../src/button";
import ButtonGroup from "../../src/buttons-group";
import Checkbox from "../../src/checkbox";
import ComboBox from "../../src/combobox";
import DatePicker from "../../src/date-picker";
import DateTimePicker from "../../src/date-time-picker";
import { Dropdown } from "../../src/dropdown/Dropdown";
import { DropdownItem } from "../../src/dropdown/DropdownItem";
import FileInput from "../../src/file-input";
import Input from "../../src/input";
import Label from "../../src/label";
import { Modal } from "../../src/modal";
import { ModalForm } from "../../src/modal/modal-form";
import Notification from "../../src/notification/Notification";
import PhoneInput from "../../src/phone-input";
import Popover from "../../src/popover";
import ProgressBar from "../../src/progress/ProgressBar";
import Slider from "../../src/slider";
import Radio from "../../src/radio";
import { Select } from "../../src/select/Select";
import Spinner from "../../src/spinner";
import Switch from "../../src/switch";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../src/table";
import Tabs from "../../src/tabs";
import TextArea from "../../src/textarea";
import TimePicker from "../../src/time-picker";
import Tooltip from "../../src/tooltip";
import { PopoverPosition } from "../../src/types/enums";

describe("component smoke renders", () => {
  it("renders action and form components", () => {
    render(
      <>
        <Button>Action</Button>
        <ButtonGroup buttons={[{ text: "One", active: true }, { text: "Two" }]} />
        <Label htmlFor="name">Name</Label>
        <Input id="name" label="Name" />
        <TextArea id="message" label="Message" />
        <Checkbox label="Checked" checked onChange={() => undefined} id="checked" />
        <Radio id="r1" name="group" value="a" label="A" checked onChange={() => undefined} />
        <Switch label="Switch" />
        <Slider defaultValue={[50]} aria-label="Volume" />
        <FileInput />
        <PhoneInput countries={[{ name: "US", code: "+1" }]} />
        <TimePicker id="time" label="Time" />
        <DatePicker id="date" label="Date" />
        <DateTimePicker id="datetime" label="Date time" />
        <Select id="select" options={[{ value: "a", label: "A" }]} />
        <ComboBox id="combo" options={[{ value: "a", label: "A" }]} />
        <Tabs tabs={[{ value: "a", label: "A" }]} value="a" onChange={() => undefined} />
      </>
    );
  });

  it("renders feedback and overlay components", () => {
    render(
      <>
        <Spinner />
        <ProgressBar progress={40} />
        <Badge>Badge</Badge>
        <Alert variant="info" title="Title" message="Message" />
        <Notification variant="success" title="Toast" />
        <Tooltip content="Tip">
          <span>Hover</span>
        </Tooltip>
        <Popover title="Title" trigger={<button type="button">Open</button>} position={PopoverPosition.Bottom}>
          <div>Body</div>
        </Popover>
        <div className="relative">
          <Dropdown isOpen onClose={() => undefined}>
            <DropdownItem>Item</DropdownItem>
          </Dropdown>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>H</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>C</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>
    );
  });

  it("renders closed modal shells without crashing", () => {
    render(
      <>
        <Modal isOpen={false} onClose={() => undefined}>
          Hidden
        </Modal>
        <ModalForm isOpen={false} onClose={() => undefined}>
          Hidden form
        </ModalForm>
      </>
    );
  });
});
