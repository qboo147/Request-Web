import { useState, useMemo, useEffect } from "react";
import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from "react-icons/ti";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  // TableFooter,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alertDialog";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/redux.config";

import {
  getDraftClaimsByStaff,
  cancelClaim,
  cancelClaims,
  submitClaims,
} from "@/lib/redux/reducers/claims.reducer";
import withAuthorization from "@/lib/utils/withAuthorization";
import { getItemWithExpiry } from "@/lib/utils/storage.utils";
import { decryptData } from "@/lib/utils/auth.utils";

type SortDirection = "asc" | "desc" | "none";

const ClaimsDraft = () => {
  const [parPage, setParPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [showConfirmationDialog, setShowConfirmationDialog] =
    useState<boolean>(false);
  const [showSelectDeleteDialog, setShowSelectDeleteDialog] =
    useState<boolean>(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");

  const dispatch: AppDispatch = useDispatch();
  const claims = useSelector((state: RootState) => state.claim.claims);

  const encryptedData = getItemWithExpiry<string>("userData");

  if (!encryptedData) {
    console.log("No user data available or data has expired.");
    return <Navigate to="/login" replace />;
  }

  const decryptedData = decryptData(encryptedData);
  const userData = JSON.parse(decryptedData);

  useEffect(() => {
    dispatch(getDraftClaimsByStaff(userData.id));
  }, []);

  const filteredData = useMemo(() => {
    return claims.filter(
      (claim) =>
        claim.id?.toString().includes(searchQuery) ||
        claim.staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, claims]);

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

  // Handle Pagination
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
  
  const handleSelectAll = () => {
    if (
      selectedIds.length === filteredData.length &&
      filteredData.length !== 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((claim) => Number(claim.id)));
    }
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  // Handle Delete ID
  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      dispatch(cancelClaim(deleteId)).then(() => {
        dispatch(getDraftClaimsByStaff(userData.id));
      });

      toast.success("Delete successfully", {
        position: "top-right",
      });

      setDeleteId(null);
      setShowDeleteDialog(false);
    }
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setShowDeleteDialog(false);
  };
  // end Delete ID

  // Handle Submit IDs
  const handleSubmit = () => {
    if (selectedIds.length > 0) {
      setShowConfirmationDialog(true);
    } else {
      toast.error("No claims selected", {
        position: "top-right",
      });
    }
  };

  const confirmSubmission = () => {
    dispatch(submitClaims([...selectedIds])).then(() =>
      dispatch(getDraftClaimsByStaff(userData.id))
    );

    toast.success("Claims submitted successfully", {
      position: "top-right",
    });

    setSelectedIds([]);
    setShowConfirmationDialog(false);
  };

  const cancelSubmission = () => {
    setShowConfirmationDialog(false);
  };
  // end Submit IDs

  // Handle Delete IDs
  const handleDeleteSelected = () => {
    if (selectedIds.length > 0) {
      setShowSelectDeleteDialog(true);
    } else {
      toast.error("No claims selected", {
        position: "top-right",
      });
    }
  };

  const confirmDeleteSelected = () => {
    dispatch(cancelClaims([...selectedIds])).then(() =>
      dispatch(getDraftClaimsByStaff(userData.id))
    );

    toast.success("Claims deleted successfully", {
      position: "top-right",
    });

    setSelectedIds([]);
    setShowSelectDeleteDialog(false);
  };

  const cancelDeleteSelected = () => {
    setShowSelectDeleteDialog(false);
  };
  // end Delete IDs

  useEffect(() => {
    if (paginatedData.length === 0 && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }, [paginatedData, currentPage]);

  return (
    <div className="px-2 py-4 md:px-4">
      <div className="flex flex-col p-4 rounded-lg bg-white shadow-lg">
        {/* Top section */}
        <div className="mb-4 text-black">
          <h2 className="text-2xl font-bold mb-2">Draft</h2>
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
              placeholder="Search "
              width={500}
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-h-96">
          <Table className="min-w-full divide-y">
            <TableHeader className="bg-white select-none">
              <TableRow>
                <TableHead className="text-black font-bold">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredData.length}
                    onChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead
                  className=" overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => handleSort("id")}
                  style={{ width: "200px" }}
                >
                  <div className="flex justify-between items-center">
                    Claim ID {renderSortIcon("id")}
                  </div>
                </TableHead>
                <TableHead
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => handleSort("staff_name")}
                  style={{ width: "200px" }}
                >
                  <div className="flex justify-between items-center">
                    Staff Name {renderSortIcon("staff_name")}
                  </div>
                </TableHead>
                <TableHead
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => handleSort("project_name")}
                  style={{ width: "200px" }}
                >
                  <div className="flex justify-between items-center">
                    Project Name {renderSortIcon("project_name")}
                  </div>
                </TableHead>
                <TableHead
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => handleSort("project_duration_from")}
                  style={{ width: "150px" }}
                >
                  <div className="flex justify-between items-center">
                    From {renderSortIcon("project_duration_from")}
                  </div>
                </TableHead>
                <TableHead
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => handleSort("project_duration_to")}
                  style={{ width: "150px" }}
                >
                  <div className="flex justify-between items-center">
                    To {renderSortIcon("project_duration_to")}
                  </div>
                </TableHead>
                <TableHead
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => handleSort("record")}
                  style={{ width: "200px" }}
                >
                  <div className="flex justify-between items-center">
                    Total Hours {renderSortIcon("record")}
                  </div>
                </TableHead>
                <TableHead className="overflow-hidden text-center whitespace-nowrap">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((claim, index) => (
                <TableRow
                  key={claim.id}
                  className={index % 2 === 0 ? "bg-[#F7F6FE]" : "bg-white"}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(Number(claim.id))}
                      onChange={() => handleSelect(Number(claim.id))}
                    />
                  </TableCell>
                  <TableCell>
                    {/* <Link
                      className="hover:underline hover:text-blue-500"
                      to={`/claims/${claim.id}`}
                    > */}
                    {claim.id}
                    {/* </Link> */}
                  </TableCell>
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
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link to={`/claims/edit/${claim.id}`}>
                        <LiaEditSolid className="text-3xl h-[25px] hover:text-blue-800 cursor-pointer text-blue-500" />
                      </Link>
                      <RiDeleteBin6Line
                        className="text-2xl hover:text-red-800 cursor-pointer text-red-500"
                        onClick={() => handleDelete(Number(claim.id))}
                      />
                    </div>
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
        <div className="flex flex-col">
          <Pagination className="mt-4 items-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
                        className={
                          currentPage === page ? "text-white bg-[#0077AC]" : ""
                        }
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="flex gap-2 justify-end items-center mt-4">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#007ACC] text-white rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-[#F83033] text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Dialog */}

        {/* Confirmation Dialog for Submission */}
        <AlertDialog
          open={showConfirmationDialog}
          onOpenChange={setShowConfirmationDialog}
        >
          <AlertDialogTrigger asChild></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit the selected claims? This action
                cannot be undone.
                {selectedIds.length > 0 && (
                  <ul className="mt-2 overflow-auto max-h-96">
                    {selectedIds.map((id) => (
                      <li key={id}>Claim ID: {id}</li>
                    ))}
                  </ul>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={confirmSubmission}
                className="bg-[#0077AC]"
              >
                Submit
              </AlertDialogAction>
              <AlertDialogCancel
                onClick={cancelSubmission}
                className="bg-white"
              >
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Confirmation Dialog for Deletion */}
        <AlertDialog
          open={showSelectDeleteDialog}
          onOpenChange={setShowSelectDeleteDialog}
        >
          <AlertDialogTrigger asChild></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the selected claims? This action
                cannot be undone.
                {selectedIds.length > 0 && (
                  <ul className="mt-2 overflow-auto max-h-96">
                    {selectedIds.map((id) => (
                      <li key={id}>Claim ID: {id}</li>
                    ))}
                  </ul>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={confirmDeleteSelected}
                className="bg-[#F83033]"
              >
                Delete
              </AlertDialogAction>
              <AlertDialogCancel
                onClick={cancelDeleteSelected}
                className="bg-white"
              >
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Confirmation Dialog for Deletion */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogTrigger asChild>
            {/* Trigger logic if needed */}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to delete claim ID: {deleteId}.
                <br />
                This action cannot be undone. This will permanently delete this
                claim.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-[#F83033]"
              >
                Delete
              </AlertDialogAction>
              <AlertDialogCancel onClick={cancelDelete} className="bg-white">
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
const allowedRoles = ["claimer"];

export default withAuthorization(ClaimsDraft, allowedRoles);
