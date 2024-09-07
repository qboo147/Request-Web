import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { decryptData } from "@/lib/utils/auth.utils";

const IdentityVerification: React.FC = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedOTP = localStorage.getItem("otp");
    const storedEmail = localStorage.getItem("resetEmail");

    if (!storedOTP || !storedEmail) {
      navigate("/login");
    }
  }, [navigate]);

  const handleContinue = () => {
    const storedOTP = localStorage.getItem("otp");
    const storedEmail = localStorage.getItem("resetEmail");

    if (code.trim().length !== 8) {
      toast.error("Code must be 8 numbers long", {
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

    if (!storedOTP || code !== decryptData(storedOTP)) {
      toast.error("Invalid OTP code", {
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

    // Redirect to new password page
    toast.success("Code verified successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setTimeout(() => {
      navigate(`/passwordnew?email=${storedEmail}`);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <ToastContainer newestOnTop />
      <div className="bg-white p-8 rounded-[24px] shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-left">
          Enter security code
        </h2>
        <hr className="mb-4 border-gray-300 w-full" />
        <p className="text-gray-600 mb-2 text-left">
          Please check your emails for a message with your code. Your code is 8
          numbers long.
        </p>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            id="code"
            placeholder="Enter code"
            className="w-1/2 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <p className="text-gray-600 ml-4">
            We sent your code to:
            <br />
            example@fpt.com
          </p>
        </div>
        <hr className="mb-4 border-gray-300 w-full" />
        <div className="flex justify-between items-center mb-4"></div>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            onClick={() => navigate("/login")}
          >
            Cancel
          </button>
          <button
            className="bg-[#007acc] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerification;
