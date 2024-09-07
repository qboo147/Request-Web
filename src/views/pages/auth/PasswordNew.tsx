import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaLock } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/redux.config";
import { updatePassword } from "@/lib/redux/reducers/auth.reducer";
import { decryptData } from "@/lib/utils/auth.utils";
import { useEffect } from "react";

const PasswordNew: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const storedOTP = localStorage.getItem("otp");
    const storedEmail = localStorage.getItem("resetEmail");

    if (!storedOTP || !storedEmail) {
      navigate("/login");
    }
  }, [navigate]);

  const handleConfirm = async () => {
    if (newPassword.trim().length < 8) {
      toast.error("Password must be at least 8 characters long", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!email) {
      toast.error("Invalid email", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    try {
      const formData = {
        email: decryptData(localStorage.getItem("resetEmail") || ""),
        password: newPassword,
        role: decryptData(localStorage.getItem("role") || ""),
        active: JSON.parse(
          decryptData(localStorage.getItem("active") || "false")
        ),
        name: decryptData(localStorage.getItem("name") || ""),
        department: decryptData(localStorage.getItem("department") || ""),
        rank: decryptData(localStorage.getItem("rank") || ""),
      };
      await dispatch(updatePassword(formData)).unwrap();
      toast.success("Password updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect to login page after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Error updating password. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer newestOnTop />
      <div className="bg-white p-8 rounded-[24px] shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-left">
          Set Your New Password
        </h2>
        <hr className="mb-4 border-gray-300 w-full" />
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="newPassword"
          >
            New Password Field
          </label>
          <div className="relative flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <FaLock className="ml-3 text-gray-400" />
            <input
              type="password"
              id="newPassword"
              placeholder="New Password Field"
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm New Password Field
          </label>
          <div className="relative flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <FaLock className="ml-3 text-gray-400" />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm New Password Field"
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <p className="text-[#858585] mb-4">
          Your password must be at:
          <br />- At least 8 characters long.
          {/* <br />
          - Include a lowercase & uppercase letters.
          <br />
          - Include a numbers.
          <br />- Include a special characters. */}
        </p>

        <button
          onClick={handleConfirm}
          className="bg-[#007acc] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default PasswordNew;
