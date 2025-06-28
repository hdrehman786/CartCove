import React, { useEffect, useState, useRef } from 'react';
import SummaryApi from '../common/SummaryApis';
import axios from 'axios';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { urlConvertor } from '../utils/urlConvertor';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const CategoryWiseProduct = ({ name, id }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity] = useState(1);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);

  const getproductbycategory = async (Id) => {
    try {
      setLoading(true);
      const response = await axios({
        ...SummaryApi.getproductbyCategory,
        data: { id: Id }
      });
      if (response?.data?.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  const addToCart = async (data) => {
    if (!user || !user._id) {
      return navigate("/login");
    }

    if (!data.stock || data.stock === 0) {
      return toast.error("This product is out of stock");
    }

    try {
      const response = await axios({
        ...SummaryApi.addproducttocart,
        data: {
          productId: data._id,
          userId: user._id,
          quantity: quantity
        }
      });

      if (response.data.success) {
        toast.success(`${data?.name || 'Product'} ${response.data.message}`);
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  useEffect(() => {
    getproductbycategory(id);
  }, [id, name]);

  const navigateTosingleProduct = (data) => {
    navigate(`/products/${urlConvertor(data.name)}-${data._id}`);
  };

  return (
    <div className='mx-auto container mt-4 px-2'>
      <div className='flex justify-between items-center'>
        <h2 className='font-semibold text-lg -tracking-wide'>{name}</h2>
        <button
          onClick={() => getproductbycategory(id)}
          className='text-green-700 hover:text-green-900 cursor-pointer'
        >
          See all
        </button>
      </div>

      {loading ? (
        <div className="flex overflow-x-hidden gap-5 mt-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-white shadow-md rounded-xl p-4 w-48 flex-shrink-0 flex flex-col gap-3">
              <div className="h-24 bg-gray-200 rounded-lg w-full"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              <div className="flex justify-between items-center mt-2">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 mt-6 italic">
          This category does not have any products.
        </div>
      ) : (
        <div className="relative mt-4">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-60 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all hidden md:block"
          >
            <FiChevronLeft className="text-gray-700" size={20} />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scroll-smooth gap-5 py-2 px-1 hide-scrollbar"
          >
            {products.map((prd, index) => (
              <div
                onClick={() => navigateTosingleProduct(prd)}
                key={index}
                className="bg-white shadow rounded-lg p-3 w-48 flex-shrink-0 flex flex-col gap-2 hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="h-32 bg-gray-50 rounded-md w-full flex items-center justify-center p-2">
                  <img
                    src={prd.images[0]}
                    className="h-full w-full object-contain mix-blend-multiply"
                    alt={prd.name}
                  />
                </div>

                <span className="text-xs font-medium text-green-700 bg-green-50 rounded-full px-2 py-1 w-fit">
                  10min
                </span>

                <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
                  {prd.name}
                </h3>
                <p className="text-xs text-gray-500">{prd.unit}</p>

                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-gray-900">
                      ${prd.price.toFixed(2)}
                    </span>
                    {prd.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ${prd.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(prd);
                    }}
                    className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-md p-2 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all hidden md:block"
          >
            <FiChevronRight className="text-gray-700" size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryWiseProduct;
