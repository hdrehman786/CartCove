import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../utils/Axios";
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
    <div className="min-h-screen flex bg-gray-100">
      <div className="hidden lg:flex w-1/2 items-start justify-center bg-gradient-to-tr from-blue-800 to-purple-700 p-12 pt-40">
        <div className="max-w-md text-center">
            <h1 className="text-5xl font-bold text-white leading-tight">Welcome Back to Shoppy</h1>
            <p className="mt-4 text-lg text-blue-100">Your one-stop shop for everything you need. Login to continue your shopping journey.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-start justify-center p-8 pt-16 md:p-12 lg:pt-24">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
          <p className="text-gray-600 mb-8">Enter your details to access your account.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <FaEyeSlash aria-hidden="true" />
                  ) : (
                    <FaEye aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Not a member yet?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;