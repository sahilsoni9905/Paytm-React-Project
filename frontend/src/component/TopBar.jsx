import React from 'react'
import { Link } from 'react-router-dom'
function TopBar() {
  return (
    <div className='flex items-center justify-between p-4 md:p-6 shadow-md bg-gray-900 text-white'>
        <div><img src="" alt="IMG" /></div>
        <div className='flex items-center justify-center gap-8 text-gray-400 '>
            <Link to={"/signup"}><button className='border-2 font-bold border-gray-400 py-2 px-4 rounded-md hover:text-white hover:border-white hover:shadow-xl transition-all duration-300 ease-in'>SignUp</button></Link>
            <Link to={"/signin"}><button className=' border-2 font-bold border-gray-400 py-2 px-4 rounded-md hover:text-white hover:border-white hover:shadow-xl transition-all duration-300 ease-in'>SignIn</button></Link>
        </div>
    </div>
  )
}

export default TopBar