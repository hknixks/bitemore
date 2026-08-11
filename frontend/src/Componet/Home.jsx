import React from 'react'
import Navbar from './Navbar'
import CarouselCustomNavigation from './Carosel';
// import Menubutton from './Dashboard/Menubutton';
import Whatapp from './Dashboard/Whatapp';
import Fotter from './Fotter';
import Scroll from './Dashboard/Scroll';
import img from './../assets/food2.jpg'
import landing from './../assets/landing.jpg'
import { BsArrowRightShort, BsBookmarkCheckFill } from 'react-icons/bs';
import { TbClock24 } from 'react-icons/tb';
import { MdOutlineFamilyRestroom } from 'react-icons/md';
import { FaAward } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import Menu from './Dashboard/Menu';


const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="text">
        <div className='text-center' id="landingimages">
          <div className="flex flex-col justify-center h-full px-5 py-5 text-white bg-opacity-50 border md:px-10 ">
            <div className='items-center font-serif text-3xl font-bold tracking-widest text-indigo-400 uppercase md:text-3xl md:font-medium '>
              Now Opening
              <span className='px-4 py-2 font-mono font-black animate-pulse'>
                24/7
              </span>
            </div>
            <div className='py-4 font-mono text-3xl font-medium text-white md:text-4xl md:font-bold '>
              Nigeria Food Restaurant
            </div>
            <div className="py-2 text-lg font-normal text-white md:text-xl md:py-4">
              Savor the flavors at <strong>Bitemore Restaurant.</strong> Your perfect spot for memorable dining experiences.
            </div>
          </div>
        </div>
      </div>
      <div id='service'>
      <Menu />
      <CarouselCustomNavigation />
      </div>
      <div className="py-8 text bg-gradient-to-b from-gray-100 to-gray-400">
        <div className="flex flex-wrap justify-evenly">
          <div className="w-1/2 p-2 text md:w-1/6">
            <div className={`bg-white py-6 shadow-lg rounded-lg  transition-transform duration-500 animate__animated animate__slideInLeft`} data-aos="fade-left">
              <h2 className="text-xl font-semibold text-center">
                <TbClock24 className='mx-auto text-5xl' />
              </h2>
              <p className="mt-6 font-serif text-3xl font-bold tracking-widest text-center text-yellow-300 mb-14">24/7</p>
              <p className="text-lg font-medium text-center">Working Hours</p>
            </div>
          </div>
          <div className="w-1/2 p-2 text md:w-1/6">
            <div className={`bg-white py-6 shadow-lg rounded-lg transition-transform duration-500 animate__animated animate__slideInLeft`} data-aos="fade-left">
              <h2 className="text-xl font-semibold text-center">
                <BsBookmarkCheckFill className='mx-auto text-5xl' />
              </h2>
              <p className="mt-6 font-serif text-3xl font-bold tracking-widest text-center text-yellow-300 mb-14">20</p>
              <p className="text-lg font-medium text-center">Complete Project</p>
            </div>
          </div>
          <div className="w-1/2 p-2 text md:w-1/6">
            <div className={`bg-white py-6 shadow-lg rounded-lg  transition-transform duration-500 animate__animated animate__slideInRight`} data-aos="fade-right">
              <h2 className="text-xl font-semibold text-center">
                <MdOutlineFamilyRestroom className='mx-auto text-5xl' />
              </h2>
              <p className="mt-6 font-serif text-3xl font-bold tracking-widest text-center text-yellow-300 mb-14">121</p>
              <p className="text-lg font-medium text-center">Happy Clients</p>
            </div>
          </div>
          <div className="w-1/2 p-2 text md:w-1/6">
            <div className={`bg-white py-6 shadow-lg rounded-lg  transition-transform duration-500 animate__animated animate__slideInRight`} data-aos="fade-right">
              <h2 className="text-xl font-semibold text-center">
                <FaAward className='mx-auto text-5xl' />
              </h2>
              <p className="mt-6 font-serif text-3xl font-bold tracking-widest text-center text-yellow-300 mb-14">5</p>
              <p className="text-lg font-medium text-center">Awards Received</p>
            </div>
          </div>
        </div>
      </div>
      <Scroll />

    <div className="container mx-auto text-center mb-10 mt-12 px-5">
      <h1 className="text-center font-bold text-3xl mb-9"> Why Choose Us?</h1>
      <div className=" md:flex w-full mx-auto justify-center gap-12 text-center ">
          
          <div className=" bg-black text-white rounded-lg p-5 mb-5">
            <p className='m-5'><i className="text-6xl fa-solid fa-truck"></i></p>
              <h1 className='text-xl font-bold mb-3'>Fast Delivery</h1>
              <small className="w-full text-gray-300">Get your food delivered fast and hot by <br/> fellow students or by logistics.</small>
          
          </div>
          <div className=" bg-black text-white rounded-lg p-5 mb-5">
            <p className='m-5'><i className="text-6xl fa-solid fa-shield-halved"></i></p>
              <h1 className='text-xl font-bold mb-3'>Secure</h1>
              <small className="w-full text-gray-300">You don't need to worry about your meal <br/> being tampered with!</small>
          </div>

          <div className=" bg-black text-white rounded-lg p-5 mb-5">
              <p className='m-5'><i className='text-6xl fas fa-arrow-down text-white'></i></p>
              <h1 className='text-xl font-bold mb-3'>Earn Extra Money</h1>
              <small className="w-full text-gray-300">Earn extra cash by picking up food orders <br/> and delivering them to your fellow students.</small>
          </div>

      </div>
    </div>

      <Whatapp />
      <div id="footer">
        <Fotter />
      </div>
    </>

  )
}

export default Home