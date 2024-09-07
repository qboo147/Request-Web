import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { RootState, AppDispatch } from "@/lib/redux/redux.config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  requestPasswordReset,
  resetPasswordResetMessage,
} from "@/lib/redux/reducers/auth.reducer";

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { message, status, loading } = useSelector(
    (state: RootState) => state.auth.passwordReset
  );

  useEffect(() => {
    localStorage.removeItem("active");
    localStorage.removeItem("role");
    localStorage.removeItem("otp");
    localStorage.removeItem("resetEmail");
    localStorage.removeItem("name");
    localStorage.removeItem("department");
    localStorage.removeItem("resetId");
    localStorage.removeItem("rank");
  }, []);

  const handleReset = () => {
    if (email.trim() === "") {
      toast.error("Username or primary email cannot be empty", {
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
    dispatch(requestPasswordReset(email));
  };

  useEffect(() => {
    if (message) {
      if (status === "success") {
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // Redirect to identity verification page
        setTimeout(() => navigate("/identityverification"), 2000);
      } else if (status === "error") {
        toast.error(message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      dispatch(resetPasswordResetMessage());
    }
  }, [message, status, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer newestOnTop />
      <div className="bg-white p-8 rounded-[24px] shadow-md w-full max-w-sm flex flex-col items-center">
        <div className="flex justify-start w-full mb-4">
          <button
            className="text-gray-500 text-2xl"
            onClick={() => navigate("/login")}
          >
            &larr;
          </button>
        </div>
        <img
          className="h-[50px] mb-4"
          src="/images/FPT_Logo.svg"
          alt="FPT Logo"
        />
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        <div className="mb-4 w-full">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Username or primary email
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <FaEnvelope className="ml-3 text-gray-400" />
            <input
              type="email"
              id="email"
              placeholder="Username or primary email"
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleReset}
          className="bg-[#007acc] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
};

export default PasswordReset;
