import { Card } from "@/components/ui/card";
import {
  FaCheckCircle,
  FaCreditCard,
  FaFirstdraft,
  FaHourglassHalf,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@components/ui/table.tsx";
import { Link, Navigate } from "react-router-dom";
import { AppDispatch } from "@/lib/redux/redux.config";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllClaimsByStaff } from "@/lib/redux/reducers/claims.reducer";
import { useNavigate } from "react-router-dom";
import withAuthorization from "@/lib/utils/withAuthorization";
import { getItemWithExpiry } from "@/lib/utils/storage.utils";
import { decryptData } from "@/lib/utils/auth.utils";

export interface Claim {
  status: string;
  staff_name: string;
  project_name: string;
  from: string;
  to: string;
  id: string;
  created_at: string;
}

const ClaimMainPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleClaim = (id: Number) => {
    navigate(`/claims/${id}`);
  };

  const encryptedData = getItemWithExpiry<string>("userData");

  if (!encryptedData) {
    console.log("No user data available or data has expired.");
    return <Navigate to="/login" replace />;
  }

  const decryptedData = decryptData(encryptedData);
  const userData = JSON.parse(decryptedData);

  useEffect(() => {
    dispatch(getAllClaimsByStaff(userData.id));
  }, []);

  const claimState = useSelector((state: any) => state.claim.claims);
  console.log(claimState)
  console.log(userData.id)

  const data: Claim[] = [];

  for (let i = claimState.length - 1; i >= 0; i--) {
    data.push({
      id: claimState[i].id,
      staff_name: claimState[i].staff.name,
      project_name: claimState[i].project.name,
      to: claimState[i].project.to,
      from: claimState[i].project.from,
      status: claimState[i].status,
      created_at: claimState[i].created_at
    });
  }

  const draft = data.filter((item) => item.status === "draft");
  const pending = data.filter((item) => item.status === "pending");
  const approved = data.filter((item) => item.status === "approved");
  const paid = data.filter((item) => item.status === "paid");
  const rejected = data.filter(
    (item) => item.status === "rejected" || item.status === "cancelled"
  );
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const format = (dateString: string) => {
    if (dateString){
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${day}/${month}/${year} - ${hour}:${minute}:${seconds}`;
    }
  }

  return (
    <div className="px-2 py-4 md:px-4">
      <div className="flex flex-col p-4">
        <div className="flex justify-around items-center">
          <Card className="transition-all hover:bg-[#007AAC] hover:text-white shadow-md hover:shadow-lg">
            <Link
              to={"/claims/draft"}
              className="p-4 flex flex-row justify-between items-center w-[130px] lg:w-[180px]"
            >
              <div className="flex flex-col gap-1 text-lg">
                <span className="font-bold">{draft.length}</span>
                <span>Draft</span>
              </div>
              <div>
                <span className="text-[30px] lg:text-[45px]">
                  <FaFirstdraft />
                </span>
              </div>
            </Link>
          </Card>
          <Card className="hover:bg-[#007AAC] hover:text-white shadow-md hover:shadow-lg">
            <Link
              to={"/claims/pending"}
              className="p-4 flex flex-row justify-between items-center w-[130px] lg:w-[180px]"
            >
              <div className="flex flex-col gap-1 text-lg">
                <span className="font-bold">{pending.length}</span>
                <span>Pending</span>
              </div>
              <div>
                <span className="text-[30px] lg:text-[45px]">
                  <FaHourglassHalf />
                </span>
              </div>
            </Link>
          </Card>
          <Card className="hover:bg-[#007AAC] hover:text-white shadow-md hover:shadow-lg">
            <Link
              to={"/claims/approved"}
              className="p-4 flex flex-row justify-between items-center w-[130px] lg:w-[180px]"
            >
              <div className="flex flex-col gap-1 text-lg">
                <span className="font-bold">{approved.length}</span>
                <span>Approved</span>
              </div>
              <div>
                <span className="text-[30px] lg:text-[35px]">
                  <FaCheckCircle />
                </span>
              </div>
            </Link>
          </Card>
          <Card className="hover:bg-[#007AAC] hover:text-white shadow-md hover:shadow-lg">
            <Link
              to={"/claims/paid"}
              className="p-4 flex flex-row justify-between items-center w-[130px] lg:w-[180px]"
            >
              <div className="flex flex-col gap-1 text-lg">
                <span className="font-bold">{paid.length}</span>
                <span>Paid</span>
              </div>
              <div>
                <span className="text-[30px] lg:text-[40px]">
                  <FaCreditCard />
                </span>
              </div>
            </Link>
          </Card>
          <Card className="hover:bg-[#007AAC] hover:text-white shadow-md hover:shadow-lg">
            <Link
              to={"/claims/rejected-cancelled"}
              className="p-4 flex flex-row justify-between items-center w-[130px] lg:w-[180px]"
            >
              <div className="flex flex-col gap-1 text-lg">
                <span className="font-bold">{rejected.length}</span>
                <span>Rejected</span>
              </div>
              <div>
                <span className="text-[30px] lg:text-[40px]">
                  <MdCancel />
                </span>
              </div>
            </Link>
          </Card>
        </div>
        <div className="overflow-x-auto px-8 my-10 mx-8 py-5 bg-white rounded-md">
          <span className="font-semibold text-2xl pb-3">Recent Claims</span>
          <Table className="min-w-full divide-y">
            <TableHeader className="bg-white">
              <TableRow>
                <TableHead className="text-black font-bold">Claim ID</TableHead>
                <TableHead className="text-black font-bold">
                  Project Name
                </TableHead>
                <TableHead className="text-black font-bold">From</TableHead>
                <TableHead className="text-black font-bold">To</TableHead>
                <TableHead className="text-black font-bold">
                  Created At
                </TableHead>
                <TableHead
                  className="text-black font-bold cursor-pointer"
                  style={{ textAlign: "center", width: "200px" }}
                >
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 5).map((claim, index) => (
                <TableRow
                  key={claim.id}
                  className={index % 2 === 0 ? "bg-[#F7F6FE]" : "bg-white"}
                  onClick={() => {
                    handleClaim(Number(claim.id));
                  }}
                >
                  <TableCell>{claim.id}</TableCell>
                  <TableCell>{claim.project_name}</TableCell>
                  <TableCell>{formatDate(claim.from)}</TableCell>
                  <TableCell>{formatDate(claim.to)}</TableCell>
                  <TableCell>{format(claim.created_at)}</TableCell>
                  <TableCell align="center">
                    {claim.status.toLocaleUpperCase()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
const allowedRoles = ["claimer"];

export default withAuthorization(ClaimMainPage, allowedRoles);
