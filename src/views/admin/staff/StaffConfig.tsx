/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSort, FaSortUp, FaSortDown, FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/redux.config";
import {
  clearMessages,
  getAllStaff,
  deactivateStaff,
} from "@/lib/redux/reducers/staff.reducer";
import SearchBar from "./Search";
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
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alertDialog";
import { Tooltip } from "antd";
import withAuthorization from "@/lib/utils/withAuthorization";

type Staff = {
  id: number;
  name: string;
  department: string;
  rank: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

type SortConfig = {
  key: keyof Staff | null;
  direction: "asc" | "desc";
};

const StaffConfig = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const staff = useSelector((state: RootState) => state.staff.staff);
  const isLoading = useSelector((state: RootState) => state.staff.isLoading);
  const error = useSelector((state: RootState) => state.staff.error);

  const [showConfirmationDialog, setShowConfirmationDialog] =
    useState<boolean>(false);
  const [, setErr] = useState<string | null>(null);
  const [staffToDeactivate, setStaffToDeactivate] = useState<Staff | null>(
    null
  );

  const [parPage, setParPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(staff.length / parPage);

  const startIndex = (currentPage - 1) * parPage;
  const endIndex = startIndex + parPage;

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [query, setQuery] = useState<string>("");

  const filteredStaff = staff.filter(
    (s) =>
      s.active &&
      (s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.department.toLowerCase().includes(query.toLowerCase()) ||
        s.rank.toLowerCase().includes(query.toLowerCase()) ||
        s.role.toLowerCase().includes(query.toLowerCase()))
  );

  const sortStaff = (staffList: Staff[], config: SortConfig) => {
    if (config.key === null) return staffList;
    const sortedStaff = [...staffList].sort((a, b) => {
      if (a[config.key!] < b[config.key!])
        return config.direction === "asc" ? -1 : 1;
      if (a[config.key!] > b[config.key!])
        return config.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortedStaff;
  };

  const sortedStaff = sortStaff(filteredStaff, sortConfig);
  const displayedStaff = sortedStaff.slice(startIndex, endIndex);

  useEffect(() => {
    dispatch(clearMessages());
    dispatch(getAllStaff());
  }, [dispatch]);

  const handleDeactive = (staff: Staff) => {
    setStaffToDeactivate(staff);
    setShowConfirmationDialog(true);
  };

  const confirmSubmission = async () => {
    if (staffToDeactivate) {
      try {
        await dispatch(deactivateStaff(staffToDeactivate.id)).unwrap();
        navigate("/config/staff");
      } catch (err: any) {
        setErr(err.message || "Failed to deactivate staff. Please try again.");
      } finally {
        setShowConfirmationDialog(false);
        setStaffToDeactivate(null);
      }
    }
  };

  const cancelSubmission = () => {
    setShowConfirmationDialog(false);
    setStaffToDeactivate(null);
  };

  const handleChangePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSort = (key: keyof Staff) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const renderSortIcon = (key: keyof Staff) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const handleEdit = (staff: Staff) => {
    navigate("/config/edit-staff", { state: { staff } });
  };

  const handleIdClick = (staff: Staff) => {
    navigate(`/config/staff/${staff.id}`, { state: { staff } });
  };

  return (
    <div className="px-2 py-4 md:px-4">
      <div className="flex flex-col p-4 h-[650px] rounded bg-white shadow-lg">
        <div className="flex justify-between items-center mb-4 text-black">
          <div>
            <h2 className="text-lg font-bold">Staff Information</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 relative mb-4">
          <div className="text-sm">Show</div>
          <div>
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
          <div>
            <SearchBar
              query={query}
              setQuery={setQuery}
              placeholder="Search"
              width={250}
            />
          </div>
          <div>
            <button
              className="bg-blue-600 text-white rounded-md border w-[120px] h-[30px] font-bold font-mono absolute right-4"
              onClick={() => navigate("/config/add-staff")}
            >
              + Add Staff
            </button>
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
                  onClick={() => handleSort("name")}
                >
                  <div className="flex justify-between items-center">
                    Name {renderSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[250px] overflow-hidden text-ellipsis whitespace-nowrap text-black"
                  onClick={() => handleSort("department")}
                >
                  <div className="flex justify-between items-center">
                    Department {renderSortIcon("department")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-black"
                  onClick={() => handleSort("rank")}
                >
                  <div className="flex justify-between items-center">
                    Rank {renderSortIcon("rank")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-black"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex justify-between items-center">
                    Role {renderSortIcon("role")}
                  </div>
                </TableHead>
                <TableHead className="w-[150px] text-black">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9}>Loading...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={9}>Error: {error}</TableCell>
                </TableRow>
              ) : displayedStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>No data available</TableCell>
                </TableRow>
              ) : (
                displayedStaff.map((staff) => (
                  <TableRow>
                    <TableCell
                      className="w-[50px] overflow-hidden text-ellipsis whitespace-nowrap text-blue-500 cursor-pointer underline"
                      key={staff.id}
                      onClick={() => handleIdClick(staff)}
                    >
                      <Tooltip title={staff.id.toString()} placement="top">
                        <div>{staff.id}</div>
                      </Tooltip>
                    </TableCell>

                    <TableCell className="w-[250px] overflow-hidden text-ellipsis whitespace-nowrap text-black">
                      <Tooltip title={staff.name} placement="top">
                        <div>{staff.name}</div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="w-[250px] overflow-hidden text-ellipsis whitespace-nowrap text-black">
                      <Tooltip title={staff.department} placement="top">
                        <div>{staff.department}</div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-black">
                      <Tooltip title={staff.rank} placement="top">
                        <div>{staff.rank}</div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-black">
                      <Tooltip title={staff.role} placement="top">
                        <div>{staff.role}</div>
                      </Tooltip>
                    </TableCell>

                    <TableCell className="flex gap-2">
                      <Tooltip title="Edit Staff" placement="top">
                        <FaEdit
                          className="text-blue-600 size-5 cursor-pointer"
                          onClick={() => handleEdit(staff)}
                        />
                      </Tooltip>
                      <Tooltip title="Delete Staff" placement="top">
                        <RiDeleteBin6Line
                          className="text-red-500 size-5 cursor-pointer "
                          onClick={() => handleDeactive(staff)}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <TableCell colSpan={9}>
        Total Claims: {staff.length}
      </TableCell>
        <Pagination >
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

        {/* Confirmation Dialog for Deactivation */}
        <AlertDialog
          open={showConfirmationDialog}
          onOpenChange={setShowConfirmationDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deactivation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to deactivate this staff member? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={confirmSubmission}
                className="bg-red-700 text-white"
              >
                Deactivate
              </AlertDialogAction>
              <AlertDialogCancel
                onClick={cancelSubmission}
                className="bg-gray-100 text-gray-800"
              >
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

const allowedRoles = ["admin"];

export default withAuthorization(StaffConfig, allowedRoles);
