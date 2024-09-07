import React, { useState, useEffect } from "react";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearMessages, login } from "@/lib/redux/reducers/auth.reducer";
import { RootState, AppDispatch } from "@/lib/redux/redux.config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getItemWithExpiry } from "@/lib/utils/storage.utils";
import { decryptData } from "@/lib/utils/auth.utils";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLoginAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(() => {
    return parseInt(localStorage.getItem("failedAttempts") || "0", 10);
  });
  const [isRestricted, setIsRestricted] = useState(() => {
    return JSON.parse(localStorage.getItem("isRestricted") || "false");
  });
  const [countdown, setCountdown] = useState(() => {
    return parseInt(localStorage.getItem("countdown") || "0", 10);
  });
  const [restrictionLevel, setRestrictionLevel] = useState(() => {
    return parseInt(localStorage.getItem("restrictionLevel") || "0", 10);
  });
  const dispatch: AppDispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

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

  const handleLogin = async () => {
    if (isRestricted && countdown > 0) return;

    if (email.trim() === "" || password.trim() === "") {
      toast.dismiss();
      toast.error("Username and password cannot be empty", {
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
      toast.dismiss();
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

    if (loading) return; // Prevent multiple login attempts

    setLoginAttempted(true);
    setLoading(true);

    try {
      await dispatch(login({ email, password }));
    } catch (err) {
      setFailedAttempts((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.error) {
      toast.error(authState.error);
      dispatch(clearMessages());
    }
  }, [authState.error, dispatch]);

  useEffect(() => {
    if (authState.message) {
      toast.success(authState.message);
      dispatch(clearMessages());
      // Clear restriction state upon successful login
      localStorage.removeItem("failedAttempts");
      localStorage.removeItem("isRestricted");
      localStorage.removeItem("countdown");
      localStorage.removeItem("restrictionLevel");
      setFailedAttempts(0);
      setIsRestricted(false);
      setCountdown(0);
      setRestrictionLevel(0);

      const encryptedData = getItemWithExpiry<string>("userData");

      if (encryptedData) {
        const decryptedData = decryptData(encryptedData);
        const userData = JSON.parse(decryptedData);
        if (userData.role === "approver") navigate("/approver/vetting");
        if (userData.role === "finance") navigate("/finance/approved");
        if (userData.role === "claimer") navigate("/claims");
        if (userData.role === "admin") navigate("/admin/dashboard");
      }
    }
  }, [authState.message, dispatch]);

  useEffect(() => {
    if (
      restrictionLevel === 0 &&
      failedAttempts >= 10 &&
      isRestricted === false
    ) {
      setCountdown(30);
      setIsRestricted(true);
    } else if (
      restrictionLevel > 0 &&
      failedAttempts === 1 &&
      isRestricted === false
    ) {
      setCountdown(30 * Math.pow(2, restrictionLevel));
      setIsRestricted(true);
    }

    // Save states to localStorage
    localStorage.setItem("failedAttempts", failedAttempts.toString());
    localStorage.setItem("isRestricted", JSON.stringify(isRestricted));
    localStorage.setItem("countdown", countdown.toString());
    localStorage.setItem("restrictionLevel", restrictionLevel.toString());
  }, [failedAttempts, restrictionLevel, isRestricted, countdown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          const newCountdown = prev - 1;
          localStorage.setItem("countdown", newCountdown.toString());
          if (newCountdown <= 0) {
            clearInterval(timer);
            setIsRestricted(false);
            setFailedAttempts(0); // Reset failed attempts after restriction
            setRestrictionLevel((prev) => prev + 1); // Increase restriction level
          }
          return newCountdown;
        });
      }, 1000);
    } else if (countdown <= 0 && isRestricted) {
      setIsRestricted(false);
      setFailedAttempts(0); // Reset failed attempts after restriction
      setRestrictionLevel((prev) => prev + 1); // Increase restriction level
    }
    return () => clearInterval(timer);
  }, [countdown, isRestricted]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-gray-100"
      onKeyDown={handleKeyPress}
    >
      <ToastContainer newestOnTop />
      <div className="bg-white p-8 rounded-[24px] shadow-md w-full max-w-4xl flex">
        <div className="w-1/2 p-4">
          <div className="text-center mb-4">
            <div className="flex h-full justify-center items-center">
              <img
                className="h-[50px]"
                src="/images/FPT_Logo.svg"
                alt="FPT Logo"
              />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Claim Requests System
            </h2>
          </div>
          <div className="mb-4">
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
                disabled={loading}
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <FaLock className="ml-3 text-gray-400" />
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="bg-[#007acc] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
            disabled={loading || (isRestricted && countdown > 0)}
          >
            {loading && <FaSpinner className="mr-2 animate-spin" />}
            {loading ? "Logging in..." : "Log In"}
          </button>
          <div className="text-center mt-4">
            <Link
              to="/passwordreset"
              className="inline-block align-baseline font-bold text-sm text-[#007acc] hover:text-blue-800"
            >
              Forgot password?
            </Link>
          </div>
          <div className="text-center mt-4">
            <Link
              to="/register"
              className="inline-block align-baseline font-bold text-sm text-[#007acc] hover:text-blue-800"
            >
              Register now
            </Link>
          </div>
        </div>
        <div className="w-1/2 ml-4">
          <img
            src="/images/Right_Side_Image.webp"
            alt="Right Side Image"
            className="h-full w-full object-cover rounded-lg"
          />
        </div>
      </div>
      {isRestricted && countdown > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Restricted</h2>
            <p>
              Too many failed login attempts. Please try again in {countdown}{" "}
              seconds.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
