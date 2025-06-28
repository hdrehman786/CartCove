import React, { useEffect, useState } from 'react';
import UploadSubCategory from '../components/UploadSubCategory';
import Loading from '../components/Loading';
import axiosInstance from '../utils/Axios';
import SummaryApi from '../common/SummaryApis';
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import DisplayTable from '../components/DisplayTable';
import {
  createColumnHelper,
} from '@tanstack/react-table'
import EditSubCategory from '../components/EditSubCategory';
import { toast } from 'react-toastify';
import ConfirmDeletBox from '../components/ConfirmDeleteCat';

const SubCategory = () => {
  const [openUploadSubCategory, setOpenUploadSubCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [openEditSubCategory, setOpenEditSubCategory] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const columnHelp = createColumnHelper();

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance({
        ...SummaryApi.getSubCategoris({
          page,
          limit
        })
      });
      const { data: responseData } = response;
      console.log("Subcategories fetched:", responseData.data);
      setSubCategories(responseData.data.subCategories);
      setTotalItems(responseData.data.pagination.totalItems);
      setTotalPages(responseData.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching subcategories:", error.message);
      toast.error("Error fetching subcategories");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const columns = [
    columnHelp.accessor('name', {
      header: 'Name',
    }),
    columnHelp.accessor('image',{
      header: 'Image',
      cell: ({row})=>{
        return <div className='flex items-center justify-center py-1'>
          <img src={row.original.image} alt={row.original.name} className='w-10 h-10 object-cover' />
        </div>
      }
    }),
    columnHelp.accessor('category', {
      header : "Category",
      cell: ({row})=>{
        return <div className='flex items-center justify-center py-1'>
          {row.original.category.map((cat,index)=><p  key={index} className='text-sm shadow-md px-1 inline-block'>{cat.name}</p>)}
        </div>
      }
    }),
    columnHelp.accessor('Action', {
      header: 'Action',
      cell: (({row})=>{
        return ( 
          <div className='flex items-center justify-center gap-3'>
            <button>
              <FaRegEdit
                className=" text-amber-300 text-lg cursor-pointer"
                onClick={() => {
                  setOpenEditSubCategory(true);
                  setSubCategoryData(row.original);
                }}
              />
            </button>
            <button>
              <MdDeleteOutline
                className="text-red-500 text-lg cursor-pointer"
                onClick={() => {
                  setShowConfirm(true);
                  setSubCategoryData(row.original);
                }}
              />
            </button>
          </div>
        )
      })
    })
  ];

  useEffect(() => {
    fetchSubCategory();
  }, [page, limit]);

  return (
    <section>
      <div className="p-2 shadow-md flex items-center justify-between">
        <h2 className="font-semibold">SubCategory</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Items per page:</span>
            <select 
              value={limit} 
              onChange={handleLimitChange}
              className="border rounded px-2 py-1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <button
            className="border px-3 py-1 border-amber-300 hover:bg-amber-300 rounded-full cursor-pointer"
            onClick={() => setOpenUploadSubCategory(true)}
          >
            Add SubCategory
          </button>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : subCategories.length === 0 ? (
        <p className='flex items-center justify-center h-full mt-6 text-xl font-semibold w-full'>
          No Data Found
        </p>
      ) : (
        <div>
          <DisplayTable data={subCategories} columns={columns} />
          <div className="flex justify-between items-center mt-4 px-4">
            <div>
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalItems)} of {totalItems} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-amber-300 hover:bg-amber-400'}`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded ${page === pageNum ? 'bg-amber-500 text-white' : 'bg-amber-300 hover:bg-amber-400'}`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-amber-300 hover:bg-amber-400'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {openUploadSubCategory && (
        <UploadSubCategory
          fetchSubCategory={fetchSubCategory}
          close={() => setOpenUploadSubCategory(false)}
        />
      )}

      {openEditSubCategory && (
        <EditSubCategory 
          close={() => setOpenEditSubCategory(false)}
          subCategoryData={subCategoryData}
          fetchSubCategory={fetchSubCategory}
        />
      )}
      
      {showConfirm && (
        <ConfirmDeletBox
          setShowConfirm={() => setShowConfirm(false)}
          editData={subCategoryData}
          fetchSubCategory={fetchSubCategory}
          endpoint={SummaryApi.deleteSubCategory}
        />
      )}
    </section>
  );
};

export default SubCategory;