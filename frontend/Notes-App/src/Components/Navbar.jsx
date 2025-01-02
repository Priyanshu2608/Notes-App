import React from 'react'
import ProfileInfo from './Cards/ProfileInfo'

const Navbar = () => {
  return (
    <div className="bg-white flex items-center justify-between px-6 py-6 drop-shadow">
        <h2 className="text-xl font-medium text-black py-2">Notes</h2>

        <ProfileInfo/>
    </div>
  )
}

export default Navbar
