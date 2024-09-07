import { Link, useLocation } from "react-router-dom";
import { Claim } from "@/lib/schemas/claim.schema";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { IoCalendarOutline, IoReturnDownBackSharp } from "react-icons/io5";
import withAuthorization from "@/lib/utils/withAuthorization";

const ApprovalDetail = () => {
  const location = useLocation();
  const { claim } = location.state as { claim: Claim };

  if (!claim) {
    return <div>No claim data available</div>;
  }
  const downloadExcel = async (claim: Claim) => {
    const projectDuration = `${claim.project.from} - ${claim.project.to}`;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Claim Details");

    // Define styles with correct properties
    const headerStyle: Partial<ExcelJS.Style> = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1d4d74" }, // Blue color
      },
      font: { color: { argb: "FFFFFF" }, bold: true }, // White text color
      alignment: { horizontal: "center", vertical: "middle" },
      border: {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      },
    };

    const rightAlignStyle: Partial<ExcelJS.Style> = {
      alignment: { horizontal: "right", vertical: "middle" },
    };

    const rowStyle: Partial<ExcelJS.Style> = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "fff3cd" }, // Yellow color
      },
      font: { color: { argb: "000000" }, bold: true }, // Black color
      alignment: { horizontal: "right", vertical: "middle" },
      border: {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      },
    };

    worksheet.addRow([
      `CLAIM REQUEST FOR ${new Date(claim.created_at).toLocaleDateString(
        "en-GB",
        { month: "2-digit", year: "numeric" }
      )}`,
    ]);
    worksheet.addRow([]);

    // Add header row with style
    const headerRow = worksheet.addRow([
      "Claim ID",
      "Staff Name",
      "Project Name",
      "Project Duration",
      "Total Hours",
      "Total Claim Amount",
    ]);
    headerRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.style = headerStyle;
    });

    // Add data row with right alignment for Total Hours and Total Claim Amount
    const dataRow = worksheet.addRow([
      claim.id,
      claim.staff.name,
      claim.project.name,
      projectDuration,
      claim.records.length * 8, // Total hours
      claim.total_money.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    ]);

    dataRow.getCell(5).style = rightAlignStyle; // Total Hours
    dataRow.getCell(6).style = rightAlignStyle; // Total Claim Amount

    worksheet.addRow([]);

    // Add total row with style and right alignment for Total Claim Amount
    const totalRow = worksheet.addRow([
      "",
      "",
      "",
      "",
      "Total :",
      claim.total_money.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    ]);

    totalRow.getCell(5).style = rightAlignStyle; // Total Hours
    totalRow.getCell(6).style = rightAlignStyle; // Total Claim Amount

    totalRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.style = rowStyle;
    });

    // Adjust column widths
    worksheet.columns = [
      { width: 20 }, // Column A (Claim ID)
      { width: 30 }, // Column B (Staff Name)
      { width: 30 }, // Column C (Project Name)
      { width: 40 }, // Column D (Project Duration)
      { width: 15 }, // Column E (Total Hours)
      { width: 20 }, // Column F (Total Claim Amount)
    ];

    // Generate the Excel file and trigger the download
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Claim_${claim.id}.xlsx`);
  };

  return (
    <div className="p-4 sm:mx-auto lg:mx-auto">
      <div className="rounded bg-white shadow-lg p-4">
        <Link to="/approver/approved-paid">
          <IoReturnDownBackSharp
            className="inline-block "
            style={{ fontSize: "30px" }}
          />
          <button className="inline-block ml-5">Back to Approved-Paid</button>
        </Link>
        <div className="flex justify-center items-center  h-[510px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-28">
            <div className="flex flex-col space-y-4">
              <label>
                <strong style={{ color: "#666666", fontStyle: "normal" }}>
                  Claim ID
                </strong>
                <span style={{ color: "red" }}>*</span>
                <input
                  type="text"
                  value={claim.id}
                  readOnly
                  className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
                />
              </label>
              <label>
                <strong style={{ color: "#666666", fontStyle: "normal" }}>
                  Project Name
                </strong>
                <span style={{ color: "red" }}>*</span>
                <input
                  type="text"
                  value={claim.project.name}
                  readOnly
                  className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
                />
              </label>
              <label>
                <strong style={{ color: "#666666", fontStyle: "normal" }}>
                  Total Hours (h)
                </strong>
                <input
                  type="text"
                  value={claim.records.length}
                  readOnly
                  className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
                />
              </label>
            </div>
            <div className="flex flex-col space-y-4">
              <label>
                <strong style={{ color: "#666666", fontStyle: "normal" }}>
                  Staff Name
                </strong>
                <span style={{ color: "red" }}>*</span>
                <input
                  type="text"
                  value={claim.staff.name}
                  readOnly
                  className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
                />
              </label>
              <div className="flex space-x-4">
                <label className="relative mr-4">
                  <strong style={{ color: "#666666", fontStyle: "normal" }}>
                    From
                  </strong>
                  <span style={{ color: "red" }}>*</span>
                  <div className="absolute top-[50%] right-[5px]">
                    <IoCalendarOutline
                      style={{ fontSize: "20px", color: "#555" }}
                    />
                  </div>
                  <input
                    type="text"
                    value={claim.project.from}
                    readOnly
                    className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
                  />
                </label>
                <label className="relative mr-4">
                  <strong style={{ color: "#666666", fontStyle: "normal" }}>
                    To
                  </strong>
                  <span style={{ color: "red" }}>*</span>
                  <div className="absolute top-[50%] right-[5px]">
                    <IoCalendarOutline
                      style={{ fontSize: "20px", color: "#555" }}
                    />
                  </div>
                  <input
                    type="text"
                    value={claim.project.to}
                    readOnly
                    className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
                  />
                </label>
              </div>
              <label>
                <strong style={{ color: "#666666", fontStyle: "normal" }}>
                  Total Amount ($)
                </strong>
                <input
                  type="text"
                  value={claim.total_money
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  readOnly
                  className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
                />
              </label>
              {/* <label>
              <strong>Status:</strong>
              <
              input
                type="text"
                value={claim.status}
                readOnly
                className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
              />
            </label> */}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => downloadExcel(claim)}
            className="w-40 bg-blue-500 text-white px-4 py-2 rounded font-bold"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

const allowedRoles = ["approver"];

export default withAuthorization(ApprovalDetail, allowedRoles);
