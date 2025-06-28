import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SummaryApi from '../common/SummaryApis';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ProductDetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const allSubCategories = useSelector((state) => state.product.subCategory);
  const user = useSelector((state) => state.user);

  const categoryId = params.category?.split('-').pop();
  const subCategoryId = params.subCategory?.split('-').pop();

  const subCategories = useMemo(() => {
    return allSubCategories.filter((sub) =>
      sub.category.some((cat) => cat._id === categoryId)
    );
  }, [categoryId, allSubCategories]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await axios({
        ...SummaryApi.getproductsbycategoryandsubcategory,
        data: { categoryId, subCategoryId },
      });
      if (response.data?.data) {
        setData(response.data.data);
        if (!selectedSubCategoryId) {
          setSelectedSubCategoryId(subCategoryId);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductThroughSubCategory = async (subCategoryId) => {
    setLoading(true);
    try {
      const response = await axios({
        ...SummaryApi.getproductsbycategoryandsubcategory,
        data: { categoryId, subCategoryId },
      });
      if (response.data?.data) {
        setData(response.data.data);
        setSelectedSubCategoryId(subCategoryId);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!user || !user._id) {
      return navigate('/login');
    }

    if (!product.stock || product.stock === 0) {
      return toast.error('This product is out of stock');
    }

    try {
      const response = await axios({
        ...SummaryApi.addproducttocart,
        data: {
          productId: product._id,
          userId: user._id,
          quantity: 1,
        },
      });

      if (response.data.success) {
        toast.success(`${product.name} ${response.data.message}`);
      }
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [params, categoryId, subCategoryId]);

  const urlConvertor = (str) => (str || '').trim().toLowerCase().replace(/\s+/g, '-');

  return (
    <section className="bg-white min-h-screen pt-4 grid lg:grid-cols-[280px_1fr] md:grid-cols-[180px_1fr] grid-cols-[120px_1fr] container mx-auto px-2 sm:px-4">
      <aside className="bg-white shadow-md rounded-lg px-3 py-4 sticky top-4 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto">
        <h3 className="text-base font-semibold mb-3 text-gray-800 text-center border-b pb-2">
          Subcategories
        </h3>
        <div className="flex flex-col gap-1">
          {subCategories.length > 0 ? (
            subCategories.map((subCategory) => (
              <div
                key={subCategory._id}
                onClick={() => fetchProductThroughSubCategory(subCategory._id)}
                className={`text-sm px-2 py-1.5 rounded-md transition-all cursor-pointer duration-200 ${
                  selectedSubCategoryId === subCategory._id
                    ? 'text-green-600 bg-green-50 font-medium'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {subCategory.name}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No subcategories found</p>
          )}
        </div>
      </aside>

      <main className="px-2 sm:px-4 py-2">
        {loading ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-3 h-64 animate-pulse" />
            ))}
          </div>
        ) : data.length > 0 ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {data.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow rounded-lg p-3 flex flex-col gap-2 hover:shadow-md transition-all border border-gray-100"
              >
                <Link to={`/products/${urlConvertor(product.name)}-${product._id}`}>
                  <div className="aspect-square bg-gray-50 rounded-md flex items-center justify-center p-2">
                    <img
                      src={product.images?.[0]}
                      className="h-full w-full object-contain mix-blend-multiply"
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-green-700 bg-green-50 rounded-full px-2 py-1 w-fit">
                    10min
                  </span>
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500">{product.unit}</p>
                </Link>

                <div className="flex justify-between items-center mt-auto">
                  <div>
                    <span className="text-base font-bold text-gray-900">
                      ${product.price?.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through block">
                        ${product.originalPrice?.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white rounded-md p-2"
                    onClick={() => addToCart(product)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No products found in this category</p>
          </div>
        )}
      </main>
    </section>
  );
};

export default ProductDetailPage;
