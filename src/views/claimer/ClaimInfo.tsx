import { IoArrowBackOutline } from "react-icons/io5";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@components/ui/table.tsx";

import { useDispatch, useSelector } from "react-redux"; 
import { AppDispatch, RootState } from "@/lib/redux/redux.config";

import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

import { getClaim } from "@/lib/redux/reducers/claims.reducer";
import toast from "react-hot-toast";
import { getStaff } from "@/lib/redux/reducers/staff.reducer";
import withAuthorization from "@/lib/utils/withAuthorization";
import { getItemWithExpiry } from "@/lib/utils/storage.utils";
import { decryptData } from "@/lib/utils/auth.utils";

const ClaimInfo = () => {
  const { claim_id } = useParams();

  const dispatch: AppDispatch = useDispatch();
  const claims = useSelector((state: RootState) => state.claim.currentClaim);
  const encryptedData = getItemWithExpiry<string>("userData");

  if (!encryptedData) {
    console.log("No user data available or data has expired.");
    return <Navigate to="/login" replace />;
  }

  const decryptedData = decryptData(encryptedData);
  const userData = JSON.parse(decryptedData);

  useEffect(() => {
    if (claim_id) {
      dispatch(getClaim(Number(claim_id)));
    } else {
      toast.error("Claim ID not found", {
        duration: 5000,
        position: "top-right",
      });
    }
  }, [dispatch]);

  const handleBack = () => {
    window.history.back();
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
              {claims?.status}
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
                    {claims?.id}
                  </span>
                </div>
                <div className="flex flex-col gap-2 w-[317px]">
                  <span className="font-medium">Project Name</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {claims?.project.name}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center gap-10">
                <div className="flex flex-col gap-2 w-[165px]">
                  <span className="font-medium">Staff ID</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {userData.id}
                  </span>
                </div>
                <div className="flex flex-col gap-2 w-[317px]">
                  <span className="font-medium">Staff Name</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {userData.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-10">
              <div className="flex justify-between items-center gap-10">
                <div className="flex flex-col gap-2 w-[240px]">
                  <span className="font-medium">Project Duration</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {claims?.project &&
                      Math.ceil(
                        (new Date(claims.project.to).getTime() -
                          new Date(claims.project.from).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                    days
                  </span>
                </div>
                <div className="flex flex-col gap-2 w-[240px]">
                  <span className="font-medium">Role in Project</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {userData.rank.toLocaleUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center gap-10">
                <div className="flex flex-col gap-2 w-[317px]">
                  <span className="font-medium">Staff Department</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {userData.department}
                  </span>
                </div>
                <div className="flex flex-col gap-2 w-[165px]">
                  <span className="font-medium">Total Working Hour</span>
                  <span className="p-2 border border-gray-200 rounded-md h-[40px]">
                    {claims?.records.reduce(
                      (total, record) =>
                        total +
                        (new Date(record.to).getTime() -
                          new Date(record.from).getTime()) /
                          (1000 * 60 * 60),
                      0
                    )}{" "}
                    hours
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
                    <TableHead className="text-black font-bold">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims?.records.map((detail, index) => (
                    <TableRow
                      key={index}
                      className={index % 2 === 0 ? "bg-[#F7F6FE]" : "bg-white"}
                    >
                      <TableCell>
                        {new Date(detail.date).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell>
                        {new Date(detail.date).toLocaleDateString("en-us", {
                          weekday: "short",
                        })}
                      </TableCell>
                      <TableCell>
                        {new Date(detail.from).toLocaleString("en-GB")}
                      </TableCell>
                      <TableCell>
                        {new Date(detail.to).toLocaleString("en-GB")}
                      </TableCell>
                      <TableCell>
                        {(new Date(detail.to).getTime() -
                          new Date(detail.from).getTime()) /
                          (1000 * 60 * 60)}{" "}
                        hours
                      </TableCell>
                      <TableCell>{detail.remarks}</TableCell>
                      <TableCell>{detail.money ? `$${detail.money.toFixed(2)}` : ''}</TableCell>
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
                    {claims?.remarks}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <span className="font-medium">
                  Total Money: {claims?.total_money ? `$${claims.total_money.toFixed(2)}` : `$${claims?.records.reduce((total, record) => total + record.money, 0).toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end items-center mt-5">
        <button
          onClick={handleBack}
          className="p-2 mx-3 rounded-md bg-[#007AAC] text-white w-[120px] flex justify-center items-center hover:shadow-md transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};
const allowedRoles = ["claimer"];

export default withAuthorization(ClaimInfo, allowedRoles);
