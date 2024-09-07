/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { sampleData } from "@/lib/mock/approvedpaid.mock";
import { FaSort, FaSortUp, FaSortDown, FaSearch } from "react-icons/fa";
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
import {
  getPendingClaims,
  updateClaim,
} from "@/lib/redux/reducers/claims.reducer";
import { Button, Checkbox, Input, Modal, Tooltip } from "antd";
import toast from "react-hot-toast";
import { Claim } from "@/lib/schemas/claim.schema";
import TableChecked from "@components/TableChecked";
import withAuthorization from "@/lib/utils/withAuthorization";

type SortConfig = {
  key: "id" | "project" | "staff" | "records" | "total_money" | "status" | null;
  direction: "asc" | "desc";
  subKey?: keyof Claim["project"] | keyof Claim["staff"] | "length";
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

const truncateText = (text: string, maxLength: number) => {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
};

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
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
  const [totalPages, setTotalPages] = useState(
    Math.ceil(sampleData.length / itemsPerPage)
  );
  const handleRowClick = (claim: Claim) => {
    navigate(`/approver/claim/${claim.id}`, { state: { claim } });
  };

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getPendingClaims());
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
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleCheckboxChange = (event: CheckboxChangeEvent, id: number) => {
    const { checked } = event.target;
    setCheckedItems({ ...checkedItems, [id]: checked });
  };

  const handleCheckboxAllChange = (event: CheckboxChangeEvent) => {
    const { checked } = event.target;
    const updatedCheckedItems: { [key: number]: boolean } = {};
    claimState.forEach((item: Claim) => {
      updatedCheckedItems[item.id as any] = checked;
    });
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      ...updatedCheckedItems,
    }));
  };
  const [checkall, setcheckall] = useState(false);
  useEffect(() => {
    // checkbox nao chua check thi xu ly
    if (Object.keys(checkedItems).some((key) => !checkedItems[key as any])) {
      setcheckall(false);
    }
    //khong co checkbox nao chua check va mang ton tai thi xu ly
    else {
      if (
        Object.keys(checkedItems).length > 0 &&
        Object.keys(checkedItems).length == claimState.length
      ) {
        setcheckall(true);
      }
    }
  }, [checkedItems, claimState.length]);
  //return 1 claim with remark
  const [openReturn1, setOpenReturn1] = useState(false);
  const showReturn1 = () => {
    setOpenReturn1(true);
  };
  const hideReturn1 = () => {
    setOpenReturn1(false);
    setremarkinput("");
    setshowalert(false);
    setremarked(false);
  };
  const confirmReturn1 = () => {
    if (!remarked) {
      setshowalert(true);
    } else {
      hideReturn1();
      showReturn2();
    }
  };

  const [remarked, setremarked] = useState(false);
  const [remarkinput, setremarkinput] = useState("");
  //do remark input hide modal se lam moi ve ""
  const [remarktodatabase, setremarktodatabase] = useState("");
  const [showalert, setshowalert] = useState(false);

  //return checked claim with remark
  const [openReturn11, setOpenReturn11] = useState(false);
  const showReturn11 = () => {
    setOpenReturn11(true);
  };
  const hideReturn11 = () => {
    setOpenReturn11(false);
    setremarkinput("");
    setshowalert(false);
    setremarked(false);
  };
  const confirmReturn11 = () => {
    if (!remarked) {
      setshowalert(true);
    } else {
      hideReturn11();
      showReturn21();
    }
  };

  //confirm return 1 claim
  const [openReturn2, setOpenReturn2] = useState(false);
  const showReturn2 = () => {
    setOpenReturn2(true);
  };
  //return confirm return checked claim
  const [openReturn21, setOpenReturn21] = useState(false);
  const showReturn21 = () => {
    setOpenReturn21(true);
  };

  //confirm return 1 claim
  const hideReturn2 = () => {
    setOpenReturn2(false);
  };
  const confirmReturn2 = () => {
    hideReturn2();
    console.log(idclickedclaim);

    toast.success("Return success", {
      position: "top-right",
    });
    handleUpdateClaim();
  };

  //confirm return checked claims

  const hideReturn21 = () => {
    setOpenReturn21(false);
  };
  const confirmReturn21 = () => {
    hideReturn21();
    handleUpdateClaims();
    toast.success("Return success", {
      position: "top-right",
    });
  };

  //approve 1 claim
  const [openApprove, setOpenApprove] = useState(false);
  const showApprove = () => {
    setOpenApprove(true);
  };

  const hideApprove = () => {
    setOpenApprove(false);
  };
  const confirmApprove = () => {
    hideApprove();
    toast.success("Approve success", {
      position: "top-right",
    });
    handleUpdateClaim();
  };

  //approve checkbox
  const [openApprovecheckbox, setOpenApprovecheckbox] = useState(false);
  const showApprovecheckbox = () => {
    setOpenApprovecheckbox(true);
  };

  const hideApprovecheckbox = () => {
    setOpenApprovecheckbox(false);
  };
  const confirmApprovecheckbox = () => {
    hideApprovecheckbox();
    handleUpdateClaims();
    toast.success("Approve success", {
      position: "top-right",
    });
  };

  //delete 1 claim
  const [openDelete, setOpenDelete] = useState(false);
  const showDelete = () => {
    setOpenDelete(true);
  };

  const hideDelete = () => {
    setOpenDelete(false);
  };
  const confirmDelete = () => {
    hideDelete();
    console.log(idclickedclaim);
    toast.success("Reject success", {
      position: "top-right",
    });

    handleUpdateClaim();
  };

  //delete checkbox
  const [openDelete1, setOpenDelete1] = useState(false);
  const showDelete1 = () => {
    setOpenDelete1(true);
  };

  const hideDelete1 = () => {
    setOpenDelete1(false);
  };
  const confirmDelete1 = () => {
    hideDelete1();
    handleUpdateClaims();
    toast.success("Reject success", {
      position: "top-right",
    });
  };

  const [idclickedclaim, setidclickedclaim] = useState<number>(0);
  const [status, setstatus] = useState("");
  const [claimclicked, setclaimclicked] = useState<Claim>();
  const [claimsclicked, setclaimsclicked] = useState<Claim[]>();

  useEffect(() => {
    // Extract the keys (IDs) from the checkedItems object
    const checkedIDs = Object.keys(checkedItems)
      .filter((key) => checkedItems[+key]) // Filter only checked items
      .map((key) => +key); // Convert keys to numbers

    // Filter claims where the id is in the checkedIDs array
    const filteredClaims = claimState.filter((item: Claim) => {
      if (typeof item.id === "string") {
        return checkedIDs.includes(parseInt(item.id, 10));
      } else {
        console.error("Invalid or missing claim ID:", item.id);
        return false;
      }
    });

    // Set the filtered claims, or handle them as needed
    setclaimsclicked(filteredClaims);
  }, [checkedItems, claimState, setclaimsclicked]);

  useEffect(() => {
    const filterclaim = claimState.filter((item: Claim) => {
      if (typeof item.id === "string") {
        return parseInt(item.id, 10) == idclickedclaim;
      } else {
        console.error("Invalid or missing claim ID:", item.id);
        return false;
      }
    });

    setclaimclicked(filterclaim[0]);
  }, [claimState, idclickedclaim]);

  const handleUpdateClaim = async () => {
    const claim_id = idclickedclaim; // Example claim ID
    if (claimclicked?.staff) {
      const formData = {
        // The data you want to update
        status: status,
        staff: claimclicked?.staff,
        project: claimclicked?.project,
        records: claimclicked?.records,
        remarks: status == "return" ? remarktodatabase : claimclicked?.remarks,
        total_money: claimclicked?.total_money,
        created_at: claimclicked?.created_at,
        updated_at: claimclicked?.updated_at,
        id: idclickedclaim.toString(),
      };

      console.log(formData);
      await dispatch(updateClaim({ claim_id, formData }));
    }

    //ko load bang claimstate ma dung mang khac => luc change claim state ko thay doi ma phai reload
    setTimeout(() => {
      window.location.reload();
    }, 500);
    console.log(remarktodatabase);
  };

  const handleUpdateClaims = async () => {
    const checkedIDs = Object.keys(checkedItems)
      .filter((key) => checkedItems[+key]) // Filter only checked items
      .map((key) => +key); // Convert keys to numbers
    for (let i = 0; i < checkedIDs.length; i++) {
      const claim_id = checkedIDs[i]; // Example claim ID
      if (claimsclicked?.[i]?.staff) {
        const formData = {
          // The data you want to update
          status: status,
          staff: claimsclicked?.[i]?.staff,
          project: claimsclicked?.[i]?.project,
          records: claimsclicked?.[i]?.records,
          remarks:
            status == "return" ? remarktodatabase : claimsclicked?.[i]?.remarks,
          total_money: claimsclicked?.[i]?.total_money,
          created_at: claimsclicked?.[i]?.created_at,
          updated_at: claimsclicked?.[i]?.updated_at,
          id: claim_id.toString(),
        };

        console.log(formData);

        await dispatch(updateClaim({ claim_id, formData }));
      }
    }

    //ko load bang claimstate ma dung mang khac => luc change claim state ko thay doi ma phai reload

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div>
      {/* modal return with remark */}
      <Modal
        title="Return Request"
        open={openReturn1}
        onOk={confirmReturn1}
        onCancel={hideReturn1}
      >
        <div className="flex flex-row">
          <p className="mb-2.5 mr-0.75">Remark</p>
          <p className="text-red-500">*</p>
        </div>

        <Input
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              confirmReturn1();
            }
          }}
          value={remarkinput}
          onChange={(e) => {
            setremarkinput(e.target.value);
            setremarktodatabase(e.target.value);
            if (e.target.value == "") {
              setremarked(false);
            } else {
              setremarked(true);
            }
          }}
        />

        {showalert ? (
          <p style={{ color: "red" }}>
            Please input your remarks in order to return Claim.
          </p>
        ) : (
          <></>
        )}
      </Modal>
      {/* modal return checked claim with remark */}
      <Modal
        title="Return Request"
        open={openReturn11}
        onOk={confirmReturn11}
        onCancel={hideReturn11}
      >
        <div className="flex flex-row">
          <p className="mb-2.5 mr-0.75">Remark</p>
          <p className="text-red-500">*</p>
        </div>

        <Input
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              confirmReturn11();
            }
          }}
          value={remarkinput}
          onChange={(e) => {
            setremarkinput(e.target.value);
            setremarktodatabase(e.target.value);
            if (e.target.value == "") {
              setremarked(false);
            } else {
              setremarked(true);
            }
          }}
        />

        {showalert ? (
          <p className="text-red-500">
            Please input your remarks in order to return Claim.
          </p>
        ) : (
          <></>
        )}
      </Modal>

      {/* modal confirm return 1 claim*/}
      <Modal
        title="Confirm"
        open={openReturn2}
        onOk={confirmReturn2}
        onCancel={hideReturn2}
      >
        Are you sure want to continue this action?
      </Modal>
      {/* modal return confirm return checked claim*/}

      <Modal
        title="Confirm"
        open={openReturn21}
        onOk={confirmReturn21}
        onCancel={hideReturn21}
      >
        This action will return claims below:
        <div className="overflow-auto max-h-[30vh]">
          <TableChecked checkedItems={checkedItems} claimState={claimState} />
        </div>
        <p className="mt-2.5">
          Please click ‘Ok’ to return the claim or ‘Cancel’ to close the dialog.
        </p>
      </Modal>

      {/* modal approve 1 claim*/}
      <Modal
        title="Confirm"
        open={openApprove}
        onOk={confirmApprove}
        onCancel={hideApprove}
      >
        This action will approve Claim
        <div></div>
        Please click ‘Ok’ to approve the claim or ‘Cancel’ to close the dialog.
      </Modal>
      {/* modal approve checkbox*/}
      <Modal
        title="Confirm"
        open={openApprovecheckbox}
        onOk={confirmApprovecheckbox}
        onCancel={hideApprovecheckbox}
      >
        This action will approve claims below:
        <div className="overflow-auto max-h-[30vh]">
          <TableChecked claimState={claimState} checkedItems={checkedItems} />
        </div>
        <p className="mt-2.5">
          Please click ‘Ok’ to approve the claim or ‘Cancel’ to close the
          dialog.
        </p>
      </Modal>

      {/* modal reject 1 claim*/}
      <Modal
        title="Confirm"
        open={openDelete}
        onOk={confirmDelete}
        onCancel={hideDelete}
      >
        This action will reject Claim
        <div></div>
        Please click ‘Ok’ to reject the claim or ‘Cancel’ to close the dialog.
      </Modal>

      {/* modal reject checkbox*/}

      <Modal
        title="Confirm"
        open={openDelete1}
        onOk={confirmDelete1}
        onCancel={hideDelete1}
      >
        This action will reject claims below:
        <div className="overflow-auto max-h-[30vh]">
          <TableChecked checkedItems={checkedItems} claimState={claimState} />
        </div>
        <p className="mt-2.5">
          Please click ‘Ok’ to reject the claim or ‘Cancel’ to close the dialog.
        </p>
      </Modal>

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
                <TableHead className="w-[50px] overflow-hidden text-ellipsis whitespace-nowrap text-black">
                  <div className="flex justify-between items-center">
                    <Checkbox
                      checked={checkall}
                      onChange={(e) => {
                        setcheckall(!checkall);
                        handleCheckboxAllChange(e);
                      }}
                    />
                  </div>
                </TableHead>
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
                  <TableRow key={claim.id} className="cursor-pointer">
                    <TableCell className="truncate ... text-black underline hover:text-blue-700">
                      <Checkbox
                        checked={checkedItems[claim.id as any] || false}
                        onChange={(event) => {
                          handleCheckboxChange(event, claim.id as any);
                        }}
                      />
                    </TableCell>
                    <TableCell className="truncate ... text-black underline hover:text-blue-700">
                      <div onClick={() => handleRowClick(claim)}>
                        <Tooltip title={claim.id}>{claim.id}</Tooltip>{" "}
                      </div>
                    </TableCell>
                    <TableCell className="truncate ...">
                      <div onClick={() => handleRowClick(claim)}>
                        <Tooltip title={claim.project.name}>
                          <span className="block max-w-[100px] truncate">
                            {truncateText(claim.project.name, 20)}
                          </span>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell className="truncate ...  ">
                      <div onClick={() => handleRowClick(claim)}>
                        <Tooltip title={claim.staff.name}>
                          <span className="block max-w-[100px] truncate">
                            {claim.staff.name}
                          </span>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div onClick={() => handleRowClick(claim)}>
                        <Tooltip title={formatDate(claim.project.from)}>
                          {formatDate(claim.project.from)}
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div onClick={() => handleRowClick(claim)}>
                        <Tooltip title={formatDate(claim.project.to)}>
                          {formatDate(claim.project.to)}
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-3">
                      <div onClick={() => handleRowClick(claim)}>
                        <Tooltip title={claim.records.length.toString()}>
                          {claim.records.length}
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell className="text-right number-cell">
                      <div onClick={() => handleRowClick(claim)}>
                        <Tooltip title={formatNumber(claim.total_money)}>
                          {formatNumber(claim.total_money)}
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell
                      style={{
                        display: "flex",
                        textAlign: "end",
                        justifyContent: "center",
                      }}
                      className="text-right"
                    >
                      <Tooltip title="Approve claim">
                        <img
                          src="/images/Approve.svg"
                          style={{ width: 25, marginRight: 5 }}
                          onClick={() => {
                            showApprove();
                            setidclickedclaim(claim.id as any);
                            setstatus("approved");
                          }}
                        />
                      </Tooltip>

                      <Tooltip title="Return claim">
                        <img
                          onClick={() => {
                            showReturn1();
                            setidclickedclaim(claim.id as any);
                            setstatus("return");
                          }}
                          src="/images/Return.svg"
                          style={{ width: 25, marginRight: 5 }}
                        />
                      </Tooltip>
                      <Tooltip title="Reject claim">
                        <img
                          src="/images/Reject.svg"
                          style={{ width: 25 }}
                          onClick={() => {
                            showDelete();
                            setidclickedclaim(claim.id as any);
                            setstatus("rejected");
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <TableCell colSpan={9}>Total Claims: {claimState.length}</TableCell>
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
      <div className="w-full flex justify-end mt-4 px-2">
        {/* 3 button */}
        <Button
          className="mr-5 text-lg text-white bg-blue-600 w-40 p-5"
          onClick={() => {
            setstatus("approved");
            // tat ca checkbox chua check thi xu ly
            if (
              Object.keys(checkedItems).every(
                (key) => !checkedItems[key as any]
              )
            ) {
              toast.error("No checkbox selected", {
                position: "top-right",
              });
              return;
            }
            //khong co checkbox thi xu ly

            if (checkedItems[0] != null) {
              toast.error("No checkbox selected", {
                position: "top-right",
              });
              return;
            }

            showApprovecheckbox();
          }}
        >
          Approve Claims
        </Button>
        <Button
          className="mr-5 text-lg w-40 p-5"
          onClick={() => {
            setstatus("return");
            if (
              Object.keys(checkedItems).every(
                (key) => !checkedItems[key as any]
              )
            ) {
              toast.error("No checkbox selected", {
                position: "top-right",
              });
              return;
            }
            //khong co checkbox thi xu ly

            if (checkedItems[0] != null) {
              toast.error("No checkbox selected", {
                position: "top-right",
              });
              return;
            }
            showReturn11();
          }}
        >
          Return Claims
        </Button>
        <Button
          className="mr-5 mb-5 text-lg text-white bg-red-800 w-40 p-5"
          onClick={() => {
            setstatus("rejected");
            // tat ca checkbox chua check thi xu ly
            if (
              Object.keys(checkedItems).every(
                (key) => !checkedItems[key as any]
              )
            ) {
              toast.error("No checkbox selected", {
                position: "top-right",
              });
              return;
            }
            //khong co checkbox thi xu ly

            if (checkedItems[0] != null) {
              toast.error("No checkbox selected", {
                position: "top-right",
              });
              return;
            }
            showDelete1();
          }}
        >
          Reject Claims
        </Button>
      </div>
    </div>
  );
};

const allowedRoles = ["approver"];

export default withAuthorization(ClaimsApprovedPaid, allowedRoles);
