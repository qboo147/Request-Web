/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Claim } from "@lib/schemas/claim.schema";

interface data {
  claimState: Claim[];
  checkedItems: {
    [key: number]: boolean;
  };
}

function TableChecked(pros: data) {
  return (
    <div>
      {" "}
      <Table style={{ marginTop: 10 }}>
        <TableHeader>
          <TableRow>
            {/* đã sửa table head cho gọn lại cho ko đủ chỗ, có thể linh hoạt sửa theo figma nếu muốn */}

            <TableHead>ID</TableHead>
            <TableHead>Staff Name</TableHead>
            <TableHead>Project Name</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
  {pros.claimState
    .filter((item: Claim) => {
      if (typeof item.id === 'string') {
        // Use type assertion to assure TypeScript that item.id is a string
        return item.id in pros.checkedItems &&
               pros.checkedItems[item.id as unknown as keyof typeof pros.checkedItems];
      } else {
        console.error("Invalid or missing claim ID:", item.id);
        return false;
      }
    })
    .map((item: Claim) => (
      <TableRow key={item.id}>
        <TableCell>{item.id}</TableCell>
        <TableCell>{item.staff.name}</TableCell>
        <TableCell>{item.project.name}</TableCell>
      </TableRow>
    ))}
</TableBody>


      </Table>
    </div>
  );
}

export default TableChecked;
