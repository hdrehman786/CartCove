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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-900 via-indigo-800 to-purple-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/30 relative animate-fadeIn">
        <h2 className="text-center text-3xl font-bold text-white drop-shadow mb-6">
          🚀 Join <span className="text-yellow-400">Rao's Cart</span>
        </h2>

        <form className="grid gap-5 text-white" onSubmit={onSubmit}>
          {/* Name */}
          <div className="relative">
            <input
              value={user.name}
              name="name"
              onChange={onChange}
              type="text"
              placeholder="Full Name"
              className="w-full p-3 bg-white/20 backdrop-blur-md rounded-md text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner transition-all"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              value={user.email}
              name="email"
              onChange={onChange}
              type="email"
              placeholder="Email Address"
              className="w-full p-3 bg-white/20 backdrop-blur-md rounded-md text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              value={user.password}
              name="password"
              onChange={onChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-10 bg-white/20 backdrop-blur-md rounded-md text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner transition-all"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 cursor-pointer text-gray-200"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              value={user.confirmPassword}
              name="confirmPassword"
              onChange={onChange}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-3 pr-10 bg-white/20 backdrop-blur-md rounded-md text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner transition-all"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-3 right-3 cursor-pointer text-gray-200"
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={18} />
              ) : (
                <FaEye size={18} />
              )}
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={!isValidate || loading}
            className={`${
              isValidate
                ? "bg-yellow-400 hover:bg-yellow-300"
                : "bg-gray-400 cursor-not-allowed"
            } text-gray-900 font-bold py-3 rounded-md transition-all flex items-center justify-center shadow-lg`}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-200 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-400 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

        {/* Glow Effect */}
        <div className="absolute top-[-50px] left-[-50px] w-[120px] h-[120px] bg-purple-600 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-40px] right-[-40px] w-[100px] h-[100px] bg-blue-600 rounded-full filter blur-2xl opacity-40 animate-ping"></div>
      </div>
    </section>
  );
};

export default Register;
