import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../utils/Axios";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const isValidate = Object.values(user).every(Boolean);

  const onSubmit = (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    registerUser();
  };

  const registerUser = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/auth/register`, user);
      toast.success(response?.data?.message || "Registration successful.");
      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="hidden lg:flex w-1/2 items-start justify-center bg-gradient-to-tr from-blue-800 to-purple-700 p-12 pt-40">
        <div className="max-w-md text-center">
            <h1 className="text-5xl font-bold text-white leading-tight">Join Our Community</h1>
            <p className="mt-4 text-lg text-blue-100">Create an account to enjoy exclusive deals, faster checkout, and more.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-start justify-center p-8 pt-16 md:p-12 lg:pt-24">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create an Account</h2>
          <p className="text-gray-600 mb-8">Let's get you started!</p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={user.name}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={user.email}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={user.password}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                </button>
              </div>
            </div>
            
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={user.confirmPassword}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!isValidate || loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already a member?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;