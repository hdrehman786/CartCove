import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import SummaryApi from '../common/SummaryApis';
import { FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';

const PaymentModal = ({ onClose, onSubmit }) => {
    const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '' });
    const [isPaying, setIsPaying] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCardInfo(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvv) {
            return toast.error("Please fill all card details");
        }
        setIsPaying(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsPaying(false);
        onSubmit();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaCreditCard /> Enter Card Details</h2>
                <form onSubmit={handlePaymentSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Card Number</label>
                        <input type="text" name="number" placeholder="**** **** **** ****" onChange={handleChange} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div className="flex gap-4 mb-6">
                        <div className="w-1/2">
                            <label className="block text-gray-700 mb-1">Expiry (MM/YY)</label>
                            <input type="text" name="expiry" placeholder="MM/YY" onChange={handleChange} className="w-full p-2 border rounded-md" required />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700 mb-1">CVV</label>
                            <input type="text" name="cvv" placeholder="***" onChange={handleChange} className="w-full p-2 border rounded-md" required />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancel</button>
                        <button type="submit" disabled={isPaying} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                            {isPaying ? 'Processing...' : 'Pay Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CheckoutPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state?.user);
    const userId = user?._id;

    const [cartItems, setCartItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);



    const fetchCheckoutData = async () => {
        setLoading(true);
        try {
            const [cartResponse, addressResponse] = await Promise.all([
                axios.get(`${SummaryApi.getproductfromcart.url}?userId=${userId}`),
            ]);

            console.log("cartResponse:", cartResponse);

            if (cartResponse.data.success) {
                setCartItems(cartResponse.data.data || []);
            }
            // if (addressResponse.data.success) {
            //     const data = addressResponse.data.data || [];
            //     setAddresses(data);
            //     if (data.length > 0) {
            //         setSelectedAddressId(data[0]._id);
            //     }
            // }
        } catch (error) {
            toast.error("Failed to load checkout data.");
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            const fetchAddresses = async () => {
                try {
                    const response = await axios({
                        ...SummaryApi.getaddress,
                        data: { userId: userId }
                    });

                    if (response.data.success) {
                        setAddresses(response.data.data);
                    } else {
                        console.error("Failed to fetch addresses:", response.data.message);
                    }
                } catch (err) {
                    console.error("Error fetching addresses:", err.message);
                }
            };
            fetchAddresses();
            fetchCheckoutData();
        }
    }, [userId]);

    const grandTotal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const price = item.productId?.price || 0;
            const discount = item.productId?.discount || 0;
            const quantity = item.quantity || 0;
            const discountedPrice = price - (price * discount / 100);
            return total + (discountedPrice * quantity);
        }, 0);
    }, [cartItems]);

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            return toast.error("Please select a shipping address.");
        }
        if (paymentMethod === 'online') {
            setShowPaymentModal(true);
        } else {
            await createOrder();
        }
    };

    const createOrder = async () => {
        setIsProcessing(true);
        setShowPaymentModal(false);
        try {
            const orderDetails = {
                userId,
                delivery_address: selectedAddressId,
                paymentMethod,
                productId: cartItems.map(item => item.productId._id),
                subTotal: grandTotal,
                total: grandTotal
            };
            

            const response = await axios({
                ...SummaryApi.placeOrderCOD,
                data: orderDetails
            });

            if (response.data.success) {
                toast.success("Order placed successfully!");
                setOrderPlaced(true);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to place order.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!userId) {
        return <div className="flex justify-center items-center h-screen"><p className="text-lg text-gray-500">Loading user information...</p></div>;
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p className="text-lg text-gray-500">Loading Checkout...</p></div>;
    }

    if (orderPlaced) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center p-4">
                <FaCheckCircle className="text-green-500 text-8xl mb-4" />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-6">Thank you for your purchase. You will receive an email confirmation shortly.</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    if (!loading && cartItems.length === 0 && !orderPlaced) {
        return (
            <div className="text-center p-10 min-h-screen">
                <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500">You can't checkout with an empty cart. Go add some products!</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 lg:p-8 bg-gray-50 min-h-screen">
            {showPaymentModal && <PaymentModal onClose={() => setShowPaymentModal(false)} onSubmit={createOrder} />}

            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Address & Payment */}
                <div className="w-full lg:w-2/3">
                    {/* Address Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><FaMapMarkerAlt className="text-blue-500" /> Shipping Address</h2>
                        {addresses.length > 0 ? (
                            <div className="space-y-4">
                                {addresses.map(addr => (
                                    <div
                                        key={addr._id}
                                        onClick={() => setSelectedAddressId(addr._id)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddressId === addr._id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                                    >
                                        <p className="font-semibold">{addr.address_line}</p>
                                        <p className="text-gray-600">{`${addr.city}, ${addr.state} ${addr.pincode}`}</p>
                                        <p className="text-gray-600">{addr.country}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No addresses found. Please add an address to your profile.</p>
                        )}
                        <button onClick={() => {
                            navigate('/dashboard/address', { state: { fromCheckout: true } });
                        }} className="text-blue-600 hover:underline mt-4 font-semibold">
                            + Add New Address
                        </button>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
                        <div className="space-y-4">
                            <div onClick={() => setPaymentMethod('cod')} className={`p-4 border rounded-lg cursor-pointer flex items-center gap-4 transition-all ${paymentMethod === 'cod' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                                <FaMoneyBillWave className="text-2xl text-green-500" />
                                <div>
                                    <h3 className="font-semibold">Cash on Delivery</h3>
                                    <p className="text-sm text-gray-500">Pay with cash upon delivery.</p>
                                </div>
                            </div>
                            <div onClick={() => setPaymentMethod('online')} className={`p-4 border rounded-lg cursor-pointer flex items-center gap-4 transition-all ${paymentMethod === 'online' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                                <FaCreditCard className="text-2xl text-indigo-500" />
                                <div>
                                    <h3 className="font-semibold">Pay Online</h3>
                                    <p className="text-sm text-gray-500">Pay with Card / UPI / NetBanking.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-2 mb-4">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">{item.productId.name} (x{item.quantity})</span>
                                    <span className="font-medium">${(item.productId.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <hr className="my-4" />
                        <div className="flex justify-between mb-4">
                            <span className="text-lg font-bold">Grand Total:</span>
                            <span className="text-lg font-bold text-blue-600">${grandTotal.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? 'Processing...' : `Place Order (${paymentMethod === 'cod' ? 'COD' : 'Pay Now'})`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
