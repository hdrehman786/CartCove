import React, { useEffect, useState } from 'react';
import UploadCategory from '../components/UploadCategory';
import Loading from '../components/Loading';
import axiosInstance from '../utils/Axios';
import SummaryApi from '../common/SummaryApis';
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import EditCategory from '../components/EditCategory';
import ConfirmDeletBox from '../components/ConfirmDeleteCat';
import { useDispatch, useSelector } from 'react-redux';
import { setAllCategory } from '../store/ProductSlice';
import { toast } from 'react-toastify';

const Category = () => {
  const [openUploadCategory, setopenUploadCategory] = useState(false);
  const [loading, setloading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openEditCategory,setOpenEditCategory] = useState(false);
  const [categoryData,setCategoryData]=useState({})
  const [showConfirm,setShowConfirm]=useState(false);
  const dispatch = useDispatch();

  const allCategory =useSelector(state=>state.product.allCategory);
  

  const fetchCategory = async () => {
    try {
      setloading(true);
      const response = await axiosInstance({
        ...SummaryApi.getCategories
      });
      const { data: responsedata } = response;
      setCategories(responsedata.data);
      dispatch(setAllCategory(responsedata.data))
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      toast.error("Error fetching categories:", error.message)
    } finally {
      setloading(false);
    }
  };



  useEffect(() => {
    setCategories(allCategory)
    fetchCategory();
  }, []);

  return (
    <section>
      <div className="p-2 shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Category</h2>
        <button
          className="border px-3 py-1 border-amber-300 hover:bg-amber-300 rounded-full cursor-pointer"
          onClick={() => setopenUploadCategory(true)}
        >
          Add Category
        </button>
      </div>

      {/* Show loading first */}
      {loading ? (
        <Loading />
      ) : categories.length === 0 ? (
        <p className='flex items-center justify-center h-full mt-6 text-xl font-semibold w-full'>
          No Data Found
        </p>
      ) : (
        <div className="flex flex-wrap gap-3 p-3">
          {allCategory.map((category, index) => (
            <div
              key={index}
              className="w-32 h-48 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between p-2"
            >
              <img
                src={category.image}
                alt={`Category ${index}`}
                className="w-full h-36 object-contain"
              />

              <div className="flex justify-between items-center mt-1">
                <button onClick={()=>{
                  setOpenEditCategory(true)
                  setCategoryData(category)
                }} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                  <FaRegEdit />
                </button>
                <button onClick={()=>{
                  setShowConfirm(true)
                  setCategoryData(category)
                }} className="text-red-500 hover:text-red-700 cursor-pointer">
                  <MdDeleteOutline />
                </button>
              </div>
            </div>


          ))}
        </div>
      )}

      {openUploadCategory && (
        <UploadCategory
         fetchCategory={fetchCategory}
          close={() => setopenUploadCategory(false)}
        />
      )}

      {
        openEditCategory && (
          <EditCategory 
           close={()=>setOpenEditCategory(false)}
           editData={categoryData}
           fetchCategory={fetchCategory}
          />
        )
      }

      {
        showConfirm && (
          <ConfirmDeletBox
           setShowConfirm={()=>setShowConfirm(false)}
           editData={categoryData}
           fetchCategory={fetchCategory}
          />
        )
      }

    </section>
  );
};

export default Category;
