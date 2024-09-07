import { useState, useMemo, useEffect } from "react";
import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from "react-icons/ti";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@components/ui/table.tsx";
import SearchBar from "@/components/shared/SearchBar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Navigate, useNavigate } from "react-router-dom";

import { getPendingClaimsByStaff } from "@/lib/redux/reducers/claims.reducer";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/redux.config";
import withAuthorization from "@/lib/utils/withAuthorization";
import { getItemWithExpiry } from "@/lib/utils/storage.utils";
import { decryptData } from "@/lib/utils/auth.utils";

type SortDirection = "asc" | "desc" | "none";

const ClaimsPending = () => {
  const [parPage, setParPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");

  const dispatch: AppDispatch = useDispatch();
  const claims = useSelector((state: RootState) => state.claim.claims);

  const navigate = useNavigate();

  const encryptedData = getItemWithExpiry<string>("userData");

  if (!encryptedData) {
    console.log("No user data available or data has expired.");
    return <Navigate to="/login" replace />;
  }

  const decryptedData = decryptData(encryptedData);
  const userData = JSON.parse(decryptedData);
  console.log(userData.id);

  useEffect(() => {
    dispatch(getPendingClaimsByStaff(userData.id));
  }, []);

  const filteredData = useMemo(() => {
    return claims.filter(
      (claim) =>
        claim.id?.toString().includes(searchQuery) ||
        claim.staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, claims]);

  const sortedData = useMemo(() => {
    if (sortDirection === "none") return filteredData;

    const compare = (a: any, b: any) => {
      if (
        sortColumn === "project_duration_from" ||
        sortColumn === "project_duration_to"
      ) {
        return sortDirection === "asc"
          ? new Date(a.project.from).getTime() -
              new Date(b.project.from).getTime()
          : new Date(b.project.from).getTime() -
              new Date(a.project.from).getTime();
      }

      if (sortColumn === "id" || sortColumn === "record") {
        return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
      }

      if (sortColumn === "project_name") {
        return sortDirection === "asc"
          ? a.project.name.localeCompare(b.project.name)
          : b.project.name.localeCompare(a.project.name);
      }

      if (sortColumn === "staff_name") {
        return sortDirection === "asc"
          ? a.staff.name.localeCompare(b.staff.name)
          : b.staff.name.localeCompare(a.staff.name);
      }

      return 0;
    };

    return [...filteredData].sort(compare);
  }, [filteredData, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    let newSortDirection: SortDirection;

    if (sortColumn === column) {
      if (sortDirection === "asc") {
        newSortDirection = "desc";
      } else if (sortDirection === "desc") {
        newSortDirection = "none";
      } else {
        newSortDirection = "asc";
      }
    } else {
      newSortDirection = "asc";
    }

    setSortDirection(newSortDirection);
    setSortColumn(column);
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column)
      return <TiArrowUnsorted className="text-gray-500" />;
    if (sortDirection === "asc")
      return <TiArrowSortedUp className="text-blue-500" />;
    if (sortDirection === "desc")
      return <TiArrowSortedDown className="text-blue-500" />;
    return <TiArrowUnsorted className="text-gray-500" />;
  };

  const totalPages = Math.ceil(sortedData.length / parPage);

  const handleChangePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const paginatedData = useMemo(
    () => sortedData.slice((currentPage - 1) * parPage, currentPage * parPage),
    [sortedData, currentPage, parPage]
  );

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleRowClick = (id: Number) => {
    navigate(`/claims/${id}`);
  };

  return (
    <div className="px-2 py-4 md:px-4">
      <div className="flex flex-col p-4 rounded-lg bg-white shadow-lg">
        {/* Top section */}
        <div className="mb-4 text-black">
          <h2 className="text-2xl font-bold mb-2">Pending</h2>
          <div className="flex space-x-6 justify-start items-center mt-4">
            <div>Show</div>
            <div className="relative">
              <select
                onChange={(e) => {
                  setParPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-md ml-2 w-11 h-8 justify-center justify-items-center"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <label htmlFor="itemsPerPage" className="mb-2 md:mb-0 md:ml-2">
                entries
              </label>
            </div>
            <SearchBar
              query={searchQuery}
              setQuery={setSearchQuery}
              placeholder="Search"
              width={500}
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-h-96 px-8">
          <Table className="min-w-full divide-y">
            <TableHeader className="bg-white">
              <TableRow>
                <TableHead
                  className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => handleSort("id")}
                  style={{ width: "200px" }}
                >
                  <div className="flex flex-row justify-between items-center">
                    Claim ID {renderSortIcon("id")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => handleSort("staff_name")}
                  style={{ width: "200px" }}
                >
                  <div className="flex flex-row justify-between items-center">
                    Staff Name {renderSortIcon("staff_name")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => handleSort("project_name")}
                  style={{ width: "200px" }}
                >
                  <div className="flex flex-row justify-between items-center">
                    Project Name {renderSortIcon("project_name")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => handleSort("project_duration_from")}
                  style={{ width: "150px" }}
                >
                  <div className="flex flex-row justify-between items-center">
                    From {renderSortIcon("project_duration_from")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => handleSort("project_duration_to")}
                  style={{ width: "150px" }}
                >
                  <div className="flex flex-row justify-between items-center">
                    To {renderSortIcon("project_duration_to")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => handleSort("record")}
                  style={{ width: "200px" }}
                >
                  <div className="flex flex-row justify-between items-center">
                    Total Hours (hours) {renderSortIcon("record")}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((claim, index) => (
                <TableRow
                  key={claim.id}
                  className={index % 2 === 0 ? "bg-[#F7F6FE]" : "bg-white"}
                  onClick={() => handleRowClick(Number(claim.id))}
                >
                  <TableCell>{claim.id}</TableCell>
                  <TableCell>{claim.staff.name}</TableCell>
                  <TableCell>{claim.project.name}</TableCell>
                  <TableCell align="right" style={{ paddingRight: "50px" }}>
                    {formatDate(new Date(claim.project.from))}
                  </TableCell>
                  <TableCell align="right" style={{ paddingRight: "50px" }}>
                    {formatDate(new Date(claim.project.to))}
                  </TableCell>
                  <TableCell align="right" style={{ paddingRight: "50px" }}>
                    {claim.records.reduce(
                      (total, record) =>
                        total +
                        (new Date(record.to).getTime() -
                          new Date(record.from).getTime()) /
                          (1000 * 60 * 60),
                      0
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <TableCell colSpan={9}>
        Total Claims: {sortedData.length}
      </TableCell>

        {/* Pagination */}
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handleChangePage(currentPage - 1)}
                className={
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }
              />
            </PaginationItem>
            {currentPage > 2 && (
              <>
                <PaginationItem>
                  <PaginationLink onClick={() => handleChangePage(1)}>
                    1
                  </PaginationLink>
                </PaginationItem>
                {currentPage > 3 && <PaginationEllipsis />}
              </>
            )}
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              if (
                page === currentPage ||
                page === currentPage - 1 ||
                page === currentPage + 1
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => handleChangePage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}
            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <PaginationEllipsis />}
                <PaginationItem>
                  <PaginationLink onClick={() => handleChangePage(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => handleChangePage(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
const allowedRoles = ["claimer"];

export default withAuthorization(ClaimsPending, allowedRoles);
