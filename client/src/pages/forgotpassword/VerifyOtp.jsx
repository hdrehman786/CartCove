
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios, { Axios } from 'axios';
import { baseUrl } from '../../utils/Axios';

const ResetOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  Axios.intercepter.request.use( 
    async (req) => {
      const accesstoken = localStorage.getItem("accesstoken");
      if (accesstoken) {
        req.headers.Autherization = `Bearer ${accesstoken}`
      }
      return req;
    },
      (error)=>{
        return Promise.reject(error);
      }
  )

  const isValid = email && otp;

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/auth/verifyOtp`,
        { email, otp },
        { withCredentials: true }
      );

      toast.success(response?.data?.message || "OTP verified successfully.");
      console.log("OTP Verification response:", response.data);

      // Redirect to reset password page if needed
      navigate("/reset-password"); 
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "OTP verification failed.";
      console.error("OTP error:", error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container mx-auto w-full px-2">
      <div className="bg-blue-50 my-4 w-full max-w-lg mx-auto p-6 rounded shadow">
        <p className="text-xl font-semibold text-center">Verify OTP</p>
        <p className="text-sm text-center mt-1 text-gray-600">
          Enter your email and the OTP sent to you.
        </p>

        <form className="grid gap-4 mt-6" onSubmit={handleVerifyOtp}>
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm font-bold">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-blue-50 border outline-none focus:border-yellow-400 rounded p-2"
              required
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="otp" className="text-sm font-bold">OTP:</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP"
              className="bg-blue-50 border outline-none focus:border-yellow-400 rounded p-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`${
              isValid ? "bg-green-800" : "bg-gray-500"
            } text-white py-2 px-4 rounded hover:bg-blue-700 transition`}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="mt-3 text-sm text-center">
          Didn’t receive the code?{" "}
          <Link to="/forgot-password" className="text-green-700 hover:text-green-800 font-semibold">
            Resend
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ResetOtp;
