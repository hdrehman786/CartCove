"use client"
import { useEffect, useState } from "react"
import UploadCategory from "../components/UploadCategory"
import Loading from "../components/Loading"
import axiosInstance from "../utils/Axios"
import SummaryApi from "../common/SummaryApis"
import { FaRegEdit } from "react-icons/fa"
import { MdDeleteOutline } from "react-icons/md"
import EditCategory from "../components/EditCategory"
import ConfirmDeletBox from "../components/ConfirmDeleteCat"
import { useDispatch, useSelector } from "react-redux"
import { setAllCategory } from "../store/ProductSlice"
import { toast } from "react-toastify"

const Category = () => {
  const [openUploadCategory, setopenUploadCategory] = useState(false)
  const [loading, setloading] = useState(false)
  const [categories, setCategories] = useState([])
  const [openEditCategory, setOpenEditCategory] = useState(false)
  const [categoryData, setCategoryData] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)

  const dispatch = useDispatch()
  const allCategory = useSelector((state) => state.product.allCategory)

  const fetchCategory = async () => {
    try {
      setloading(true)
      const response = await axiosInstance({
        ...SummaryApi.getCategories,
      })
      const { data: responsedata } = response
      setCategories(responsedata.data)
      dispatch(setAllCategory(responsedata.data))
    } catch (error) {
      console.error("Error fetching categories:", error.message)
      toast.error("Error fetching categories:", error.message)
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    setCategories(allCategory)
    fetchCategory()
  }, [])

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-3 sm:p-4 shadow-sm border-b flex items-center justify-between sticky top-0 z-10">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Category</h2>
        <button
          className="bg-amber-100 text-amber-700 px-3 py-1.5 sm:px-4 sm:py-2 border border-amber-300 hover:bg-amber-200 rounded-full text-sm sm:text-base font-medium transition-colors duration-200"
          onClick={() => setopenUploadCategory(true)}
        >
          Add Category
        </button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {loading ? (
          <Loading />
        ) : categories.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg sm:text-xl font-semibold text-gray-500">No Data Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {allCategory.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col p-2 sm:p-3 border border-gray-100"
              >
                {/* Image Container */}
                <div className="aspect-square bg-gray-50 rounded-md overflow-hidden mb-2 sm:mb-3">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={`Category ${index}`}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Category Name */}
                <div className="flex-1 mb-2">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-800 text-center truncate">
                    {category.name || `Category ${index + 1}`}
                  </h3>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 sm:gap-4">
                  <button
                    onClick={() => {
                      setOpenEditCategory(true)
                      setCategoryData(category)
                    }}
                    className="p-1.5 sm:p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors duration-200"
                  >
                    <FaRegEdit size={14} className="sm:hidden" />
                    <FaRegEdit size={16} className="hidden sm:block" />
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(true)
                      setCategoryData(category)
                    }}
                    className="p-1.5 sm:p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                  >
                    <MdDeleteOutline size={16} className="sm:hidden" />
                    <MdDeleteOutline size={18} className="hidden sm:block" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {openUploadCategory && (
        <UploadCategory fetchCategory={fetchCategory} close={() => setopenUploadCategory(false)} />
      )}

      {openEditCategory && (
        <EditCategory close={() => setOpenEditCategory(false)} editData={categoryData} fetchCategory={fetchCategory} />
      )}

      {showConfirm && (
        <ConfirmDeletBox
          setShowConfirm={() => setShowConfirm(false)}
          editData={categoryData}
          fetchCategory={fetchCategory}
        />
      )}
    </section>
  )
}

export default Category
