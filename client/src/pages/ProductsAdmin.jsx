import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import axiosInstance from '../utils/Axios';
import SummaryApi from '../common/SummaryApis';
import { Link } from 'react-router-dom';
import EditProduct from '../components/EditProduct';
import ConfirmDeletBox from '../components/ConfirmDeleteCat';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editprdOpen,seteditprdOpen] = useState(false);
  const [editData,seteditData] = useState();
  const [deleteBox,setdeleteBox] = useState(false);
  const [productId,setproductId] = useState();


  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance(SummaryApi.getProduct);
      setProducts(response.data?.data.products || []);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Link to="/dashboard/upload-product" >
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Add Product
        </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="p-3">
              <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-3">
                <img 
                  className="w-full h-full object-contain p-2" 
                  src={product.images[0] || 'https://via.placeholder.com/300'} 
                  alt={product} 
                />
              </div>
              <div className="px-1 pb-2">
                <h3 className="font-medium text-gray-900 text-sm truncate">{product.productName}</h3>
                <p className="text-gray-900 font-semibold mt-1">${product.price?.toFixed(2)}</p>
                <div className="flex justify-between mt-2">
                  <span className={`text-xs py-1 px-2 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        seteditData(product)
                        seteditprdOpen(true)}}

                    >
                      <FaEdit size={16} />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() =>{
                         setproductId(product._id),
                         setdeleteBox(true)
                        }}
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {
          editprdOpen &&
          <EditProduct close={()=>seteditprdOpen(false)} editData={editData} getProducts={getProducts} />
        }
        {
          deleteBox && 
          <ConfirmDeletBox productId={productId} fetchProducts={getProducts} setdeleteBox={()=>setdeleteBox(false)} />
        }
        
      </div>
    </div>
  );
};

export default ProductsAdmin;