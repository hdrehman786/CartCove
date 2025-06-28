import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Divider from './Divider';
import axiosInstance from '../utils/Axios';
import SummaryApi from '../common/SummaryApis';
import { logout } from '../store/userSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';

const UserMenue = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const isAdmin = user.role == "Admin";

  const handleClose = () => {
    close(false);
  };

  const handleLogout = async () => {
    try {
      const response = await axiosInstance({
        ...SummaryApi.logout,
        withCredentials: true, // Ensure cookies are sent with the request
      });

      if (response.data.success) {
        if (close) {
          handleClose();
        }
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
    <div className="py-2 ">
      <div className="font-semibold cursor-pointer">My Account</div>

      <div className="flex my-2 px-2 items-center justify-between">
        <span className="max-w-40 text-ellipsis line-clamp-1">
          {user.name} 
        </span>
        <Link to="/dashboard/profile" className="text-sm">
          <FaExternalLinkAlt size={16} className="hover:orange-200" />
        </Link>
      </div>

      <Divider />

      <div className="text-sm grid gap-3 mt-3">

        {
          isAdmin && (
            <>
              <Link to="/dashboard/category" className="px-2 hover:bg-yellow-300 py-1 rounded">
                Category
              </Link>

              <Link to="/dashboard/subcategory" className="px-2 hover:bg-yellow-300 py-1 rounded">
                Subcategory
              </Link>

              <Link to="/dashboard/upload-product" className="px-2 hover:bg-yellow-300 py-1 rounded">
                Upload Product
              </Link>

              <Link to="/dashboard/products-admin" className="px-2 hover:bg-yellow-300 py-1 rounded">
                Products
              </Link>
            </>
          )
        }


        <Link to="/dashboard/myorder" className="px-2 hover:bg-yellow-300 py-1 rounded">
          My Orders
        </Link>

        <Link to="/dashboard/address" className="px-2 hover:bg-yellow-300 py-1 rounded">
          Save Address
        </Link>

        <button
          onClick={handleLogout}
          className="hover:bg-orange-300 text-left px-2 rounded py-1"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserMenue;
