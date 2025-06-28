import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SummaryApi from '../common/SummaryApis';
import axios from 'axios';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const ProductShowDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: "",
        images: [],
        category: [],
        subCategory: [],
        price: 0,
        unit: "",
        stock: 0,
        discount: 0,
        description: ""
    });
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isInCart, setIsInCart] = useState(false);

    const user = useSelector((state) => state?.user);
    const id = params?.product?.split("-").pop();

    const fetchProducts = async () => {
        if (!id) {
            toast.error("Invalid product ID");
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await axios({
                ...SummaryApi.getproductbyid,
                data: { id },
            });

            if (response.data.data) {
                setData(response.data.data);
                if (response.data.data.images && response.data.data.images.length > 0) {
                    setActiveImage(response.data.data.images[0]);
                }
            } else {
                toast.error("Product data not found in response.");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error(error.response?.data?.message || "Failed to fetch product");
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchProducts();
    }, [id]);

    const sellingPrice = data.price - (data.price * data.discount / 100);

    console.log("id", id);

    const addToCart = async () => {
        if (!user || !user._id) {
            return navigate("/login");
        }

        if (data.stock === 0) return;

        try {
            const response = await axios({
                ...SummaryApi.addproducttocart,
                data: {
                    productId: id,
                    userId: user._id,
                    quantity: quantity
                }
            });

            if (response.data.success) {
                setIsInCart(true);
                toast.success(`${data.name + response.data.message} `);
            }
        } catch (error) {
            toast.error("Failed to add to cart");
        }
    };


    const incrementQuantity = () => {
        if (quantity < data.stock) {
            setQuantity(quantity + 1);
        }
    };

    const handleIncreaseQuantity = async () => {
        incrementQuantity(); // Update quantity immediately
        setTimeout(() => {
            addToCart(); // Add to cart after 500ms
        }, 500);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const removeFromCart = async () => {
        try {
            const response = await axios({
                ...SummaryApi.removeproductfromcart,
                data: {
                    productId: id,
                    userId: user._id
                }
            });

            if (response.data.success) {
                setIsInCart(false);
                setQuantity(1);
                toast.info(`${data.name} removed from cart`);
            }
        } catch (error) {
            toast.error("Failed to remove from cart");
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!data.name) {
        return (
            <div className='container mx-auto p-4 min-h-[calc(100vh-120px)] flex justify-center items-center'>
                <p className='text-2xl text-red-500'>Product not found.</p>
            </div>
        );
    }

    return (
        <section className='container mx-auto p-4'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Product Images */}
                <div className='flex flex-col gap-4'>
                    <div className='bg-slate-200 h-96 w-full p-4 rounded-lg flex justify-center items-center'>
                        <img src={activeImage} alt={data.name} className='h-full w-full object-scale-down mix-blend-multiply' />
                    </div>
                    <div className='flex gap-3 overflow-x-auto scrollbar-none'>
                        {data.images.map((imgUrl, index) => (
                            <div key={imgUrl + index} className='p-1 rounded bg-slate-100 cursor-pointer flex-shrink-0'>
                                <img
                                    src={imgUrl}
                                    alt={`thumbnail ${index + 1}`}
                                    className={`w-20 h-20 object-scale-down mix-blend-multiply ${activeImage === imgUrl ? 'border-2 border-red-500 rounded' : ''}`}
                                    onClick={() => setActiveImage(imgUrl)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2 flex-wrap'>
                        <p className='text-slate-500 capitalize bg-slate-100 px-2 py-1 rounded-full inline-block w-fit'>
                            {data?.category[0]?.name}
                        </p>
                        {data?.subCategory[0]?.name && (
                            <p className='text-slate-500 capitalize bg-slate-100 px-2 py-1 rounded-full inline-block w-fit'>
                                {data?.subCategory[0]?.name}
                            </p>
                        )}
                    </div>

                    <h2 className='text-3xl lg:text-4xl font-semibold'>{data?.name?.trim()}</h2>

                    <div className='flex items-center gap-2 text-yellow-400 my-1'>
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStarHalf />
                        <span className='text-sm text-slate-500'>(15 Reviews)</span>
                    </div>

                    <div className='flex items-center gap-3 my-2'>
                        <p className='text-red-600 font-bold text-3xl'>${sellingPrice.toFixed(2)}</p>
                        <p className='text-slate-400 line-through'>${data.price.toFixed(2)}</p>
                        <p className='text-green-600 font-semibold'>{data.discount}% off</p>
                    </div>

                    <p className='text-slate-600 font-medium'>Unit: {data.unit}</p>

                    <div className='my-2'>
                        <p className='text-lg font-semibold'>Description:</p>
                        <p className='text-slate-700'>{data.description}</p>
                    </div>

                    <p className={`font-semibold ${data.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.stock > 0 ? `In Stock (${data.stock} available)` : 'Out of Stock'}
                    </p>

                    <div className='flex flex-col sm:flex-row gap-3 my-4'>
                        <button className='bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full disabled:bg-slate-300' disabled={data.stock === 0}>
                            Buy Now
                        </button>

                        {isInCart ? (
                            <div className="flex items-center justify-center gap-3 w-full">
                                <button
                                    onClick={decrementQuantity}
                                    className="bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-slate-300"
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="font-bold px-4">{quantity}</span>
                                <button
                                    onClick={handleIncreaseQuantity}
                                    className="bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-slate-300"
                                    disabled={quantity >= data.stock}
                                >
                                    +
                                </button>
                                <button
                                    onClick={removeFromCart}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={addToCart}
                                className='bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full disabled:bg-slate-300'
                                disabled={data.stock === 0}
                            >
                                Add To Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductShowDetails;