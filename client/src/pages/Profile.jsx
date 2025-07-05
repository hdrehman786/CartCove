"use client";
import { useDispatch, useSelector } from "react-redux";
import {
  FaRegUserCircle,
  FaUserEdit,
  FaMapMarkerAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { BsBoxSeam, BsCart } from "react-icons/bs";
import { toast } from "react-toastify";
import uploadImage from "../utils/uploadImage";
import { useEffect, useState } from "react";
import axios from "axios";
import SummaryApi from "../common/SummaryApis";
import GetUserDetails from "../utils/Userdetails";
import { logout, settUserDetails } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const fetchUser = async () => {
    const user = await GetUserDetails();
    dispatch(settUserDetails(user));
  }

  const handleChangeProfilePicture = async () => {
    try {
      const response = await uploadImage(file);
      if (response?.data?.url) {
        const updatedUser = await axios({
          ...SummaryApi.updateprofilepicture,
          data: {
            url: response.data.url,
            _id: user._id,
          }
        })
        toast.success("Profile picture updated successfully!");
        fetchUser();
      } else {
        toast.error("Failed to update profile picture");
      }
    } catch (error) {
      toast.error("Error changing profile picture");
    }
  };

  useEffect(() => {
    if (file) handleChangeProfilePicture();
  }, [file]);

  const handleLogout = async () => {
    try {
      const response = await axios({
        ...SummaryApi.logout,
        withCredentials: true, // Ensure cookies are sent with the request
      });

      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        window.history.back();
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Logout failed.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-4 flex items-start justify-center">
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-8 border border-slate-200">
        {/* Header with gradient background */}
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-20"></div>
          <div className="px-6 pb-6 -mt-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
              <div className="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-white rounded-full shadow-lg overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name || "User Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <FaRegUserCircle size={32} className="text-white md:text-4xl" />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left flex-1 mt-4 md:mt-0">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                  {user.name || "User Name"}
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                  {user.email || "user.email@example.com"}
                </p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  Welcome back to your account
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-4 md:pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 md:gap-4">
            {/* Change Profile Picture - Using <label> to trigger file input */}
            <label
              htmlFor="profile-picture"
              className="w-full flex items-center gap-4 px-6 py-4 md:py-6 text-left text-gray-700 hover:bg-slate-50 transition-all duration-200 focus:outline-none group rounded-xl md:border md:border-gray-100 md:hover:border-gray-200 md:hover:shadow-md cursor-pointer"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FaUserEdit size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <span className="font-medium">Change Profile Picture</span>
                <p className="text-xs text-gray-500 mt-0.5">Update your profile picture</p>
              </div>
            </label>

            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />

            <button
              onClick={() => handleNavigate("/dashboard/myorder")}
              className="w-full flex items-center gap-4 px-6 py-4 md:py-6 text-left text-gray-700 hover:bg-slate-50 transition-all duration-200 focus:outline-none group rounded-xl md:border md:border-gray-100 md:hover:border-gray-200 md:hover:shadow-md"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <BsBoxSeam size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <span className="font-medium">My Orders</span>
                <p className="text-xs text-gray-500 mt-0.5">Track your order history</p>
              </div>
            </button>

            <button
              onClick={() => handleNavigate("/products/mycart")}
              className="w-full flex items-center gap-4 px-6 py-4 md:py-6 text-left text-gray-700 hover:bg-slate-50 transition-all duration-200 focus:outline-none group rounded-xl md:border md:border-gray-100 md:hover:border-gray-200 md:hover:shadow-md"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <BsCart size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <span className="font-medium">My Cart</span>
                <p className="text-xs text-gray-500 mt-0.5">View items in your cart</p>
              </div>
            </button>

            <button
              onClick={() => handleNavigate("/dashboard/address")}
              className="w-full flex items-center gap-4 px-6 py-4 md:py-6 text-left text-gray-700 hover:bg-slate-50 transition-all duration-200 focus:outline-none group rounded-xl md:border md:border-gray-100 md:hover:border-gray-200 md:hover:shadow-md"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <FaMapMarkerAlt size={20} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <span className="font-medium">Address</span>
                <p className="text-xs text-gray-500 mt-0.5">Manage shipping addresses</p>
              </div>
            </button>
          </div>

          <div className="px-6 py-3">
            <div className="border-t border-gray-200"></div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 md:py-6 text-left text-red-600 hover:bg-red-50 transition-all duration-200 focus:outline-none group rounded-xl md:border md:border-red-100 md:hover:border-red-200 md:hover:shadow-md mt-4"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <FaSignOutAlt size={20} className="text-red-600" />
            </div>
            <div className="flex-1">
              <span className="font-medium">Logout</span>
              <p className="text-xs text-red-500 mt-0.5">Sign out of your account</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
