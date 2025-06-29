import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SummaryApi from '../common/SummaryApis';
import { FaTrashAlt } from "react-icons/fa";
import { Navigate, useNavigate } from 'react-router-dom';

// Helper function to calculate the discounted price
const calculateDiscountedPrice = (price = 0, discount = 0) => {
    if (!discount || discount <= 0) {
        return price;
    }
    const discountAmount = (price * discount) / 100;
    return price - discountAmount;
};

const MyCart = () => {
    const user = useSelector((state) => state?.user);
    const userId = user?._id;

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProductFromCart = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`${SummaryApi.getproductfromcart.url}?userId=${userId}`);
            if (response.data.success) {
                setCartItems(response.data.data || []);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch cart products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductFromCart();
    }, [userId]);

    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveItem(cartItemId);
            return;
        }

        try {
            const response = await axios({
                ...SummaryApi.updateCartQuantity,
            data : {
                cartItemId: cartItemId,
                newQuantity: newQuantity,
             }
            });

            if (response.data.success) {
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item._id === cartItemId ? { ...item, quantity: newQuantity } : item
                    )
                );
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update quantity");
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            const response = await axios({
                ...SummaryApi.removeCartQuantity,
                data : {
                    productId: cartItemId,
                    userId : userId
                }
        })
            if (response.data.success) {
                setCartItems(prevItems => prevItems.filter(item => item._id !== cartItemId));
                toast.success(response.data.message || "Item removed from cart.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to remove item");
        }
    };

    const { grandTotal, totalDiscount } = useMemo(() => {
        let subtotal = 0;
        let originalTotal = 0;

        cartItems.forEach(item => {
            const originalPrice = item.productId?.price || 0;
            const discount = item.productId?.discount || 0;
            const quantity = item.quantity || 0;
            
            const discountedPrice = calculateDiscountedPrice(originalPrice, discount);
            
            subtotal += discountedPrice * quantity;
            originalTotal += originalPrice * quantity;
        });

        return {
            grandTotal: subtotal,
            totalDiscount: originalTotal - subtotal,
        };
    }, [cartItems]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p className="text-lg text-gray-500">Loading your cart...</p></div>;
    }

    if (!loading && cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-4">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-2 sm:p-4">
                <h1 className="text-2xl md:text-3xl font-bold my-4 md:my-6 text-center text-gray-800">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side: Cart Items */}
                    <div className="w-full lg:w-2/3 space-y-3">
                        {cartItems.map((item) => {
                            const originalPrice = item.productId?.price || 0;
                            const discount = item.productId?.discount || 0;
                            const discountedPrice = calculateDiscountedPrice(originalPrice, discount);

                            return (
                                <div key={item._id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border flex items-center gap-4">
                                    {/* Image Container (Fixed size) */}
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                        <img src={item.productId?.images[0]} alt={item.productId?.name} className="w-full h-full object-cover"/>
                                    </div>
                                    
                                    {/* Details Container */}
                                    <div className="flex-grow flex flex-col gap-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 pr-2">
                                                {item.productId?.name}
                                            </h3>
                                            <button onClick={() => handleRemoveItem(item._id)} className="text-gray-500 hover:text-red-600  cursor-pointer flex-shrink-0">
                                                <FaTrashAlt size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <p className="text-base sm:text-lg font-bold text-green-600">${discountedPrice.toFixed(2)}</p>
                                            {discount > 0 && (<p className="text-xs text-gray-400 line-through">${originalPrice.toFixed(2)}</p>)}
                                        </div>

                                        <div className="flex items-center justify-between mt-1">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center cursor-pointer  bg-gray-200 rounded-full font-semibold text-sm hover:bg-gray-300">-</button>
                                                <span className="text-base w-8 text-center font-medium">{item.quantity}</span>
                                                <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center cursor-pointer  bg-gray-200 rounded-full font-semibold text-sm hover:bg-gray-300">+</button>
                                            </div>
                                            <p className="text-sm sm:text-base font-semibold text-gray-800">
                                                ${(discountedPrice * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                            <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold text-gray-800">${(grandTotal + totalDiscount).toFixed(2)}</span>
                                </div>
                                {totalDiscount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span className="font-semibold">- ${totalDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-bold text-gray-800">Grand Total</span>
                                <span className="text-xl font-bold text-gray-900">${grandTotal.toFixed(2)}</span>
                            </div>
                            <button 
                            onClick={() => navigate("/products/checkout")}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-base md:text-lg hover:bg-blue-700 transition-colors">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyCart;