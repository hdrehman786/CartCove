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

    // FIX: This function now uses a dedicated endpoint for updating quantity.
    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        // If user tries to decrease quantity below 1, remove the item instead.
        if (newQuantity < 1) {
            handleRemoveItem(cartItemId);
            return;
        }

        try {
            const response = await axios({
                ...SummaryApi.updateCartQuantity,
            data : {
                cartItemId: cartItemId,   // The ID of the document in the Cart collection
                newQuantity: newQuantity,
             } // The new total quantity
            });

            if (response.data.success) {
                // Optimistically update the UI for a snappy user experience
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item._id === cartItemId ? { ...item, quantity: newQuantity } : item
                    )
                );
                // Optional: Show a success toast, but can be annoying on every click.
                // toast.success("Quantity updated!");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update quantity");
        }
    };

    const handleRemoveItem = async (cartItemId) => {
          console.log("prouctId",cartItemId),
            console.log("userId",userId)
        try {
          
            const response = await axios({
                ...SummaryApi.removeCartQuantity,
                data : {
                    productId: cartItemId,
                    userId : userId
                }
        })
            if (response.data.success) {
                // Update state locally to remove the item instantly from the UI
                setCartItems(prevItems => prevItems.filter(item => item._id !== cartItemId));
                toast.success(response.data.message || "Item removed from cart.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to remove item");
        }
    };

    // Calculate totals using useMemo for performance
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

    // --- RENDER LOGIC ---

    if (loading) {
        return <div className="flex justify-center items-center h-full p-10"><p className="text-lg text-gray-500">Loading your cart...</p></div>;
    }

    if (!loading && cartItems.length === 0) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500">Looks like you haven't added anything to your cart yet.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">My Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Cart Items */}
                <div className="w-full lg:w-2/3">
                    <div className="flex flex-col gap-4">
                        {cartItems.map((item) => {
                            const originalPrice = item.productId?.price || 0;
                            const discount = item.productId?.discount || 0;
                            const discountedPrice = calculateDiscountedPrice(originalPrice, discount);

                            return (
                                <div key={item._id} className="flex items-center bg-white p-4 rounded-lg shadow-md gap-4">
                                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.productId?.images[0]} alt={item.productId?.name} className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-semibold">{item.productId?.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <p className="text-green-600 font-bold text-lg">${discountedPrice.toFixed(2)}</p>
                                            {discount > 0 && (<p className="text-gray-500 line-through text-sm">${originalPrice.toFixed(2)}</p>)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {/* FIX: The onClick now correctly passes the cart item's ID (_id) */}
                                        <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} className="w-8 h-8 bg-gray-200 rounded-full font-bold text-lg hover:bg-gray-300">-</button>
                                        <span className="text-lg w-10 text-center">{item.quantity}</span>
                                        <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 bg-gray-200 rounded-full font-bold text-lg hover:bg-gray-300">+</button>
                                    </div>
                                    <div className="text-right w-32">
                                        <p className="text-lg font-semibold">${(discountedPrice * item.quantity).toFixed(2)}</p>
                                        <button onClick={() => handleRemoveItem(item._id)} className="text-red-500 hover:text-red-700 mt-2 text-sm flex items-center gap-1 justify-end">
                                            <FaTrashAlt /> Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
                        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Total Items:</span>
                            <span className="font-semibold">{cartItems.length}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className="flex justify-between mb-2 text-green-600">
                                <span>You Saved:</span>
                                <span className="font-semibold">- ${totalDiscount.toFixed(2)}</span>
                            </div>
                        )}
                        <hr className="my-4" />
                        <div className="flex justify-between mb-4">
                            <span className="text-lg font-bold">Grand Total:</span>
                            <span className="text-lg font-bold">${grandTotal.toFixed(2)}</span>
                        </div>
                        <button 
                        onClick={() => navigate("/products/checkout")}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyCart;