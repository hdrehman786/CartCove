import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/uploadImage';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/Axios';
import { useSelector } from 'react-redux';
import SummaryApi from '../common/SummaryApis';

const EditProduct = ({ close, editData, getProducts}) => {
  const allCategories = useSelector((state) => state.product.allCategory);
  const allSubCategories = useSelector((state) => state.product.subCategory);

  const [formData, setFormData] = useState({
    _id : "",
    name: '',
    description: '',
    category: [],
    subCategory: [],
    images: [],
    unit: '',
    stock: '',
    price: '',
    discount: ''
  });

  const [newImages, setNewImages] = useState([]);
  const [tempCategory, setTempCategory] = useState('');
  const [tempSubCategory, setTempSubCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        _id : editData._id,
        name: editData.name || '',
        description: editData.description || '',
        category: editData.category?.map(c => c._id) || [],
        subCategory: editData.subCategory?.map(sc => sc._id) || [],
        images: editData.images || [],
        unit: editData.unit || '',
        stock: editData.stock || '',
        price: editData.price || '',
        discount: editData.discount || ''
      });
    }
  }, [editData]);

  console.log("form data",formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = [];
    
    try {
      setLoading(true);
      for (const file of files) {
        const res = await uploadImage(file);
        if (res?.data?.url) {
          uploadedImages.push(res.data.url);
          toast.success("Image uploaded successfully");
        }
      }
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));
    } catch (error) {
      toast.error("Error uploading images");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.description || !formData.category?.length) {
    toast.error("Please fill all required fields");
    return;
  }

  try {
    setLoading(true);
    console.log("Sending to backend:", formData);

    const response = await axiosInstance({
      ...SummaryApi.updateProduct,
      data: formData
    });

    if (response) {
      toast.success(response.data.message || "Product updated successfully!");
      close();
      getProducts();
    } else {
      toast.error(response.data.message || "Something went wrong");
    }

  } catch (error) {
    console.error("Frontend error:", error);
    toast.error(error.response?.data?.message || "Error updating product");
  } finally {
    setLoading(false);
  }
};



  const filteredSubCategories = allSubCategories.filter(
    subCat => formData.subCategory.includes(subCat._id)
  );



  console.log("filtered categories", filteredSubCategories);

  return (
    <section className='fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center p-4 z-50'>
      <div className='max-w-2xl w-full bg-white rounded-lg shadow-xl overflow-y-auto max-h-[90vh]'>
        <div className='flex justify-between items-center p-4 border-b sticky top-0 bg-white'>
          <h1 className='text-lg font-semibold'>Edit Product</h1>
          <button onClick={close} className='text-gray-500 hover:text-gray-700'>
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-4 space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>Product Name*</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              required
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Category*</label>
              <div className="flex gap-2">
                <select
                  value={tempCategory}
                  onChange={(e) => setTempCategory(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded bg-blue-50"
                >
                  <option value="">Select category</option>
                  {allCategories.filter(c => !formData.category.includes(c._id)).map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => tempCategory && setFormData(prev => ({
                    ...prev,
                    category: [...prev.category, tempCategory]
                  }))}
                  className="px-3 py-2 bg-amber-300 hover:bg-amber-400 rounded"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.category.map(id => {
                  const cat = allCategories.find(c => c._id === id);
                  return cat && (
                    <span key={id} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-sm">
                      {cat.name}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          category: prev.category.filter(c => c !== id),
                          subCategory: prev.subCategory.filter(sc => {
                            const subCat = allSubCategories.find(s => s._id === sc);
                            return subCat?.category?._id !== id;
                          })
                        }))}
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
              <label className='block text-sm font-medium mb-2'>Subcategory</label>
              <div className="flex gap-2">
                <select
                  value={tempSubCategory}
                  onChange={(e) => setTempSubCategory(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded bg-blue-50"
                  disabled={!formData.category.length}
                >
                  <option value="">Select subcategory</option>
                  {allSubCategories.filter(sc => !formData.subCategory.includes(sc._id)).map(sc => (
                    <option key={sc._id} value={sc._id}>{sc.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => tempSubCategory && setFormData(prev => ({
                    ...prev,
                    subCategory: [...prev.subCategory, tempSubCategory]
                  }))}
                  className="px-3 py-2 bg-amber-300 hover:bg-amber-400 rounded"
                  disabled={!tempSubCategory}
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.subCategory.map(id => {
                  const subCat = allSubCategories.find(sc => sc._id === id);
                  return subCat && (
                    <span key={id} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-sm">
                      {subCat.name}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          subCategory: prev.subCategory.filter(sc => sc !== id)
                        }))}
                        className="ml-2 text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Unit*</label>
              <input
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>Stock*</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                min="0"
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>Price*</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded bg-blue-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Product Images</label>
            <div className='flex flex-wrap gap-3 mb-3'>
              {formData.images.map((img, index) => (
                <div key={index} className='relative w-24 h-24 border rounded bg-blue-50'>
                  <img 
                    src={img} 
                    alt={`Product ${index}`} 
                    className='w-full h-full object-contain p-1'
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center'
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <label className="cursor-pointer">
              <div className={`px-4 py-2 rounded border ${!loading ? 'bg-amber-300 hover:bg-amber-400' : 'bg-gray-400'} inline-block`}>
                {loading ? 'Uploading...' : 'Upload Images'}
              </div>
              <input
                type="file"
                onChange={handleImageUpload}
                className="hidden"
                multiple
                disabled={loading}
              />
            </label>
          </div>

          <div className='flex justify-end gap-3 pt-4'>
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.description || !formData.category.length}
              className={`px-4 py-2 rounded-md ${!loading && formData.name && formData.description && formData.category.length ? 'bg-amber-300 hover:bg-amber-400' : 'bg-gray-400'}`}
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditProduct;