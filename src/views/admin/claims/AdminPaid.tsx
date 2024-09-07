/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@components/ui/table";
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
import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { getPaidClaims } from "@/lib/redux/reducers/claims.reducer";
import { AppDispatch, RootState } from "@/lib/redux/redux.config";
import { Claim } from "@lib/schemas/claim.schema"; // Import Claim interface
import withAuthorization from "@/lib/utils/withAuthorization";

type SortDirection = "asc" | "desc" | "none";

const AdminPaid = () => {
  const [parPage, setParPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getPaidClaims());
  }, [dispatch]);

  const paidClaimsState: Claim[] = useSelector(
    (state: RootState) => state.claim.claims
  );

  const filteredData = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return paidClaimsState.filter(
      (claim) =>
        claim.id?.toString().includes(searchQuery) ||
        claim.staff.name.toLowerCase().includes(lowerQuery) ||
        claim.project.name.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, paidClaimsState]);

  const handleSort = (column: string) => {
    let newSortDirection: SortDirection;
    if (sortColumn === column) {
      newSortDirection =
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? "none"
          : "asc";
    } else {
      newSortDirection = "asc";
    }
    setSortDirection(newSortDirection);
    setSortColumn(column);
  };

  const sortedData = useMemo(() => {
    if (sortDirection === "none") return filteredData;
    const compare = (a: Claim, b: Claim) => {
      const aValue =
        sortColumn === "project_duration_from"
          ? new Date(a.project.from).getTime()
          : sortColumn === "project_duration_to"
          ? new Date(a.project.to).getTime()
          : (a as any)[sortColumn as keyof Claim];
      const bValue =
        sortColumn === "project_duration_from"
          ? new Date(b.project.from).getTime()
          : sortColumn === "project_duration_to"
          ? new Date(b.project.to).getTime()
          : (b as any)[sortColumn as keyof Claim];
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    };
    return [...filteredData].sort(compare);
  }, [filteredData, sortColumn, sortDirection]);

  const totalPages = useMemo(
    () => Math.ceil(sortedData.length / parPage),
    [sortedData.length, parPage]
  );

  const handleChangePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const paginatedData = useMemo(
    () => sortedData.slice((currentPage - 1) * parPage, currentPage * parPage),
    [sortedData, currentPage, parPage]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  

  const handleRowClick = (claimId?: string) => {
    if (claimId) {
      navigate(`/admin/claims/${claimId}`, {
        state: { from: "/admin/claims/paid" },
      });
    }
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

  return (
    <div className="px-2 py-4 md:px-4">
      <div className="flex flex-col p-4 rounded-lg bg-white shadow-lg">
        {/* Top section */}
        <div className="mb-4 text-black">
          <h2 className="text-2xl font-bold mb-2">Paid</h2>
          <p>Here is a list of paid</p>
          <div className="flex space-x-6 justify-start items-center mt-4">
            <div>Show</div>
            <div className="relative">
              <select
                onChange={(e) => {
                  setParPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-md ml-2 w-10 h-8"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <label htmlFor="itemsPerPage" className="ml-2">
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
          <Table className="w-full caption-bottom text-sm min-w-full divide-y">
            <TableHeader className="bg-white">
              <TableRow>
                <TableHead
                  className="text-ellipsis whitespace-nowrap cursor-pointer"
                  onClick={() => handleSort("id")}
                  style={{ width: "200px" }}
                >
                  <div className="flex justify-between items-center">
                    Claim ID {renderSortIcon("id")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-ellipsis whitespace-nowrap cursor-pointer"
                  onClick={() => handleSort("staff_name")}
                  style={{ width: "200px" }}
                >
                  <div className="flex justify-between items-center">
                    Staff Name {renderSortIcon("staff_name")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-ellipsis whitespace-nowrap cursor-pointer"
                  onClick={() => handleSort("project_name")}
                  style={{ width: "200px" }}
                >
                  <div className="flex justify-between items-center">
                    Project Name {renderSortIcon("project_name")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-ellipsis whitespace-nowrap cursor-pointer"
                  onClick={() => handleSort("project_duration_from")}
                  style={{ width: "150px" }}
                >
                  <div className="flex justify-between items-center">
                    From {renderSortIcon("project_duration_from")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-ellipsis whitespace-nowrap cursor-pointer"
                  onClick={() => handleSort("project_duration_to")}
                  style={{ width: "150px" }}
                >
                  <div className="flex justify-between items-center">
                    To {renderSortIcon("project_duration_to")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-ellipsis whitespace-nowrap cursor-pointer"
                  onClick={() => handleSort("record")}
                  style={{ width: "200px" }}
                >
                  <div className="flex justify-between items-center">
                    Total Hours (hours) {renderSortIcon("record")}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((claim, index) => (
                <TableRow
                  key={claim.id}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                  onClick={() => handleRowClick(claim.id)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{claim.id}</TableCell>
                  <TableCell>{claim.staff.name}</TableCell>
                  <TableCell>{claim.project.name}</TableCell>
                  <TableCell align="right">
                    {formatDate(claim.project.from)}
                  </TableCell>
                  <TableCell align="right">
                    {formatDate(claim.project.to)}
                  </TableCell>
                  <TableCell align="right">
                    {claim.records.reduce(
                      (total: number, record: any) =>
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
        Total Claims: {filteredData.length}
      </TableCell>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
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
                    <PaginationLink
                      onClick={() => handleChangePage(totalPages)}
                    >
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
    </div>
  );
};
const allowedRoles = ["admin"];

export default withAuthorization(AdminPaid, allowedRoles);
