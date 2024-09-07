import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { IoCalendarOutline, IoReturnDownBackSharp } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Claim } from "@/lib/schemas/claim.schema";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/redux.config";
import { paidClaim } from "@/lib/redux/reducers/claims.reducer";
import withAuthorization from "@/lib/utils/withAuthorization";
import { getItemWithExpiry } from "@/lib/utils/storage.utils";
import { decryptData } from "@/lib/utils/auth.utils";
const FinanceInfoPaid = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  // const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Trạng thái để quản lý hộp thoại đầu tiên và thứ hai
  const [showInitialDialog, setShowInitialDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const location = useLocation();
  const { claim } = location.state as { claim: Claim };

  // Helper function to format date to dd/mm/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // const claimState = useSelector((state: RootState) => state.claim.claims);

  if (!claim) {
    return <div>No claim data available</div>;
  }

  const handleGoBack = () => {
    window.history.back();
  };

  const handlePaidClick = (claim: Claim) => {
    setSelectedClaim(claim);
    setShowInitialDialog(true); // Hiển thị hộp thoại đầu tiên
  };

  const handleConfirmDialog = () => {
    setShowInitialDialog(false); // Đóng hộp thoại đầu tiên
    setShowConfirmDialog(true); // Hiển thị hộp thoại thứ hai
  };

  const handleCloseDialog = () => {
    setSelectedClaim(null);
    setShowInitialDialog(false);
    setShowConfirmDialog(false);
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
      } catch (error) {
        toast.error("Failed to update claim");
      }
      handleCloseDialog(); // Đóng cả hai hộp thoại
    }
  };

  const currentTime = new Date();

  const encryptedData = getItemWithExpiry<string>("userData");

  if (!encryptedData) {
    console.log("No user data available or data has expired.");
    return <Navigate to="/login" replace />;
  }

  const decryptedData = decryptData(encryptedData);
  const userData = JSON.parse(decryptedData);

  return (
    <div className="p-4 sm:mx-auto lg:mx-auto">
      <div className="rounded bg-white shadow-lg p-4">
        <span onClick={handleGoBack} className="inline-block">
          <IoReturnDownBackSharp
            className="inline-block"
            style={{ fontSize: "30px" }}
          />
          <button className="inline-block ml-5">Back to Project List</button>
        </span>
        <div className="flex justify-center items-center h-[510px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-28">
            <div className="flex flex-col space-y-4">
              <label>
                <strong style={{ color: "#666666", fontStyle: "normal" }}>
                  Claim ID
                </strong>
                <span style={{ color: "red" }}>*</span>
                <input
                  type="text"
                  value={claim.id}
                  readOnly
                  className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
                />
              </label>
              <label>
                <strong style={{ color: "#666666", fontStyle: "normal" }}>
                  Project Name
                </strong>
                <span style={{ color: "red" }}>*</span>
                <input
                  type="text"
                  value={claim.project.name}
                  readOnly
                  className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
                />
              </label>
              <label>
                <strong style={{ color: "#666666", fontStyle: "normal" }}>
                  Total Hours (h)
                </strong>
                <input
                  type="text"
                  value={claim.records.length}
                  readOnly
                  className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
                />
              </label>
            </div>
            <div className="flex flex-col space-y-4">
              <label>
                <strong style={{ color: "#666666", fontStyle: "normal" }}>
                  Staff Name
                </strong>
                <span style={{ color: "red" }}>*</span>
                <input
                  type="text"
                  value={claim.staff.name}
                  readOnly
                  className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
                />
              </label>
              <div className="flex space-x-4">
                <label className="relative mr-4">
                  <strong style={{ color: "#666666", fontStyle: "normal" }}>
                    From
                  </strong>
                  <span style={{ color: "red" }}>*</span>
                  <div className="absolute top-[50%] right-[5px]">
                    <IoCalendarOutline
                      style={{ fontSize: "20px", color: "#555" }}
                    />
                  </div>
                  <input
                    type="text"
                    value={formatDate(claim.project.from)}
                    readOnly
                    className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
                  />
                </label>
                <label className="relative mr-4">
                  <strong style={{ color: "#666666", fontStyle: "normal" }}>
                    To
                  </strong>
                  <span style={{ color: "red" }}>*</span>
                  <div className="absolute top-[50%] right-[5px]">
                    <IoCalendarOutline
                      style={{ fontSize: "20px", color: "#555" }}
                    />
                  </div>
                  <input
                    type="text"
                    value={formatDate(claim.project.to)}
                    readOnly
                    className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
                  />
                </label>
              </div>
              <label>
                <strong style={{ color: "#666666", fontStyle: "normal" }}>
                  Total Amount ($)
                </strong>
                <input
                  type="text"
                  value={claim.total_money
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  readOnly
                  className="block w-full mt-1 bg-[#cccccc] border rounded p-2"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              handlePaidClick(claim);
              // setShowConfirmDialog(false);
            }}
            className="w-40 bg-blue-500 text-white px-4 py-2 rounded font-bold"
          >
            Paid
          </button>
        </div>
      </div>

      {showInitialDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 max-w-sm mx-auto">
            <h2 className="text-lg font-bold mb-4">Paid Claim Requests</h2>
            <p className="mb-4">{`Paid by ${userData.name} on ${currentTime}.`}</p>
            <p className="mb-4">
              Please click 'Continue' to approve the claim or 'Cancel' to close
              the dialog.
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
            <p className="mb-4">
              Are you sure you want to continue this action?
            </p>
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
  );
};
const allowedRoles = ["finance"];

export default withAuthorization(FinanceInfoPaid, allowedRoles);
