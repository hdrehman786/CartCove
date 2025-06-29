import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../utils/Axios";
import GetUserDetails from "../utils/Userdetails";
import { useDispatch } from "react-redux";
import { settUserDetails } from "../store/userSlice";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const isValid = credentials.email && credentials.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, credentials, {
        withCredentials: true,
      });
      localStorage.setItem("accesstoken", response.data.data.accesstoken);
      localStorage.setItem("refreshtoken", response.data.data.refreshtoken);

      // const userDetails = await GetUserDetails();
      // console.log("User Details:", userDetails);
      dispatch(settUserDetails(response.data.data.user));

      toast.success(response?.data?.message || "Login successful.");
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/30 relative animate-fadeIn">
        <h2 className="text-center text-3xl font-bold text-white drop-shadow mb-6">
          👋 Welcome Back
        </h2>

        <form className="grid gap-5 text-white" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="relative">
            <input
              value={credentials.email}
              name="email"
              onChange={handleChange}
              type="email"
              placeholder="Email Address"
              className="w-full p-3 bg-white/20 backdrop-blur-md rounded-md text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              value={credentials.password}
              name="password"
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-10 bg-white/20 backdrop-blur-md rounded-md text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner transition-all"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 cursor-pointer text-gray-200"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>

          {/* Forgot Password */}
          <div className="text-sm text-right">
            <Link
              to="/forgot-password"
              className="text-yellow-400 hover:text-yellow-300 font-semibold"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`${
              isValid
                ? "bg-yellow-400 hover:bg-yellow-300"
                : "bg-gray-400 cursor-not-allowed"
            } text-gray-900 font-bold py-3 rounded-md transition-all flex items-center justify-center shadow-lg`}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-200 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-400 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

        {/* Glow Effects */}
        <div className="absolute top-[-50px] left-[-50px] w-[120px] h-[120px] bg-purple-600 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-40px] right-[-40px] w-[100px] h-[100px] bg-blue-600 rounded-full filter blur-2xl opacity-40 animate-ping"></div>
      </div>
    </section>
  );
};

export default Login;
