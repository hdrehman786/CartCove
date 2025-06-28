

import React from 'react'
import { useSelector } from 'react-redux';
import { FaRegUserCircle } from "react-icons/fa";

const Profile = () => {
    const user = useSelector(state => state.user);
    console.log("user data",user);
  return (
    <div className=' '>
    <div className='w-20 h-20 bg-red-500 flex items-center justify-center rounded-full'>
        {
            user.avatar ? (
                <img src={"https://res.cloudinary.com/dyjpecyav/image/upload/v1732125196/cld-sample.jpg"} alt={user.name} className='w-full h-full rounded-full object-cover object-center' />
            ) : (
                <FaRegUserCircle size={65}  />
            )
        }
    </div>
    <button className='border px-3 py-1 rounded-full mt-3 text-xs border-yellow-200 hover:bg-yellow-300 hover:border-yellow-400'>
        change profile
    </button>
    </div>
  )
}

export default Profile