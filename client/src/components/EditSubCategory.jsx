import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/uploadImage';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/Axios';
import { useSelector } from 'react-redux';
import SummaryApi from '../common/SummaryApis';

const EditSubCategory = ({ close, fetchSubCategory, subCategoryData }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [categories, setCategories] = useState([]);
  const [tempCategory, setTempCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const allCategories = useSelector(state => state.product.allCategory);

  useEffect(() => {
    if (subCategoryData) {
      setName(subCategoryData.name || '');
      setImage(subCategoryData.image || '');
      setCategories(subCategoryData.category.map(cat => cat._id) || []);
    }
  }, [subCategoryData]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !image || !categories.length) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const result = await axiosInstance({
        ...SummaryApi.editSubCategory,
        data: {
          _id: subCategoryData._id,
          name,
          image,
          category: categories
        }
      });

      toast.success("SubCategory updated!");
      close();
      fetchSubCategory();
    } catch (error) {

      toast.error("Error updating subcategory");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const res = await uploadImage(file);
      res?.data?.url && setImage(res.data.url);
      toast.success(res.message || "Image uploaded successfully");
    }
  };

  return (
    <section className='fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center'>
      <div className='max-w-2xl w-full bg-white rounded p-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-lg font-semibold'>Edit SubCategory</h1>
          <button onClick={close}><IoClose size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className='mt-4 space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-3'>SubCategory Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-blue-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-3'>Parent Category</label>
            <div className="flex gap-2">
              <select
                value={tempCategory}
                onChange={(e) => setTempCategory(e.target.value)}
                className="flex-1 px-3 py-2 border rounded bg-blue-100"
              >
                <option value="">Select category</option>
                {allCategories.filter(c => !categories.includes(c._id)).map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => tempCategory && setCategories([...categories, tempCategory])}
                className="px-3 py-2 bg-amber-300 hover:bg-amber-400 rounded"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map(id => {
                const cat = allCategories.find(c => c._id === id);
                return cat && (
                  <span key={id} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {cat.name}
                    <button
                      type="button"
                      onClick={() => setCategories(categories.filter(c => c !== id))}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <p className='mb-2 font-medium'>Image</p>
            <div className='flex flex-col md:flex-row gap-3 items-center'>
              <div className='w-36 h-36 border rounded bg-blue-50 flex items-center justify-center'>
                {image ? (
                  <img src={image} className="w-full h-full object-contain" />
                ) : <span className="text-sm text-gray-500">No Image</span>}
              </div>
              <label className="cursor-pointer">
                <div className={`px-4 py-2 rounded border ${name ? 'bg-amber-300' : 'bg-gray-400'}`}>
                  Upload Image
                </div>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={!name || !image || !categories.length || loading}
            className={`w-full py-2 rounded-md border ${name && image && categories.length ? 'bg-amber-300' : 'bg-gray-400'}`}
          >
            {loading ? "Updating..." : "Update SubCategory"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditSubCategory;
