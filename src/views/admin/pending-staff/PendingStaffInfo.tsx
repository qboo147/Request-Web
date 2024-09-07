import { IoReturnDownBackSharp } from "react-icons/io5";
import { FaAsterisk } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authorizeStaff } from "@/lib/redux/reducers/staff.reducer";
import { useState } from "react";
import { AppDispatch } from "@/lib/redux/redux.config";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alertDialog";
import withAuthorization from "@/lib/utils/withAuthorization";

const PendingStaffInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const staff = location.state?.staff;
  const dispatch = useDispatch<AppDispatch>();
  const [showConfirmationDialog, setShowConfirmationDialog] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthorize = () => {
    setShowConfirmationDialog(true);
  };

  const confirmSubmission = async () => {
    try {
      await dispatch(authorizeStaff(staff.id)).unwrap();
      navigate("/config/pending-staff");
    } catch (err: any) {
      setError(err.message || "Failed to authorize staff. Please try again.");
    } finally {
      setShowConfirmationDialog(false);
    }
  };

  const cancelSubmission = () => {
    setShowConfirmationDialog(false);
  };

  const goToStaffList = () => {
    navigate("/config/pending-staff");
  };


  return (
    <div className="px-2 py-4 md:px-4">
      <div className="relative flex flex-col p-4 h-[600px] rounded bg-white shadow-lg gap-y-5">
        <div className="flex items-center gap-3">
          <div onClick={goToStaffList} className="cursor-pointer">
            <IoReturnDownBackSharp className="text-[#615E66] w-[46px] h-[46px]" />
          </div>
          <h2 className="text-sm">Back to pending staff list</h2>
        </div>
        <div className="flex-col items-center px-[46px]">
          <div className="flex gap-1 mb-4">
            <h2 className="text-sm text-gray-500">Staff Name </h2>
            <FaAsterisk className="text-red-600 w-[5px] h-[5px]" />
          </div>
          <form>
            <label className="block w-5/12 px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md bg-slate-100">
              {staff?.name}
            </label>
          </form>
        </div>
        <div className="flex-col items-center px-[46px]">
          <div className="flex gap-1 mb-4">
            <h2 className="text-sm text-gray-500">Department </h2>
            <FaAsterisk className="text-red-600 w-[5px] h-[5px]" />
          </div>
          <form>
            <label className="block w-1/6 px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md bg-slate-100">
              {staff?.department}
            </label>
          </form>
        </div>
        <div className="flex-col items-center px-[46px]">
          <div className="flex gap-1 mb-4">
            <h2 className="text-sm text-gray-500">Job Rank </h2>
            <FaAsterisk className="text-red-600 w-[5px] h-[5px]" />
          </div>
          <form>
            <label className="block w-1/6 px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md bg-slate-100">
              {staff?.rank}
            </label>
          </form>
        </div>
        <div className="flex-col items-center px-[46px]">
          <div className="flex gap-1 mb-4">
            <h2 className="text-sm text-gray-500">Role </h2>
            <FaAsterisk className="text-red-600 w-[5px] h-[5px]" />
          </div>
          <form>
            <label className="block w-1/6 px-3 py-2 outline-none border border-slate-400 bg-transparent rounded-md bg-slate-100">
              {staff?.role}
            </label>
          </form>
        </div>

        <div className="absolute bottom-[19px] right-[40px] flex gap-5">
          <button
            className="bg-green-600 text-white rounded-md border w-[120px] h-[50px] font-bold font-mono"
            onClick={handleAuthorize}
          >
            Authorize
          </button>
        </div>

        {/* Confirmation Dialog for Authorization */}
        <AlertDialog
          open={showConfirmationDialog}
          onOpenChange={setShowConfirmationDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Authorization</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to authorize this staff member? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={confirmSubmission}
                className="bg-green-700 text-white"
              >
                Authorize
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

        {/* Display Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
const allowedRoles = ["admin"];

export default withAuthorization(PendingStaffInfo, allowedRoles);
