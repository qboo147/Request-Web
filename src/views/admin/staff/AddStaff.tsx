import { IoReturnDownBackSharp } from "react-icons/io5";
import { FaAsterisk } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createStaff } from "@/lib/redux/reducers/staff.reducer";
import { RootState, AppDispatch } from "@/lib/redux/redux.config";
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
import { Staff } from "@/lib/schemas/staff.schema";
import withAuthorization from "@/lib/utils/withAuthorization";
const AddStaff = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, message } = useSelector(
    (state: RootState) => state.staff
  );

  const [showConfirmationDialog, setShowConfirmationDialog] =
    useState<boolean>(false);
    const [formStaff, setFormStaff] = useState<Staff>({
      name: "",
      department: "",
      email: "",
      rank: "",
      password: "",
      role: "admin", // Assign a valid string value here
      id: 0,
      createdAt: "",
      updatedAt: "",
      active: true,
    });
    

  // State for error handling
  const [errors, setErrors] = useState({
    name: "",
    department: "",
    email: "",
    rank: "",
    password: "",
    role: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormStaff({
      ...formStaff,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      department: "",
      email: "",
      rank: "",
      password: "",
      role: "",
    };
    let isValid = true;

    if (!formStaff.name) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formStaff.department) {
      newErrors.department = "Department is required";
      isValid = false;
    }

    if (!formStaff.email || !/\S+@\S+\.\S+/.test(formStaff.email)) {
      newErrors.email = "Valid email is required";
      isValid = false;
    }

    if (!formStaff.rank) {
      newErrors.rank = "Rank is required";
      isValid = false;
    }

    if (!formStaff.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    if (!formStaff.role) {
      newErrors.role = "Role is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowConfirmationDialog(true);
    }
  };

  const confirmSubmission = async () => {
    try {
      await dispatch(createStaff(formStaff)).unwrap();
      navigate("/config/staff");
    } catch (err) {
      console.error("Failed to create staff:", err);
    } finally {
      setShowConfirmationDialog(false);
    }
  };

  const cancelSubmission = () => {
    setShowConfirmationDialog(false);
  };

  const goToStaffList = () => {
    navigate("/config/staff");
  };

  return (
    <div className="px-2 py-4 md:px-4">
      <div className="relative flex flex-col p-4 h-[600px] rounded bg-white shadow-lg gap-y-5">
        <div className="flex items-center gap-3">
          <div onClick={goToStaffList} className="cursor-pointer">
            <IoReturnDownBackSharp className="text-[#615E66] w-[46px] h-[46px]" />
          </div>
          <h2 className="text-sm">Back to staff list</h2>
        </div>

        <div className="flex-col items-center px-[46px]">
          <div className="flex gap-1">
            <h2 className="text-sm text-gray-500">Staff Name </h2>
            <FaAsterisk className="text-red-600 w-[5px] h-[5px]" />
          </div>
          <div>
            <input
              className={`w-5/12 px-3 py-2 outline-none border rounded-md ${
                errors.name ? "border-red-500" : "border-slate-400"
              }`}
              type="text"
              name="name"
              placeholder="Enter staff name"
              id="name"
              required
              value={formStaff.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center px-[46px] space-x-8">
          <div className="flex-col">
            <div className="flex gap-1">
              <h2 className="text-sm text-gray-500">Department </h2>
              <FaAsterisk className="text-red-600 w-[5px] h-[5px]" />
            </div>
            <div>
              <input
                className={`px-3 py-2 outline-none border rounded-md ${
                  errors.department ? "border-red-500" : "border-slate-400"
                }`}
                type="text"
                name="department"
                placeholder="Enter staff department"
                id="department"
                required
                value={formStaff.department}
                onChange={handleChange}
              />
              {errors.department && (
                <p className="text-red-500 text-xs mt-1">{errors.department}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex gap-1">
              <h2 className="text-sm text-gray-500">Email </h2>
              <FaAsterisk className="text-red-600 w-[5px] h-[5px]" />
            </div>
            <div>
              <input
                className={`px-3 py-2 outline-none border rounded-md ${
                  errors.email ? "border-red-500" : "border-slate-400"
                }`}
                type="email"
                name="email"
                placeholder="Enter staff email"
                id="email"
                required
                value={formStaff.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center px-[46px] space-x-8">
          <div className="flex-col">
            <div className="flex gap-1">
              <h2 className="text-sm text-gray-500">Job Rank </h2>
              <FaAsterisk className="text-red-600 w-[5px] h-[5px]" />
            </div>
            <div>
              <input
                className={`px-3 py-2 outline-none border rounded-md ${
                  errors.rank ? "border-red-500" : "border-slate-400"
                }`}
                type="text"
                name="rank"
                placeholder="Enter staff job rank"
                id="rank"
                required
                value={formStaff.rank}
                onChange={handleChange}
              />
              {errors.rank && (
                <p className="text-red-500 text-xs mt-1">{errors.rank}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex gap-1">
              <h2 className="text-sm text-gray-500">Password </h2>
              <FaAsterisk className="text-red-600 w-[5px] h-[5px]" />
            </div>
            <div>
              <input
                className={`px-3 py-2 outline-none border rounded-md ${
                  errors.password ? "border-red-500" : "border-slate-400"
                }`}
                type="text"
                name="password"
                placeholder="Enter staff password"
                id="password"
                required
                value={formStaff.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center px-[46px] space-x-8">
          <div>
            <div className="flex gap-1">
              <h2 className="text-sm text-gray-500">Role </h2>
              <FaAsterisk className="text-red-600 w-[5px] h-[5px]" />
            </div>
            <div>
              <select
                className={`px-3 py-2 outline-none border rounded-md ${
                  errors.role ? "border-red-500" : "border-slate-400"
                }`}
                name="role"
                id="role"
                required
                value={formStaff.role}
                onChange={handleChange}
              >
                <option value="">Select role</option>
                <option value="claimer">claimer</option>
                <option value="approver">approver</option>
                <option value="finance">finance</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-[19px] right-[40px] flex gap-5">
          <button
            className="bg-[#F1F6F9] text-[#14274E] rounded-md border w-[120px] h-[50px] font-bold font-mono"
            onClick={goToStaffList}
          >
            Cancel
          </button>
          <button
            className={`bg-blue-600 text-white rounded-md border w-[120px] h-[50px] font-bold font-mono ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>

        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        {message && (
          <p className="text-green-600 text-center mt-4">{message}</p>
        )}

        {/* Confirmation Dialog for Submission */}
        <AlertDialog
          open={showConfirmationDialog}
          onOpenChange={setShowConfirmationDialog}
        >
          <AlertDialogTrigger asChild>
            {/* The trigger is empty as it's not required in this case */}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to add new staff? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={confirmSubmission}
                className="bg-blue-700 text-white"
              >
                Submit
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

export default withAuthorization(AddStaff, allowedRoles);
