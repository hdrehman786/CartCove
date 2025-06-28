

import React from 'react'
import UserMenue from '../components/UserMenue'
import { IoCloseSharp } from "react-icons/io5";
const UserMenuePage = () => {
  const handleClose = () => {
    window.history.back();
  }
  return (
    <section className=" h-full w-full bg-white py-2">
      <IoCloseSharp size={28} className=' text-neutral-800 block w-fit ml-auto cursor-pointer pr-3' onClick={handleClose} />
      <div className=' container mx-auto p-3'>
        <UserMenue />
      </div>
    </section>
  )
}

export default UserMenuePage