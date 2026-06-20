import type { Meta, StoryObj } from "@storybook/react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./index";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Basic: Story = {
  render: (args) => (
    <Table {...args} className="border border-outline rounded-lg overflow-hidden">
      <TableHeader>
        <TableRow>
          <TableCell isHeader>Name</TableCell>
          <TableCell isHeader>Role</TableCell>
          <TableCell isHeader>Status</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Jane Doe</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>John Smith</TableCell>
          <TableCell>Editor</TableCell>
          <TableCell>Invited</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
