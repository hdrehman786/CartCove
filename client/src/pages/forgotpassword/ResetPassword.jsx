

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../utils/Axios';

const UpdatePassword = () => {
  const [email, setEmail] = useState("");
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const isValid = email && password && confirmPassword;

  const togglePassword = () => setShowPassword(!showPassword);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("New password and confirm password do not match.");
    }

    try {
      const response = await axios.put(
        `${baseUrl}/auth/resetpassword`,
        { email, password },
        { withCredentials: true }
      );

      toast.success(response?.data?.message || "Password updated successfully.");
      console.log("Update password response:", response.data);
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to update password.";
      console.error("Update password error:", error);
      toast.error(errorMessage);
    }
  };

  return (
    <section className="container mx-auto w-full px-2">
      <div className="bg-blue-50 my-4 w-full max-w-lg mx-auto p-6 rounded shadow">
        <p className="text-xl font-semibold text-center">Reset Your Password</p>

        <form className="grid gap-4 mt-6" onSubmit={handleUpdatePassword}>
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm font-bold">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-blue-50 border outline-none focus:border-yellow-400 rounded p-2"
              required
            />
          </div>

          <div className="grid gap-1 relative">
            <label htmlFor="newPassword" className="text-sm font-bold">New Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              value={password}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="bg-blue-50 border outline-none focus:border-yellow-400 rounded p-2 pr-10"
              required
            />
            <span
              onClick={togglePassword}
              className="absolute right-3 top-[38px] cursor-pointer text-gray-600"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
          </div>

          <div className="grid gap-1 relative">
            <label htmlFor="confirmPassword" className="text-sm font-bold">Confirm Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="bg-blue-50 border outline-none focus:border-yellow-400 rounded p-2 pr-10"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`${
              isValid ? "bg-green-800" : "bg-gray-500"
            } text-white py-2 px-4 rounded hover:bg-blue-700 transition`}
          >
            Update Password
          </button>
        </form>

        <p className="mt-3 text-sm text-center">
          Remember your password?{" "}
          <Link to="/login" className="text-green-700 hover:text-green-800 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default UpdatePassword;
