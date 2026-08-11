import React from 'react'
import './loader.css'
const Loader = () => {
  return (
    <div className="w-[100%] bg-[rgba(0,37,105,0.2)] h-[100vh] fixed top-0 left-0 z-[99999] flex items-center justify-center">
      <div className="flex items-center justify-center w-40 bg-white h-36 rounded-2xl shadow-3xl text">
        <div className="loader"></div>
      </div>

    </div>
  )
}

export default Loader