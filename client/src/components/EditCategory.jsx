import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/uploadImage';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/Axios';
import SummaryApi from '../common/SummaryApis';

const EditCategory = ({ close, fetchCategory, editData }) => {
  const [data, setData] = useState({ name: editData.name, image: editData.image,_id: editData._id });
  console.log(editData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await uploadImage(file);
      if (response?.data?.url) {
        setData((prev) => ({ ...prev, image: response.data.url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      toast.error("Image upload error");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name || !data.image) return;

    try {
      setLoading(true);
      const response = await axiosInstance({
        ...SummaryApi.editCategories,
        data: data,
      });

      const result = response.data;
      console.log(result);
      if (result.success === true) {
        toast.success(result.message || "Category added successfully!");
        close();
        fetchCategory();
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Error while adding category");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center'>
      <div className='max-w-2xl w-full bg-white rounded p-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-lg font-semibold'>Edit Category</h1>
          <button onClick={close}>
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
          <div>
            <label htmlFor="categoryName" className='block text-sm font-medium mb-3'>Category Name</label>
            <input
              id="categoryName"
              name="name"
              type="text"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="w-full px-3 py-2 border rounded bg-blue-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <p className='mb-2 font-medium'>Image</p>
            <div className='flex flex-col md:flex-row gap-3 items-center'>
              <div className='w-36 h-36 border rounded bg-blue-50 flex items-center justify-center'>
                {data.image ? (
                  <img src={data.image} alt="Category" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-sm text-gray-500">No Image</span>
                )}
              </div>

              <label htmlFor="uploadCategoryImage" className="cursor-pointer">
                <div className={`
                  px-4 py-2 rounded border 
                  ${data.name ? 'bg-amber-300 hover:bg-amber-400' : 'bg-gray-400 cursor-not-allowed'}
                `}>
                  Upload Image
                </div>
                <input
                  id="uploadCategoryImage"
                  type="file"
                  onChange={handleImageUpload}
                  disabled={!data.name}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={!data.name || !data.image || loading}
            className={`
              w-full py-2 rounded-md border
              ${data.name && data.image ? 'bg-amber-300 hover:bg-amber-400' : 'bg-gray-400 cursor-not-allowed'}
            `}
          >
            {loading ? "Editing..." : "Edit Category"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditCategory;
