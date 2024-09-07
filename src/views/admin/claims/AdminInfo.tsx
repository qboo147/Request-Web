/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@components/ui/table.tsx";
import { AppDispatch, RootState } from "@/lib/redux/redux.config";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getClaim } from "@/lib/redux/reducers/claims.reducer";
import { useSelector } from "react-redux";
import { getStaff } from "@/lib/redux/reducers/staff.reducer";
import withAuthorization from "@/lib/utils/withAuthorization";

const AdminClaimInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const claim_id = location.pathname.split("/")[3];

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getClaim(Number(claim_id)));
  }, [claim_id]);

  const currentClaim = useSelector(
    (state: RootState) => state.claim.currentClaim
  );

  const staffId = currentClaim?.staff.id;

  useEffect(() => {
    dispatch(getStaff(Number(staffId)));
  }, [staffId]);

  const staffRole = useSelector(
    (state: RootState) => state.staff.currentStaff?.role
  );

  console.log(currentClaim?.project.from);

  let totalWorkingHours = 0;

  if (currentClaim?.records) {
    for (let i = 0; i < currentClaim?.records?.length; i++) {
      totalWorkingHours =
        totalWorkingHours +
        Math.ceil(
          (new Date(currentClaim?.records[i].to).getTime() -
            new Date(currentClaim?.records[i].from).getTime()) /
            (1000 * 60 * 60)
        );
    }
  }

  let projectDuration = 0;
  if (currentClaim?.project) {
    const fromDate = new Date(currentClaim.project.from);
    const toDate = new Date(currentClaim.project.to);

    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
      projectDuration = Math.ceil(
        (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    }
  }

  console.log(projectDuration);

  const from = location.state?.from || "/admin/claims";

  const handleBack = () => {
    navigate(from);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="px-2 py-4 md:px-4">
      <div className="flex flex-col p-4 rounded bg-white shadow-lg">
        <div className="w-full flex justify-between items-center mb-4 text-black">
          <div className="text-lg hover:shadow-lg p-2 rounded-md">
            <IoArrowBackOutline onClick={handleBack} />
          </div>
          <div className="pr-2">
            <span>Claim Status: </span>
            <span className="text-[#007AAC] font-semibold">
              {currentClaim?.status}
            </span>
          </div>
        </div>
        <div className="p-3 flex justify-evenly items-center">
          <div className="flex flex-col gap-7">
            <div className="grid grid-cols-2 gap-10">
              <div className="flex justify-between items-center gap-10">
                <div className="flex flex-col gap-2 w-[165px]">
                  <span className="font-medium">Claim ID</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {currentClaim?.id}
                  </span>
                </div>
                <div className="flex flex-col gap-2 w-[317px]">
                  <span className="font-medium">Project Name</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {currentClaim?.project.name}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center gap-10">
                <div className="flex flex-col gap-2 w-[165px]">
                  <span className="font-medium">Staff ID</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {currentClaim?.staff.id}
                  </span>
                </div>
                <div className="flex flex-col gap-2 w-[317px]">
                  <span className="font-medium">Staff Name</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {currentClaim?.staff.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-10">
              <div className="flex justify-between items-center gap-10">
                <div className="flex flex-col gap-2 w-[240px]">
                  <span className="font-medium">Project Duration</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {projectDuration} days
                  </span>
                </div>
                <div className="flex flex-col gap-2 w-[240px]">
                  <span className="font-medium">Role in Project</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {staffRole}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center gap-10">
                <div className="flex flex-col gap-2 w-[317px]">
                  <span className="font-medium">Staff Department</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {currentClaim?.staff.department}
                  </span>
                </div>
                <div className="flex flex-col gap-2 w-[165px]">
                  <span className="font-medium">Total Working Hour</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {totalWorkingHours} hours
                  </span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto shadow-md rounded-md p-2 pt-1">
              <span className="text-xl pb-3">Claims</span>
              <Table className="min-w-full divide-y">
                <TableHeader className="bg-white">
                  <TableRow>
                    <TableHead className="text-black font-bold">Date</TableHead>
                    <TableHead className="text-black font-bold">Day</TableHead>
                    <TableHead className="text-black font-bold">From</TableHead>
                    <TableHead className="text-black font-bold">To</TableHead>
                    <TableHead className="text-black font-bold">
                      Total No. of Hours
                    </TableHead>
                    <TableHead className="text-black font-bold">
                      Remarks
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentClaim?.records.map((detail, index) => (
                    <TableRow
                      key={index}
                      className={index % 2 === 0 ? "bg-[#F7F6FE]" : "bg-white"}
                    >
                      <TableCell>{formatDate(detail.date)}</TableCell>
                      <TableCell>{detail.day}</TableCell>
                      <TableCell>{detail.from.toLocaleString()}</TableCell>
                      <TableCell>{detail.to.toLocaleString()}</TableCell>
                      <TableCell>
                        {(new Date(detail.to).getTime() -
                          new Date(detail.from).getTime()) /
                          (1000 * 60 * 60)}{" "}
                      </TableCell>
                      <TableCell>{detail.remarks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="grid grid-cols-2 gap-10">
              <div className="flex items-center gap-10">
                <div className="flex flex-col gap-2 w-full">
                  <span className="font-medium">Remarks</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {currentClaim?.remarks}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const allowedRoles = ["admin"];

export default withAuthorization(AdminClaimInfo, allowedRoles);
