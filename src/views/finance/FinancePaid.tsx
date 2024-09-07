/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
 
} from "@/components/ui/table";
import { FaSort, FaSortUp, FaSortDown, FaSearch } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
// import { sampleData } from "./../../lib/mock/sampleData";
import { AppDispatch, RootState } from "@/lib/redux/redux.config";
import { useDispatch } from "react-redux";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"; // Adjust import path if necessary
import { getPaidClaims } from "@/lib/redux/reducers/claims.reducer";
import { Claim } from "@lib/schemas/claim.schema";
import { useSelector } from "react-redux";
import { Tooltip } from "antd";
import * as ExcelJS from "exceljs";
import fileDownload from "js-file-download";
import withAuthorization from "@/lib/utils/withAuthorization";

// Define types for sort configuration
type SortConfig = {
  key: "id" | "project" | "staff" | "records" | "total_money" | null;
  direction: "asc" | "desc";
  subKey?: keyof Claim["project"] | keyof Claim["staff"] | "length";
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

const FinancePaid = () => {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(getPaidClaims());
  }, [dispatch]);

  const claimPaid = useSelector((state: RootState) => state.claim.claims);
  const { isLoading } = useSelector((state: RootState) => state.claim);

  console.log(claimPaid);
  const navigate = useNavigate();
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentData, setCurrentData] = useState<Claim[]>([]);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(claimPaid.length / itemsPerPage)
  );
  const [selectedClaims, setSelectedClaims] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!claimPaid || !Array.isArray(claimPaid)) return;
    const filteredData = claimPaid.filter(
      (claim: Claim) =>
        claim.project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.staff.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedData = [...filteredData];
    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        if (sortConfig.key === "project" && sortConfig.subKey) {
          aValue = a.project[sortConfig.subKey as keyof Claim["project"]] || "";
          bValue = b.project[sortConfig.subKey as keyof Claim["project"]] || "";

          if (
            sortConfig.key === "project" &&
            (sortConfig.subKey === "from" || sortConfig.subKey === "to")
          ) {
            aValue = new Date(aValue as string).getTime();
            bValue = new Date(bValue as string).getTime();
          }
        } else if (sortConfig.key === "staff" && sortConfig.subKey) {
          aValue = a.staff[sortConfig.subKey as keyof Claim["staff"]] || "";
          bValue = b.staff[sortConfig.subKey as keyof Claim["staff"]] || "";
        } else if (
          sortConfig.key === "records" &&
          sortConfig.subKey === "length"
        ) {
          aValue = a.records.length * 8;
          bValue = b.records.length * 8;
        } else {
          aValue = a[sortConfig.key as keyof Claim] as unknown as string;
          bValue = b[sortConfig.key as keyof Claim] as unknown as string;

          // Convert to number if sorting by ID
          if (sortConfig.key === "id") {
            aValue = parseInt(aValue, 10);
            bValue = parseInt(bValue, 10);
          }
        }

        // Handle case-insensitive string comparison
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        // Sorting logic
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));

    const startIdx = (currentPage - 1) * itemsPerPage;
    const newData = sortedData.slice(startIdx, startIdx + itemsPerPage);

    setCurrentData(newData);
  }, [itemsPerPage, currentPage, sortConfig, searchQuery, claimPaid]);

  const handleItemsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSort = (
    key: SortConfig["key"],
    subKey?: SortConfig["subKey"]
  ) => {
    setSortConfig((prevConfig) => ({
      key,
      subKey,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when search query changes
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedClaims((prevSelectedClaims) => {
      const newSelectedClaims = new Set(prevSelectedClaims);
      if (selectAllChecked) {
        newSelectedClaims.delete(id);
      } else {
        if (newSelectedClaims.has(id)) {
          newSelectedClaims.delete(id);
        } else {
          newSelectedClaims.add(id);
        }
      }
      return newSelectedClaims;
    });
  };

  const handleSelectAllChange = () => {
    setSelectAllChecked((prev) => !prev);

    setSelectedClaims((prevSelectedClaims) => {
      const newSelectedClaims = new Set<number>(prevSelectedClaims);

      if (!selectAllChecked) {
        claimPaid.forEach((claim: Claim) => {
          if (typeof claim.id === 'string') {
            const claimIdAsNumber = parseInt(claim.id, 10);
            if (!isNaN(claimIdAsNumber)) {
              newSelectedClaims.add(claimIdAsNumber);
            } else {
              console.error(`Invalid claim ID: ${claim.id}`);
            }
          } else {
            console.error(`Claim ID is missing or not a string: ${claim.id}`);
          }
        });

      
      } else {
        newSelectedClaims.clear();
      }

      return newSelectedClaims;
    });
  };

  const renderSortIcon = (
    key: SortConfig["key"],
    subKey?: SortConfig["subKey"]
  ) => {
    if (sortConfig.key === key && sortConfig.subKey === subKey) {
      return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pageNumbers.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (currentPage > 3) {
        pageNumbers.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      if (currentPage < totalPages - 2) {
        pageNumbers.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pageNumbers;
  };

  //get data

  const handleRowClick = (claim: Claim) => {
    navigate(`/finance/claims/download/${claim.id}`, { state: { claim } });
  };

  const [, setTooltip] = useState<{
    visible: boolean;
    content: string;
    left: number;
    top: number;
  }>({
    visible: false,
    content: "",
    left: 0,
    top: 0,
  });

  const handleMouseEnter = (
    e: MouseEvent<HTMLTableCellElement>,
    content: string
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      content,
      left: rect.left + window.scrollX + 100, // Adjusted for tooltip positioning
      top: rect.top + window.scrollY + 60, // Adjusted for tooltip positioning
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Helper function to format date to dd/mm/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Download handle
  const handleDownload = () => {
    const selectedData = claimPaid
    .filter((claim) => {
      if (typeof claim.id === 'string') {
        return selectedClaims.has(parseInt(claim.id, 10)); // Ensure ID is a number
      } else {
        console.error(`Claim ID is missing or not a string: ${claim.id}`);
        return false;
      }
    })
    .map((claim) => {
        console.log(selectedClaims);
        const projectFrom = new Date(claim.project.from);
        const projectTo = new Date(claim.project.to);
        const totalWorkingHour =
          ((projectTo.getTime() - projectFrom.getTime()) / (1000 * 3600 * 24)) *
          8;

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
          "Total working hour": totalWorkingHour,
          "Total Claim Amount": claim.total_money
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        };
      });

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
    const columns = Object.keys(selectedData[0]);
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
    selectedData.forEach((row, index) => {
      const rowData = Object.values(row);
      worksheet.addRow(rowData);

      // Định dạng hàng chứa dữ liệu
      rowData.forEach((_, colIndex) => {
        const cell = worksheet.getCell(index + 4, colIndex + 1);
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
    });

    // Add "Total" row
    const totalClaimAmount = selectedData.reduce((total, claim) => {
      const claimAmount = parseFloat(
        claim["Total Claim Amount"].replace(/,/g, "")
      );
      return total + claimAmount;
    }, 0);
    const totalRow = worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "Total:",
      totalClaimAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
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
    totalAmountCell.value = totalClaimAmount
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

  const handleDownloadAction = async (claim: Claim) => {
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

  const handleClaimData = async (claim: Claim) => {
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
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="px-2 py-4 md:px-4">
          <div className="flex flex-col p-4 rounded bg-white shadow-lg">
            <div className="mb-4 text-black">
              <h2 className="text-2xl font-bold mb-2">Paid</h2>
              <p>Here is a list of all paid</p>
              <div className="flex flex-col md:flex-row items-center w-full h-[85px] ">
                <div className="flex flex-col md:flex-row items-center w-[566px]">
                  <label
                    htmlFor="itemsPerPage"
                    className="mb-2 md:mb-0 md:ml-2"
                  >
                    Show
                  </label>
                  <select
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="border rounded-md ml-2 w-11 h-8 justify-center justify-items-center"
                  >
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="itemsPerPage"
                    className="mb-2 md:mb-0 md:ml-2"
                  >
                    entries
                  </label>
                  <div className="relative ml-4 w-1/5">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="search"
                      value={searchQuery}
                      onChange={handleSearch}
                      className="border border-gray-400 hover:border-blue-500 rounded-md pl-10 pr-4 py-1 h-10"
                      placeholder="Search"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="min-h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[10px]">
                      <input
                        type="checkbox"
                        checked={selectAllChecked}
                        onChange={handleSelectAllChange}
                      />
                    </TableHead>
                    <TableHead
                      className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex justify-between items-center">
                        ID {renderSortIcon("id")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                      onClick={() => handleSort("project", "name")}
                    >
                      <div className="flex justify-between items-center">
                        Project Name {renderSortIcon("project", "name")}
                      </div>
                    </TableHead>

                    <TableHead
                      className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                      onClick={() => handleSort("staff", "name")}
                    >
                      <div className="flex justify-between items-center">
                        Staff Name {renderSortIcon("staff", "name")}
                      </div>
                    </TableHead>

                    <TableHead
                      className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                      onClick={() => handleSort("project", "from")}
                    >
                      <div className="flex justify-between items-center">
                        From {renderSortIcon("project", "from")}
                      </div>
                    </TableHead>

                    <TableHead
                      className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                      onClick={() => handleSort("project", "to")}
                    >
                      <div className="flex justify-between items-center">
                        To {renderSortIcon("project", "to")}
                      </div>
                    </TableHead>

                    <TableHead
                      className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                      onClick={() => handleSort("records", "length")}
                    >
                      <div className="flex justify-between items-center">
                        Total Hours (h){renderSortIcon("records", "length")}
                      </div>
                    </TableHead>

                    <TableHead
                      className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                      onClick={() => handleSort("total_money")}
                    >
                      <div className="flex justify-between items-center">
                        Total Amount ($){renderSortIcon("total_money")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[150px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9}>No data available</TableCell>{" "}
                      {/* Adjusted colSpan to cover all columns */}
                    </TableRow>
                  ) : (
                    currentData.map((claim, d) => (
                      <TableRow
                        key={claim.id}
                        className={`cursor-pointer ${
                          d % 2 === 0 ? "bg-white" : "bg-[#F7F6FE]"
                        }`}
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={claim.id ? selectedClaims.has(parseInt(claim.id, 10)) : false}

                            onChange={() =>
                              handleCheckboxChange(parseInt(claim.id as string, 10))

                            }
                          />
                        </TableCell>
                        <TableCell
                          className="text-black underline hover:text-blue-700"
                          onClick={() => handleRowClick(claim)}
                        >
<Tooltip title={claim.id ? claim.id.toString() : "No ID available"}>

                            <a
                              href={`/finance/claims/download/${claim.id}`} // Dynamic routing
                            >
                              {claim.id}
                            </a>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          onMouseEnter={(e) =>
                            handleMouseEnter(e, claim.project.name)
                          }
                          onMouseLeave={handleMouseLeave}
                          onClick={() => handleRowClick(claim)}
                        >
                          <Tooltip title={claim.project.name}>
                            <span className="block max-w-[100px] truncate">
                              {claim.project.name}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          onMouseEnter={(e) =>
                            handleMouseEnter(e, claim.staff.name)
                          }
                          onMouseLeave={handleMouseLeave}
                          onClick={() => handleRowClick(claim)}
                        >
                          <Tooltip title={claim.staff.name}>
                            <span className="block max-w-[100px] truncate">
                              {claim.staff.name}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell onClick={() => handleRowClick(claim)}>
                          <Tooltip title={formatDate(claim.project.from)}>
                            {formatDate(claim.project.from)}
                          </Tooltip>
                        </TableCell>
                        <TableCell onClick={() => handleRowClick(claim)}>
                          <Tooltip title={formatDate(claim.project.to)}>
                            {formatDate(claim.project.to)}
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={() => handleRowClick(claim)}
                        >
                          <Tooltip title={claim.records.length.toString()}>
                            {claim.records.length}
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={() => handleRowClick(claim)}
                        >
                          <Tooltip
                            title={claim.total_money
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          >
                            {claim.total_money
                              .toFixed(2)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Download Claim">
                            <a
                              href="#" // Actual link or action for download
                              className={
                                "text-white bg-[#14274E] hover:bg-blue-600  cursor-allowed"
                              }
                              title="Download"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "4px 8px",
                                borderRadius: "4px",
                              }}
                              onClick={() => handleDownloadAction(claim)}
                            >
                              <FiDownload />
                            </a>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
          </TableBody>

</Table>

            </div>
            <TableCell colSpan={9}>
        Total Claims: {claimPaid.length}
      </TableCell>
            <Pagination className="mt-4">
              {currentPage > 1 && (
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                />
              )}
              <PaginationContent>{renderPageNumbers()}</PaginationContent>
              {currentPage < totalPages && (
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              )}
            </Pagination>
          </div>

          <div className="flex justify-end mt-4">
            <button
              className={`flex items-center px-4 py-2 rounded-md ${
                selectedClaims.size > 0
                  ? "bg-blue-500 text-white cursor-pointer"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
              onClick={handleDownload}
              disabled={selectedClaims.size === 0}
            >
              <FiDownload className="mr-2" /> Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


const allowedRoles = ["finance"];

export default withAuthorization(FinancePaid, allowedRoles);
