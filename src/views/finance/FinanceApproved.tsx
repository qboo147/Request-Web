/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"; // Adjust import path if necessary
import { FaSort, FaSortUp, FaSortDown, FaSearch } from "react-icons/fa";
import { BiSolidDollarCircle } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiCircleQuestion } from "react-icons/ci";
import { AppDispatch, RootState } from "@/lib/redux/redux.config";
import { useDispatch } from "react-redux";
import {
  getApprovedClaims,
  paidClaim,
} from "@/lib/redux/reducers/claims.reducer";
import { useSelector } from "react-redux";
import { Tooltip } from "antd";
import { Claim } from "@/lib/schemas/claim.schema";
import withAuthorization from "@/lib/utils/withAuthorization";
import { getItemWithExpiry } from "@/lib/utils/storage.utils";
import { decryptData } from "@/lib/utils/auth.utils";

// Define types for sort configuration
type SortConfig = {
  key: "id" | "project" | "staff" | "records" | "total_money" | null;
  direction: "asc" | "desc";
  subKey?: keyof Claim["project"] | keyof Claim["staff"] | "length";
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];


const FinanceApproved = () => {
  const dispatch: AppDispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

  const claimState = useSelector((state: RootState) => state.claim.claims);

  // Trạng thái để quản lý hộp thoại đầu tiên và thứ hai
  const [showInitialDialog, setShowInitialDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    dispatch(getApprovedClaims());
  }, []);

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

  useEffect(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const newData = claimState.slice(startIdx, startIdx + itemsPerPage);
    setCurrentData(newData);
    setTotalPages(Math.ceil(claimState.length / itemsPerPage));
  }, [claimState, itemsPerPage, currentPage]);

  const navigate = useNavigate();

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentData, setCurrentData] = useState<Claim[]>([]);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(claimState.length / itemsPerPage)
  );
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  // const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

        if (
          sortConfig.key === "project" &&
          (sortConfig.subKey === "from" || sortConfig.subKey === "to")
        ) {
          // Convert date to timestamp for comparison
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const newData = sortedData.slice(startIdx, startIdx + itemsPerPage);
    setCurrentData(newData);
  }, [itemsPerPage, currentPage, sortConfig, searchQuery, claimState]);

  const handleItemsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
    setSelectedClaim(claim);
    navigate(`/finance/claims/${claim.id}`, { state: { claim } });
  };

  const handleCloseDialog = () => {
    setSelectedClaim(null);
    setShowInitialDialog(false);
    setShowConfirmDialog(false);
  };

  const handleConfirmDialog = () => {
    setShowInitialDialog(false); // Đóng hộp thoại đầu tiên
    setShowConfirmDialog(true); // Hiển thị hộp thoại thứ hai
  };

  const handleContinue = async () => {
    if (selectedClaim) {
      try {
        // Chuyển đổi id từ string sang number
        const claimId = Number(selectedClaim.id);
        if (isNaN(claimId)) {
          throw new Error("Invalid claim id");
        }
        await dispatch(paidClaim(claimId)).unwrap();
        toast.success("Paid Success");
        dispatch(getApprovedClaims());
      } catch (error) {
        toast.error("Failed to update claim");
      }
      handleCloseDialog(); // Đóng cả hai hộp thoại
    }
  };

  const handlePaidClick = (claim: Claim) => {
    setSelectedClaim(claim);
    setShowInitialDialog(true); // Hiển thị hộp thoại đầu tiên
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

  const [isLoading] = useState(false);

  const currentTime = new Date();

  const encryptedData = getItemWithExpiry<string>("userData");

  if (!encryptedData) {
    console.log("No user data available or data has expired.");
    return <Navigate to="/login" replace />;
  }

  const decryptedData = decryptData(encryptedData);
  const userData = JSON.parse(decryptedData);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="px-2 py-4 md:px-4">
          <div className="flex flex-col p-4 rounded bg-white shadow-lg">
            <div className="mb-4 text-black">
              <h2 className="text-2xl font-bold mb-2">Approved</h2>
              <p>Here is a list of all approved</p>
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
                        Total Hours (h) {renderSortIcon("records", "length")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                      onClick={() => handleSort("total_money")}
                    >
                      <div className="flex justify-between items-center">
                        Total Amount ($) {renderSortIcon("total_money")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[150px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8}>No data available</TableCell>
                    </TableRow>
                  ) : (
                    currentData.map((claim, d) => (
                      <TableRow
                        key={claim.id}
                        className={`cursor-pointer ${
                          d % 2 === 0 ? "bg-white" : "bg-[#F7F6FE]"
                        }`}
                      >
                        <TableCell
                          className="text-black underline hover:text-blue-700"
                          onClick={() => handleRowClick(claim)}
                        >
                          <Tooltip title={Number(claim.id).toString()}>
                            <a href={`/finance/claims/${claim.id}`}>
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
                          className="text-right "
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
                          <Tooltip title="Paid Claim">
                            <button
                              onClick={() => handlePaidClick(claim)} // Thay đổi đây nếu claim.id không phải là id của yêu cầu
                              className="bg-transparent border-none"
                            >
                              <BiSolidDollarCircle
                                size={28}
                                className="text-black"
                                onClick={(event: MouseEvent<SVGElement>) => {
                                  event.stopPropagation(); // Prevent row click
                                  handlePaidClick(claim);
                                  setShowConfirmDialog(false);
                                }}
                              />
                            </button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
          </TableBody>

</Table>

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
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              )}
            </Pagination>
          </div>

          {/* {selectedClaim && ( */}
          {showInitialDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 max-w-sm mx-auto">
                <h2 className="text-lg font-bold mb-4">Paid Claim Requests</h2>
                <hr className="mb-4" />
                <p className="mb-4">{`Paid by ${userData.name} on ${currentTime}.`}</p>
                <hr className="mb-4" />
                <p className="mb-4">
                  Please click 'Continue' to approve the claim or 'Cancel' to
                  close the dialog.
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={handleCloseDialog}
                    className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDialog}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {showConfirmDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-4 max-w-sm mx-auto">
                <h2 className="text-lg font-bold mb-4">Confirm</h2>
                <hr className="mb-4" />

                <p className="mb-4 flex items-center justify-between">
                  <CiCircleQuestion className="w-[71px] h-[71px]" /> Are you
                  sure you want to continue this action?
                </p>
                <hr className="mb-4" />
                <div className="flex justify-end">
                  <button
                    onClick={handleCloseDialog}
                    className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleContinue}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          <ToastContainer position="top-right" />
        </div>
      )}
    </div>
  );
};
const allowedRoles = ["finance"];

export default withAuthorization(FinanceApproved, allowedRoles);
