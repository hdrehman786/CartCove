import React, { useEffect, useState } from 'react'
import Search from './Search'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FaRegUserCircle } from "react-icons/fa";
import { BsCart4 } from "react-icons/bs";
import useMobile from '../hooks/useMobile';
import { useSelector } from 'react-redux';
import { VscTriangleDown, VscTriangleUp  } from "react-icons/vsc";
import UserMenue from './UserMenue';
import UserMenuePage from '../pages/UserMenuePage';

const Header = () => {
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate("/login")
  }
  const [ isMobile ] = useMobile();
  const location = useLocation();
  const isSearch = location.pathname === '/search';
  const user = useSelector((state)=> state?.user);
  const [openuserMenue,setuserMenue] = useState(false);


  const handleusermobile = () => {
    if(!user._id){
      redirectToLogin()
    }else{
      navigate("/user-menue");
    }
  }
  

  return (
    <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 px-2 flex flex-col justify-center bg-white z-[1000]'>
      {
        !(isMobile && isSearch) && (
                <div className="container flex mx-auto items-center justify-between">
        {/* logo */}
        <Link to={'/'} className=" ">
          <h1 className="text-3xl lg:text-4xl font-bold  flex justify-center items-center">
            <span className=" font-extrabold bg-gradient-to-r from-yellow-400
             to-teal-400 bg-clip-text text-transparent">CartCove</span>
          </h1>
        </Link>
        {/* search */}
        <div className=' hidden lg:block'> 
          <Search  />
        </div>
        {/* login for the mobile version */}
        <div>
          <button onClick={handleusermobile} className=' text-neutral-800 block lg:hidden hover:cursor-pointer'>
            <FaRegUserCircle size={25} />
          </button>
        </div>
        {/* login for desktop version */}
        <div className=' hidden lg:flex items-center gap-10'>
          {
            user._id ? (
              <div className=" relative" onClick={()=>{
                setuserMenue(!openuserMenue)}}>
                <div  className=' flex items-center select-none gap-2 cursor-pointer'>
                  <p>
                    Account
                  </p>
                  {
                    openuserMenue ? <VscTriangleUp /> : <VscTriangleDown />
                  }
                </div>
                  {
                    openuserMenue && (
                      <div className=' absolute right-0 top-12 rounded'>
                      <div className=' bg-white rounded p-4 min-w-52 lg:shadow-lg'>
                      <UserMenue  />
                      </div>
                    </div>
                    )
                  }
              </div>
            ):(
              <button onClick={redirectToLogin} className='
              text-lg font-bold cursor-pointer
             '>
              Login
             </button>
            )
          }
           {/* {add to cart icons} */}
            <Link to={"/products/mycart"} className=' flex items-center gap-2 hover:bg-green-700 cursor-pointer bg-green-800 p-3 rounded text-white'>

              <div className=' animate-bounce'>
                <BsCart4 size={28} />
              </div>

              <div className=' font-semibold'>
                My Cart
              </div>
            </Link>
        

        </div>
      </div>
        )
      }
      <div className=' container mx-auto lg:hidden'>
        <Search />
      </div>
    </header>
  )
}

export default Header

