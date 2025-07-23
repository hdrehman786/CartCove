import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {

    return (
        <footer className='bg-neutral-800 text-white'>
            <div className='container mx-auto pt-10 pb-6 px-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>

                    {/* Column 1: Brand & Social */}
                    <div className='flex flex-col gap-4 items-center md:items-start'>
                        <Link to={'/'} className=" ">
                            <h2 className="text-3xl font-bold flex justify-center items-center">
                                <span className="font-extrabold bg-gradient-to-r from-yellow-400 to-teal-400 bg-clip-text text-transparent">
                                    CartCove
                                </span>
                            </h2>
                        </Link>
                        <p className='text-neutral-300 text-center md:text-left text-sm'>
                            Your one-stop shop for quality products and unbeatable prices. Discover a seamless shopping experience with us.
                        </p>
                        <div className="flex justify-center items-center gap-4 text-2xl mt-2">
                            <a href="#" className="text-neutral-400 hover:text-yellow-400 transition-colors duration-300">
                                <FaFacebook />
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-yellow-400 transition-colors duration-300">
                                <FaInstagram />
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-yellow-400 transition-colors duration-300">
                                <FaTwitter />
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-yellow-400 transition-colors duration-300">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Shop Links */}
                    <div className='text-center md:text-left'>
                        <h3 className='font-semibold text-lg mb-3'>Shop</h3>
                        <ul className='flex flex-col gap-2 text-neutral-300'>
                            <li><Link to="/products" className="hover:text-yellow-400 transition-colors duration-300">All Products</Link></li>
                            <li><Link to="/category/electronics" className="hover:text-yellow-400 transition-colors duration-300">Electronics</Link></li>
                            <li><Link to="/category/fashion" className="hover:text-yellow-400 transition-colors duration-300">Fashion</Link></li>
                            <li><Link to="/category/home-goods" className="hover:text-yellow-400 transition-colors duration-300">Home Goods</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Customer Support */}
                    <div className='text-center md:text-left'>
                        <h3 className='font-semibold text-lg mb-3'>Support</h3>
                        <ul className='flex flex-col gap-2 text-neutral-300'>
                            <li><Link to="/about-us" className="hover:text-yellow-400 transition-colors duration-300">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-yellow-400 transition-colors duration-300">Contact Us</Link></li>
                            <li><Link to="/faq" className="hover:text-yellow-400 transition-colors duration-300">FAQ</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-yellow-400 transition-colors duration-300">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div className='text-center md:text-left'>
                        <h3 className='font-semibold text-lg mb-3'>Stay Connected</h3>
                        <p className='text-neutral-300 mb-4 text-sm'>Subscribe to our newsletter for the latest updates and deals.</p>
                        <form className='flex flex-col sm:flex-row gap-2'>
                            <input
                                type="email"
                                placeholder="Your Email"
                                className='w-full px-3 py-2 rounded bg-neutral-700 border border-neutral-600 text-white focus:outline-none focus:border-yellow-400'
                            />
                            <button
                                type="submit"
                                className='bg-teal-500 text-white font-semibold py-2 px-4 rounded hover:bg-teal-600 transition-colors duration-300'
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className='border-t border-neutral-700 pt-6 mt-8 text-center text-sm text-neutral-400'>
                    <p>© {new Date().getFullYear()} CartCove. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;