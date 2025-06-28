import React, { useEffect, useState, useRef } from 'react';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import SummaryApi from '../common/SummaryApis';
import axios from "axios";
import { useLocation } from "react-router-dom";

const SearchPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Start with loading true
    const [productCount, setProductCount] = useState(0);
    const location = useLocation();
    const debounceTimer = useRef(null);

    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            const response = await axios(SummaryApi.getProduct);
            const productsData = response.data?.data?.products || [];
            setProducts(productsData);
            setProductCount(productsData.length);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error loading products");
        } finally {
            setLoading(false);
        }
    };

    const fetchSearchedProducts = async (searchQuery) => {
        try {
            setLoading(true);
            const response = await axios({
                ...SummaryApi.getproductbysearch,
                data: { search: searchQuery }
            });
            const searchedProducts = response.data?.data || [];
            setProducts(searchedProducts);
            setProductCount(searchedProducts.length);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error searching products");
        } finally {
            setLoading(false);
        }
    };

    const urlConvertor = (str) => (str || '').trim().toLowerCase().replace(/\s+/g, '-');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get("query")?.trim() || "";

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (query) {
            debounceTimer.current = setTimeout(() => {
                fetchSearchedProducts(query);
            }, 500);
        } else {
            // Only fetch all products if there's no search query
            fetchAllProducts();
        }

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [location.search]);

    return (
        <section className="bg-white min-h-screen pt-4 container mx-auto px-2 sm:px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {location.search.includes('query=') ? "Search Results" : "All Products"}
                </h1>
                {!loading && (
                    <p className="text-gray-600">
                        Showing {productCount} {productCount === 1 ? 'product' : 'products'}
                    </p>
                )}
            </div>
            
            {loading ? (
                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-lg p-3 h-64 animate-pulse" />
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                    {products.map((product) => (
                        <Link
                            to={`/products/${urlConvertor(product.name)}-${product._id}`}
                            key={product._id}
                            className="bg-white shadow rounded-lg p-3 flex flex-col gap-2 hover:shadow-md transition-all border border-gray-100"
                        >
                            {/* Product card content remains the same */}
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
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toast.success(`${product.name} added to cart!`);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                    </svg>
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">
                        {location.search.includes('query=') 
                            ? "No products found matching your search" 
                            : "No products available"}
                    </p>
                </div>
            )}
        </section>
    );
};

export default SearchPage;