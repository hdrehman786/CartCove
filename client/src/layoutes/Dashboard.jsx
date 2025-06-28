

import React from 'react'
import UserMenue from '../components/UserMenue'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <section className=" bg-white">
        <div className=' container mx-auto p-3 lg:grid grid-cols-[250px_1fr]'>
            {/* left part for the menue */}
            <div  className=' py-2 top-24 sticky overflow-auto lg:block hidden border-r'>
                <UserMenue />
            </div>

            {/* right part for the content */}
            <div className=' bg-white min-h-[75vh] '>
                <Outlet />
            </div>
        </div>
    </section>
  )
}

export default Dashboard