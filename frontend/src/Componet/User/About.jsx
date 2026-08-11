import React, { useEffect, useState } from "react";
import img from '../../assets/food2.jpg'
import Fotter from "../../Componet/Fotter";
import { useNavigate, useLocation } from "react-router-dom";
import Whatapp from "../../Componet/Dashboard/Whatapp";
import { GiFamilyHouse, GiStairsGoal } from "react-icons/gi";
import { BsUniversalAccess } from "react-icons/bs";
import { FcServices } from "react-icons/fc";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FaMortarPestle } from "react-icons/fa6";
import useUserAuthorization from "../../hooks/UserAuth";
import { useSelector } from "react-redux";
import CarouselCustomNavigation from '../Carosel';
import Navbar from "../Navbar";

const About = () => {
  const navigate = useNavigate();
  // const { user } = useUserAuthorization();
  // const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    // Check if the URL includes "user"
    setShowNavbar(!location.pathname.includes("user"));
  }, [location.pathname]);


  return (
    <>
      {showNavbar && <Navbar />}
      <Whatapp />
      <div className="h-full md:h-[90vh] bg-no-repeat bg-cover w-full" style={{ backgroundImage: `url(${img})` }}>
        <div className="flex flex-col items-center justify-center h-full px-5 py-5 text-center text-white bg-opacity-50 border md:px-10 bg-slate-500 ">
          <div className='font-serif text-3xl font-bold tracking-widest text-white md:text-5xl md:font-medium '>
            Unlock Your  Potential at Save spoon
          </div>
          <div className=" border-t border-gray-50 my-3 w-full"></div>
          <div className="py-2 text-lg font-normal text-white md:text-2xl md:py-4 gap-3 flex items-center justify-center">
            <div className="text">
              Discover a world of taste and endless possibilities at.
            </div>

            {/* <button className="w-full py-2 font-medium text-white transition duration-150 ease-out border-2 border-white rounded-md md:text-lg hover:ease-in md:w-40 bg-gray-600" onClick={()=> navigate('/user/menu')}>
            See Menu
          </button> */}
          </div>
        </div>
      </div>
      <div className="text bg-blue-950 text-white w-full">
        <div className="container mx-auto px-6 py-12">
          <header className="font-serif text-2xl underline font-medium undeline-offset-4 mb-10">About us</header>
          <div className="px-4 py-2 mx-auto text">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora repudiandae et aliquam in, dolorem dolores eaque veniam enim, sequi explicabo tempore sit ipsum reprehenderit delectus ad eos? Sapiente nobis neque vel. Odit consequatur animi omnis tempore temporibus molestiae quaerat, rerum fugiat quasi quisquam vitae at optio ipsam atque iure, explicabo suscipit non dignissimos perspiciatis obcaecati, veritatis soluta quis. Repellat necessitatibus inventore rem pariatur provident obcaecati alias? Ipsum minima ea nemo. Vel, quaerat? Sunt doloribus explicabo sequi distinctio nobis laborum repellendus consequatur recusandae fugiat! Repellat excepturi necessitatibus explicabo aut quidem unde quis, beatae delectus voluptatem! Tempore soluta libero sed possimus error!
          </div>
        </div>
      </div>
      <div className="mx-auto text mt-4">
        <header className="flex items-center justify-center h-20 font-serif text-3xl font-medium text-center uppercase text bg-slate-200">What Makes Us Different</header>
        <div className="px-2 py-5 grid grid-cols-1 md:grid-cols-3 lg:gap-5 gap-5 sm:gap-3 text md:px-5">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="w-full p-4 text  bg-white border shadow-xl rounded-lg" key={item}>
              <BsUniversalAccess className="mx-auto text-5xl text-center text-sky-800 " />
              <header className="py-2 font-mono text-2xl tracking-widest text-center text-indigo-500 underline underline-offset-4 ">Culinary Mastery</header>
              Our chefs are not just masters of the kitchen; they are artists, crafting each dish with precision, passion, and creativity. Every plate that leaves our kitchen is a masterpiece, a fusion of flavors and textures that tantalize your taste buds.
            </div>
          ))}
        </div>
      </div>
      <div>
        <div>
          <div className="w-full p-3 mx-auto my-5 lg:w-5/6">
            <h1 className="my-8 text-2xl font-bold text-indigo-500 lg:text-4xl">Get in Touch!</h1>
            <input type="text" className="w-full px-3 py-2 my-3 text-base leading-8 text-gray-900 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded-lg shadow-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-gray-400 opacity-70" placeholder="Name" />
            <input type="email" className="w-full px-3 py-2 my-3 text-base leading-8 text-gray-900 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded-lg shadow-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-gray-400 opacity-70" placeholder="Email" />
            <input type="text" className="w-full px-3 py-2 my-3 text-base leading-8 text-gray-900 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded-lg shadow-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-gray-400 opacity-70" placeholder="Subject" />
            <textarea className="w-full h-32 px-3 py-1 mt-4 text-base leading-6 text-gray-900 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded-lg shadow-lg outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-gray-400 opacity-70" placeholder="Type your massage here..."></textarea>
            <button className="inline-flex px-6 py-2 my-4 text-lg font-medium text-white bg-indigo-600 border-0 rounded focus:outline-none hover:bg-indigo-700">
              Submit
            </button>
          </div>
        </div>
      </div>
      <Fotter />
    </>
  )
}

export default About