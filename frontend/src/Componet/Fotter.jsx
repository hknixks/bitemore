import React from 'react'
import logo from ".././assets/bit.jpeg"

const Fotter = () => {
  return (
    <>
      <div className="text">

        <footer className="text-white body-font bg-black p-5">

        <div className="">
            <div className="container px-5 py-5 mx-auto flex items-center sm:flex-row flex-col">
              <img src={logo} alt='logo' className='h-10' />

              <span className="ml-3  font-bold">Bitemore </span>
              <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                
                <a className=" font-extrabold">
                  <svg fill="currentColor" strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                  </svg>
                </a>
                <a className="ml-3 font-extrabold">
                  <svg fill="currentColor" strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                  </svg>
                </a>
                <a className="ml-3  font-extrabold">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                  </svg>
                </a>
                <a className="ml-3  font-extrabold">
                  <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" stroke-linejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
                    <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                    <circle cx="4" cy="4" r="2" stroke="none"></circle>
                  </svg>
                </a>
              </span>
            </div>
          </div>

          <div className='bg-black border-t-2 border-white'>
            <div className="container text-center text-white mx-auto px-5 py-8 ">
              <div className="flex flex-wrap md:text-left text-center order-first">
                <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                  <h2 className="tracking-widest text-xl mb-3">Quick link</h2>
                  <nav className="list-none mb-10">
                    <li>
                      <a className="hover:text-blue-800 ">First Link</a>
                    </li>
                    <li>
                      <a className="hover:text-blue-800 ">Second Link</a>
                    </li>
                    <li>
                      <a className="hover:text-blue-800 ">Third Link</a>
                    </li>
                    <li>
                      <a className="hover:text-blue-800 ">Fourth Link</a>
                    </li>
                  </nav>
                </div>
                <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                  <h2 className="title-font font-medium  tracking-widest text-xl mb-3">links</h2>
                  <nav className="list-none mb-10">
                    <li>
                      <a className="hover:text-blue-800 ">First Link</a>
                    </li>
                    <li>
                      <a className="hover:text-blue-800 ">Second Link</a>
                    </li>
                    <li>
                      <a className="hover:text-blue-800 ">Third Link</a>
                    </li>
                    <li>
                      <a className="hover:text-blue-800 ">Fourth Link</a>
                    </li>
                  </nav>
                </div>
                <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                  <h2 className="title-font font-medium text-white tracking-widest text-xl mb-3">SUBSCRIBE</h2>
                  <div className="flex xl:flex-nowrap md:flex-nowrap lg:flex-wrap flex-wrap justify-center items-end md:justify-start">
                    <div className="relative w-40 sm:w-auto xl:mr-4 lg:mr-0 sm:mr-4 mr-2">
                      <label htmlFor="footer-field" className="leading-7 text-sm text-white">Get in touch with us</label>
                      <textarea type="text" id="footer-field" name="footer-field" className="w-full  bg-white  rounded border border-dark text-base outline-none  leading-8 transition-colors duration-200 ease-in-out" />
                    </div>
                    <button className="lg:mt-2 xl:mt-0 flex-shrink-0 inline-flex text-white bg-red-600 font-semibold border-0 py-2 px-6 focus:outline-none rounded">Send</button>
                  </div>
                 
                  <p className="text-white text-sm mt-2 md:text-left text-center">Get better experience at Bitemore Resturant,
                    <br className="lg:block hidden" />we give the maximum satisfaction
                  </p>
                
                </div>
              </div>
            </div>

          </div>
          
        </footer>

      </div>
    </>
  )
}

export default Fotter