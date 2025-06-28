import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../utils/Axios';



const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isValid = !!email;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${baseUrl}/auth/forgotpassword`,
        { email },
        { withCredentials: true }
      );

      toast.success(response?.data?.message || "Reset link sent to your email.");
      console.log("Forgot password response:", response.data);
      navigate("/reset-otp");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to send reset link.";
      console.error("Forgot password error:", error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container mx-auto w-full px-2">
      <div className="bg-blue-50 my-4 w-full max-w-lg mx-auto p-6 rounded shadow">
        <p className="text-xl font-semibold text-center">Forgot Your Password?</p>
        <p className="text-sm text-center mt-1 text-gray-600">
          Enter your email address to receive a otp.
        </p>

        <form className="grid gap-4 mt-6" onSubmit={handleForgotPassword}>
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm font-bold">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="bg-blue-50 border outline-none focus:border-yellow-400 rounded p-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`${
              isValid ? "bg-green-800" : "bg-gray-500"
            } text-white py-2 px-4 rounded hover:bg-green-700 transition`}
          >
            {isLoading ? "Sending..." : "Send Reset Otp"}
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

export default ForgotPassword;
