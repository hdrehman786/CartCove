import React, { useState, useEffect } from 'react'
import { IoMdCloudUpload } from "react-icons/io";
import uploadImage from '../utils/uploadImage';
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from 'react-redux';
import { SpinnerCircular } from 'spinners-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import SummaryApi from '../common/SummaryApis';
import axiosInstance from '../utils/Axios';


const UploadProduct = () => {
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: [],
        subCategory: [],
        images: [],
        stock: "",
        unit: "",
        discount: "",
        more_dwtails: {}
    });
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [temporaryCategory, setTemporaryCategory] = useState("");
    const [temporarySubCategory, setTemporarySubCategory] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const allCategoris = useSelector((state) => state.product.allCategory);
    const allSubCategories = useSelector((state) => state.product.subCategory);

    useEffect(() => {
        // Check if all required fields are filled
        const isValid =
            data.name.trim() !== "" &&
            data.description.trim() !== "" &&
            data.price !== "" &&
            data.category.length > 0 &&
            data.images.length > 0 &&
            data.stock !== "" &&
            data.unit !== "";

        setIsFormValid(isValid);
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    console.log("data that i have ", data);

    const handleImageChange = async (e) => {
        const image = e.target.files[0];
        if (!image) return;

        setImageUploading(true);
        try {
            const url = await uploadImage(image);
            console.log("Image uploaded successfully:", url);
            if (url) {
                setData(prevData => ({
                    ...prevData,
                    images: [...prevData.images, url.data.url]
                }));
            }
        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setImageUploading(false);
        }
    }

    const handleDelete = (index, e) => {
        console.log("delete", index);
        setData(prevData => ({
            ...prevData,
            images: prevData.images.filter((_, i) => i !== index)
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) return;

        setLoading(true);

        try {
            const response = await axiosInstance({
                ...SummaryApi.addProduct,
                data: data
            });

            const { data: respondedData, message } = response.data;
            toast.success(message || "Product uploaded successfully!");
            console.log("Product uploaded successfully:", respondedData);

            // Reset form
            setData({
                name: "",
                description: "",
                price: "",
                category: [],
                subCategory: [],
                images: [],
                stock: "",
                unit: "",
                discount: "",
                more_dwtails: {}
            });
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error.message || "Error uploading product. Please try again.";
            toast.error(errorMessage);
            console.error("Product upload error:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className='max-w-4xl mx-auto p-4'>
            <div className="flex justify-between items-center p-6 mb-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold text-gray-800">Upload New Product</h1>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
                <form onSubmit={handleSubmit} className='grid gap-6'>
                    {/* Name Field */}
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            id="name"
                            name='name'
                            required
                            value={data.name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                            className='bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent py-3 px-4 rounded-lg border border-gray-200 transition-all'
                        />
                    </div>

                    {/* Description Field */}
                    <div className="grid gap-2">
                        <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            rows="4"
                            name="description"
                            id="description"
                            value={data.description}
                            onChange={handleChange}
                            placeholder="Enter detailed product description"
                            required
                            className='bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent py-3 px-4 rounded-lg border border-gray-200 transition-all'
                        />
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Product Images</label>
                        <div className="space-y-4">
                            <label
                                htmlFor='productimage'
                                className={`w-full rounded-lg h-32 border-2 border-dashed flex flex-col justify-center items-center cursor-pointer transition-all 
                                    ${imageUploading ? 'border-amber-300 bg-amber-50' : 'border-gray-300 hover:border-amber-400 bg-gray-50'}`}
                            >
                                {imageUploading ? (
                                    <div className="flex flex-col items-center">
                                        <SpinnerCircular color="#F59E0B" size={8} />
                                        <p className="mt-3 text-amber-600">Uploading image...</p>
                                    </div>
                                ) : (
                                    <>
                                        <IoMdCloudUpload size={35} className="text-gray-400 mb-2" />
                                        <p className="text-gray-500">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    id="productimage"
                                    name="productimage"
                                    onChange={handleImageChange}
                                    className='hidden'
                                    accept='image/*'
                                    disabled={imageUploading}
                                />
                            </label>

                            {/* Image Preview Grid */}
                            {data.images.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({data.images.length})</h4>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                        {data.images.map((image, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square bg-gray-100 rounded-md overflow-hidden group"
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Product preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => {
                                                        console.log("delete", index);
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleDelete(index)
                                                    }}
                                                    aria-label="Delete image"
                                                >
                                                    <MdDeleteOutline className="text-lg" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Category Section */}
                    <div className="grid gap-3">
                        <label className="text-sm font-medium text-gray-700">Categories</label>
                        <div className="flex gap-2">
                            <select
                                onChange={(e) => setTemporaryCategory(e.target.value)}
                                value={temporaryCategory}
                                className="flex-1 bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent py-2 px-3 rounded-lg border border-gray-200"
                            >
                                <option value="">Select Category</option>
                                {allCategoris.filter(cat => !data.category.includes(cat._id))
                                    .map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                            </select>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (temporaryCategory) {
                                        setData(prev => ({
                                            ...prev,
                                            category: [...prev.category, temporaryCategory]
                                        }));
                                        setTemporaryCategory('');
                                    }
                                }}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                                disabled={!temporaryCategory}
                            >
                                Add
                            </button>
                        </div>

                        {/* Selected Categories */}
                        {data.category.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {data.category.map((categoryId) => {
                                    const cat = allCategoris.find(c => c._id === categoryId);
                                    return (
                                        <span
                                            key={categoryId}
                                            className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                                        >
                                            {cat?.name}
                                            <button
                                                onClick={() => setData(prev => ({
                                                    ...prev,
                                                    category: prev.category.filter(id => id !== categoryId)
                                                }))}
                                                className="text-gray-500 hover:text-red-500 transition-colors"
                                                aria-label="Remove category"
                                            >
                                                <MdDeleteOutline />
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Subcategory Section */}
                    <div className="grid gap-3">
                        <label className="text-sm font-medium text-gray-700">Subcategories</label>
                        <div className="flex gap-2">
                            <select
                                onChange={(e) => setTemporarySubCategory(e.target.value)}
                                value={temporarySubCategory}
                                className="flex-1 bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent py-2 px-3 rounded-lg border border-gray-200"
                            >
                                <option value="">Select Subcategory</option>
                                {allSubCategories.filter(cat => !data.subCategory.includes(cat._id))
                                    .map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                            </select>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (temporarySubCategory) {
                                        setData(prev => ({
                                            ...prev,
                                            subCategory: [...prev.subCategory, temporarySubCategory]
                                        }));
                                        setTemporarySubCategory('');
                                    }
                                }}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                                disabled={!temporarySubCategory}
                            >
                                Add
                            </button>
                        </div>

                        {/* Selected Subcategories */}
                        {data.subCategory.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {data.subCategory.map((categoryId) => {
                                    const cat = allSubCategories.find(c => c._id === categoryId);
                                    return (
                                        <span
                                            key={categoryId}
                                            className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                                        >
                                            {cat?.name}
                                            <button
                                                onClick={() => setData(prev => ({
                                                    ...prev,
                                                    subCategory: prev.subCategory.filter(id => id !== categoryId)
                                                }))}
                                                className="text-gray-500 hover:text-red-500 transition-colors"
                                                aria-label="Remove subcategory"
                                            >
                                                <MdDeleteOutline />
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Product Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Unit Field */}
                        <div className="grid gap-2">
                            <label htmlFor="unit" className="text-sm font-medium text-gray-700">Unit</label>
                            <input
                                type="text"
                                id="unit"
                                name='unit'
                                value={data.unit}
                                onChange={handleChange}
                                placeholder="e.g., 1, 5, 10"
                                required
                                className='bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent py-3 px-4 rounded-lg border border-gray-200'
                            />
                        </div>

                        {/* Price Field */}
                        <div className="grid gap-2">
                            <label htmlFor="price" className="text-sm font-medium text-gray-700">Price ($)</label>
                            <input
                                type="number"
                                id="price"
                                name='price'
                                value={data.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                required
                                className='bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent py-3 px-4 rounded-lg border border-gray-200'
                            />
                        </div>

                        {/* Stock Field */}
                        <div className="grid gap-2">
                            <label htmlFor="stock" className="text-sm font-medium text-gray-700">Stock Quantity</label>
                            <input
                                type="number"
                                id="stock"
                                name='stock'
                                value={data.stock}
                                onChange={handleChange}
                                placeholder="Available quantity"
                                required
                                className='bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent py-3 px-4 rounded-lg border border-gray-200'
                            />
                        </div>

                        {/* Discount Field */}
                        <div className="grid gap-2">
                            <label htmlFor="discount" className="text-sm font-medium text-gray-700">Discount (%)</label>
                            <input
                                type="number"
                                id="discount"
                                name='discount'
                                value={data.discount}
                                onChange={handleChange}
                                placeholder="0-100"
                                min="0"
                                max="100"
                                className='bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent py-3 px-4 rounded-lg border border-gray-200'
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className={`w-full text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md
                                ${!isFormValid || loading ? 'bg-amber-300 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'}`}
                            disabled={!isFormValid || loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <SpinnerCircular color="#ffffff" size={8} />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                'Upload Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default UploadProduct