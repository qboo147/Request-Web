import { useLocation } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { IoReturnDownBackSharp } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";
import { Claim as ClaimPaid } from "@lib/schemas/claim.schema";
import * as ExcelJS from "exceljs";
import fileDownload from "js-file-download";
import withAuthorization from "@/lib/utils/withAuthorization";

const FinanceInfoDownload = () => {
  const location = useLocation();
  const { claim } = location.state as { claim: ClaimPaid }; // Get claim from state

  // Helper function to format date to dd/mm/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!claim) {
    return <div>No claim data available</div>;
  }

  const handleGoBack = () => {
    window.history.back(); // Quay lại trang trước đó trong lịch sử duyệt
  };

  const handleDownloadAction = async (claim: ClaimPaid) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Paid Claims");

    // Thêm dòng tiêu đề "Claim request for <MM/yyyy>"
    const currentDate = new Date();
    const titleRow = worksheet.addRow([
      `Claim request for ${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`,
    ]);
    titleRow.font = { size: 16 };

    // Định dạng khoảng cách giữa các cột
    worksheet.getColumn(1).width = 10; // Cột 1 (Claim ID)
    worksheet.getColumn(2).width = 20; // Cột 2 (Staff Name)
    worksheet.getColumn(3).width = 20; // Cột 3 (Department)
    worksheet.getColumn(4).width = 20; // Cột 4 (Project Name)
    worksheet.getColumn(5).width = 20; // Cột 5 (Project Duration)
    worksheet.getColumn(6).width = 18; // Cột 6 (Total working hour)
    worksheet.getColumn(7).width = 20; // Cột 7 (Total Claim Amount)

    // Định dạng tiêu đề cột
    const columns = Object.keys(await handleClaimData(claim));
    columns.forEach((column, index) => {
      worksheet.getCell(3, index + 1).value = column;
      worksheet.getCell(3, index + 1).font = {
        color: { argb: "FFFFFFFF" }, // Màu chữ trắng
        bold: true, // Chữ in đậm
      };
      worksheet.getCell(3, index + 1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1d4d74" }, // Màu nền #1d4d74
      };
    });

    // Thêm dữ liệu vào worksheet
    const rowData = Object.values(await handleClaimData(claim));
    worksheet.addRow(rowData);

    // Định dạng hàng chứa dữ liệu
    rowData.forEach((_, colIndex) => {
      const cell = worksheet.getCell(4, colIndex + 1);
      cell.font = {
        color: { argb: "000000" }, // Màu chữ đen
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF" }, // Màu nền trắng
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } }, // Viền trên màu đen
        left: { style: "thin", color: { argb: "000000" } }, // Viền trái màu đen
        bottom: { style: "thin", color: { argb: "000000" } }, // Viền dưới màu đen
        right: { style: "thin", color: { argb: "000000" } }, // Viền phải màu đen
      };
    });

    // Add "Total" row
    const totalClaimAmount = claim.total_money
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const totalRow = worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "Total:",
      totalClaimAmount,
    ]);
    totalRow.font = { color: { argb: "000000" }, bold: true }; // Black bold font

    // Merge and align the "Total" cells
    const totalCell = worksheet.getCell(totalRow.number, 1);
    totalCell.value = "Total:";
    totalCell.alignment = { horizontal: "right" }; // Căn lề phải
    totalCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "fff3cd" }, // Light yellow background
    };
    totalCell.border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };

    const totalAmountCell = worksheet.getCell(totalRow.number, 7);
    totalAmountCell.value = totalClaimAmount;
    totalAmountCell.font = { color: { argb: "000000" }, bold: true };
    totalAmountCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "fff3cd" }, // Light yellow background
    };
    totalAmountCell.border = {
      top: { style: "thin", color: { argb: "000000" } },
      left: { style: "thin", color: { argb: "000000" } },
      bottom: { style: "thin", color: { argb: "000000" } },
      right: { style: "thin", color: { argb: "000000" } },
    };

    worksheet.mergeCells(totalRow.number, 1, totalRow.number, 6);

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      fileDownload(blob, "paid-claims.xlsx");
    });
  };

  const handleClaimData = async (claim: ClaimPaid) => {
    const projectFrom = new Date(claim.project.from);
    const projectTo = new Date(claim.project.to);
    const totalWorkingHour =
      ((projectTo.getTime() - projectFrom.getTime()) / (1000 * 3600 * 24)) * 8;

    const projectFromStr = `${
      projectFrom.getMonth() + 1
    }/${projectFrom.getFullYear()}`;
    const projectToStr = `${
      projectTo.getMonth() + 1
    }/${projectTo.getFullYear()}`;
    const projectDuration = `${projectFromStr} - ${projectToStr}`;

    return {
      "Claim ID": claim.id,
      "Staff Name": claim.staff.name,
      Department: claim.staff.department,
      "Project Name": claim.project.name,
      "Project Duration": projectDuration,
      "Total Working Hour": totalWorkingHour,
      "Total Claim Amount": claim.total_money
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    };
  };

  return (
    <div className="p-4 sm:mx-auto lg:mx-auto">
      <div className="rounded bg-white shadow-lg p-4">
        <span onClick={handleGoBack} className="inline-block">
          <IoReturnDownBackSharp
            className="inline-block "
            style={{ fontSize: "30px" }}
          />
          <button className="inline-block ml-5">Back to Project List</button>
        </span>
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
                    value={formatDate(claim.project.from)}
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
                    value={formatDate(claim.project.to)}
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
            className="w-40 bg-blue-500 text-white px-4 py-2 rounded font-bold"
            onClick={() => handleDownloadAction(claim)}
          >
            Download Claim
          </button>
        </div>
      </div>
    </div>
  );
};

const allowedRoles = ["finance"];

export default withAuthorization(FinanceInfoDownload, allowedRoles);
