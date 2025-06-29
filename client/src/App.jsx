import React, { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import GetUserDetails from './utils/Userdetails.js';
import axios from 'axios';
import axiosInstance, { baseUrl } from './utils/Axios';
import { settUserDetails } from './store/userSlice.js';
import { useDispatch } from 'react-redux';
import { setAllCategory, setSubCategory } from './store/ProductSlice.js';
import SummaryApi from './common/SummaryApis.js';
import { BsCart4 } from "react-icons/bs";
const App = () => {
  const dispatch = useDispatch();
  const fetchUser = async () => {
    const user = await GetUserDetails();
    dispatch(settUserDetails(user));
  }

  const fetchCategory = async () => {
    try {
      const response = await axiosInstance({
        ...SummaryApi.getCategories
      });
      console.log(response);
      const { data: responsedata } = response;
      dispatch(setAllCategory(responsedata.data))
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await axiosInstance({
        ...SummaryApi.getallSubCategories
      });
      const { data: responsedata } = response;
      dispatch(setSubCategory(responsedata.data))
    } catch (error) {
      console.error("Error fetching subcategories:", error.message);
    }
  }



  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
  }, []);


  return (
    <>
      <Header />
      <main className=' min-h-[78vh] bg-gray-100 '>
        <Outlet />
        <Link to={"/products/mycart"} className="fixed bottom-5 right-5 z-50 md:hidden bg-green-500 text-white p-3 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300 ease-in-out group">
          <BsCart4 size={24} className="group-hover:rotate-6 transition-transform duration-300" />
        </Link>
      </main>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App