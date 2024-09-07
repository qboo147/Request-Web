import { useState, useEffect, ChangeEvent } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { AppDispatch } from "@/lib/redux/redux.config";
import { useDispatch, useSelector } from "react-redux";
import { getApprovedPaidClaims } from "@/lib/redux/reducers/claims.reducer";
import { Tooltip } from "antd";
import { Claim } from "@/lib/schemas/claim.schema";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import withAuthorization from "@/lib/utils/withAuthorization";

// Define types for sort configuration
type SortConfig = {
  key: "id" | "project" | "staff" | "records" | "total_money" | "status" | null;
  direction: "asc" | "desc";
  subKey?: keyof Claim["project"] | keyof Claim["staff"] | "length";
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const ClaimsApprovedPaid = () => {
  const navigate = useNavigate();
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentData, setCurrentData] = useState<Claim[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getApprovedPaidClaims());
  }, [dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const claimState = useSelector((state: any) => state.claim.claims);

  useEffect(() => {
    if (!claimState || !Array.isArray(claimState)) return;

    const filteredData = claimState.filter(
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
  }, [claimState, itemsPerPage, currentPage, sortConfig, searchQuery]);

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

  const handleRowClick = (claim: Claim) => {
    console.log(claim);
    navigate(`/approver/${claim.id}`, { state: { claim } });
  };

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
    <div className="px-2 py-4 md:px-4 rounded bg-white shadow-lg">
      <div className="mb-4 text-black">
        <h2 className="text-lg font-bold">Approved and Paid Claims</h2>
        <p className="mb-2">Displaying all approved and paid claims</p>
        <div className="flex flex-col md:flex-row items-start mb-4">
          <div className="flex flex-col md:flex-row items-center">
            <label htmlFor="itemsPerPage" className="mb-2 md:mb-0 md:ml-2">
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
            <label htmlFor="itemsPerPage" className="mb-2 md:mb-0 md:ml-2">
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
              <TableHead
                className="w-[50px] overflow-hidden text-ellipsis whitespace-nowrap text-black"
                onClick={() => handleSort("id")}
              >
                <div className="flex justify-between items-center">
                  ID {renderSortIcon("id")}
                </div>
              </TableHead>
              <TableHead
                className="w-[250px] overflow-hidden text-ellipsis whitespace-nowrap text-black"
                onClick={() => handleSort("project", "name")}
              >
                <div className="flex justify-between items-center">
                  Project Name {renderSortIcon("project", "name")}
                </div>
              </TableHead>
              <TableHead
                className="w-[250px] overflow-hidden text-ellipsis whitespace-nowrap text-black"
                onClick={() => handleSort("staff", "name")}
              >
                <div className="flex justify-between items-center">
                  Staff Name {renderSortIcon("staff", "name")}
                </div>
              </TableHead>
              <TableHead
                className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-black"
                onClick={() => handleSort("project", "from")}
              >
                <div className="flex justify-between items-center">
                  From {renderSortIcon("project", "from")}
                </div>
              </TableHead>
              <TableHead
                className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-black"
                onClick={() => handleSort("project", "to")}
              >
                <div className="flex justify-between items-center">
                  To {renderSortIcon("project", "to")}
                </div>
              </TableHead>
              <TableHead
                className="w-[50px] overflow-hidden text-ellipsis whitespace-nowrap text-black"
                onClick={() => handleSort("records", "length")}
              >
                <div className="flex justify-between items-center">
                  Total Hours {renderSortIcon("records", "length")}
                </div>
              </TableHead>
              <TableHead
                className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-black"
                onClick={() => handleSort("total_money")}
              >
                <div className="flex justify-between items-center">
                  Total Amount {renderSortIcon("total_money")}
                </div>
              </TableHead>
              <TableHead
                className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-black"
                onClick={() => handleSort("status")}
              >
                <div className="flex justify-between items-center">
                  Status {renderSortIcon("status")}
                </div>
              </TableHead>
              <TableHead className="w-[150px] text-black">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>No data available</TableCell>
              </TableRow>
            ) : (
              currentData.map((claim) => (
                <TableRow
                  key={claim.id}
                  onClick={() => handleRowClick(claim)}
                  className="cursor-pointer"
                >
                  <TableCell className="truncate ... text-black underline hover:text-blue-700">
                    <Tooltip title={claim.id}>{claim.id}</Tooltip>
                  </TableCell>
                  <TableCell className="truncate ...">
                    <Tooltip title={claim.project.name}>
                      <span className="block max-w-[100px] truncate">
                        {claim.project.name}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="truncate ...  ">
                    <Tooltip title={claim.staff.name}>
                      <span className="block max-w-[100px] truncate">
                        {claim.staff.name}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="truncate ...  ">
                    <Tooltip title={formatDate(claim.project.from)}>
                      {formatDate(claim.project.from)}
                    </Tooltip>
                  </TableCell>
                  <TableCell className="truncate ...  ">
                    <Tooltip title={formatDate(claim.project.to)}>
                      {formatDate(claim.project.to)}
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-right pr-3">
                    <Tooltip title={(claim.records.length * 8).toString()}>
                      {claim.records.length * 8}
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-right number-cell">
                    <Tooltip title={formatNumber(claim.total_money)}>
                      {formatNumber(claim.total_money)}
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={claim.status}>
                      <div
                        className={`flex px-2 py-1 items-center justify-start rounded text-black`}
                      >
                        {claim.status === "paid" ? "Paid" : "Approved"}
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="action">
                    <a
                      onClick={() => downloadExcel(claim)}
                      className={`text-white ${
                        claim.status === "approved"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#14274E] hover:bg-blue-700"
                      }`}
                      title="Download"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      <FiDownload />
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>

        {/* Tooltip */}
        {/* Tooltips are now managed by Ant Design and do not need manual rendering */}
      </div>
      <TableCell colSpan={9}>
                Total Claims: {claimState.length}
              </TableCell>
      {/* Pagination */}
      <Pagination className="mt-4">
        {currentPage > 1 && (
          <PaginationPrevious
            onClick={() => handlePageChange(currentPage - 1)}
          />
        )}
        <PaginationContent>{renderPageNumbers()}</PaginationContent>
        {currentPage < totalPages && (
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
        )}
      </Pagination>
    </div>
  );
};
const allowedRoles = ["approver"];

export default withAuthorization(ClaimsApprovedPaid, allowedRoles);
