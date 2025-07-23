
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6";
import React from 'react'

const Footer = () => {
    return (
        <footer className=' border-t' >
            <div className='container mx-auto p-4 text-center flex flex-col gap-2 lg:flex-row lg:justify-between'>
                <p>© All Right Reserved 2025</p>


                <div className="flex justify-center items-center gap-4 text-2xl">
                    <a href="" className=" hover:text-[#ffb100]">
                        <FaFacebook />
                    </a>
                    <a href="" className=" hover:text-[#ffb100]">
                        <FaInstagram />
                    </a>
                    <a href="" className=" hover:text-[#ffb100]">
                        <FaLinkedin />
                    </a>
                </div>
            </div>

        </footer>
    )
}

export default Footer