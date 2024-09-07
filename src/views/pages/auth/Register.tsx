import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch, RootState } from "@/lib/redux/redux.config";
import { register, clearMessages } from "@/lib/redux/reducers/auth.reducer";

interface RegisterError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

const Register: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleRegister = async () => {
    toast.dismiss();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields", {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format", {
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

    if (password !== confirmPassword) {
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

    if (loading) return; // Prevent multiple register attempts

    setLoading(true);

    const userData = {
      name: `${firstName} ${lastName}`,
      email,
      password,
    };

    try {
      await dispatch(register(userData)).unwrap();
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      toast.success("Sign in now.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      const registerError = error as RegisterError;
      console.error("Registration error:", registerError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.message) {
      toast.success(authState.message);
      dispatch(clearMessages()); // Clear messages after showing success toast
    }
  }, [authState.message, dispatch]);

  useEffect(() => {
    if (authState.error) {
      toast.error(authState.error);
      dispatch(clearMessages()); // Clear errors after showing error toast
    }
  }, [authState.error, dispatch]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-gray-100"
      onKeyDown={handleKeyPress}
    >
      <ToastContainer newestOnTop />
      <div className="bg-white p-8 rounded-[24px] shadow-md w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="flex h-full justify-center items-center">
            <img
              className="h-[50px]"
              src="/images/FPT_Logo.svg"
              alt="FPT Logo"
            />
          </div>
          <h2 className="text-2xl font-bold">Claim Requests System</h2>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="firstName"
            >
              First name
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="First name"
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="w-1/2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lastName"
            >
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Last name"
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="We recommend a work email address."
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Minimum length is 8 characters"
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-0 pr-3"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <div className="relative flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Re-enter your password"
              className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-0 pr-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button
          onClick={handleRegister}
          className="bg-[#007acc] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
          disabled={loading}
        >
          {loading && <FaSpinner className="mr-2 animate-spin" />}
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-sm text-[#007acc] hover:text-blue-800"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
