import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard/button.css';
import logo from ".././assets/bit.jpeg"

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <>
            <nav className="bg-[#F5F5F5] border-gray-200 ">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src={logo} className="h-11" alt=" Logo" />
                    </Link>
                    <div className="flex md:order-2 space-x-2 md:space-x-0 rtl:space-x-reverse">
                        

                        <div className="relative">
                        <button onClick={toggleDropdown} type="button" className="text-white bg-red-500 font-medium rounded-lg text-sm px-4 py-2 text-center cursor-pointer flex items-center">
                            Login
                        </button>
                                {dropdownOpen && (
                                    <div className="dropdown-content absolute bg-[#f9f9f9] z-10 rounded py-3 px-2">
                                        <ul className='navbar nav'>
                                            <li className='nav-item'>
                                                <Link className="block text-[1rem] font-medium px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" to='/user'>User</Link>
                                            </li>
                                            <li>
                                                <Link to='/admin' className="block px-3 py-2 text-[1rem] font-medium hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Admin</Link>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>




                        <button data-collapse-toggle="navbar-cta" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-cta" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4  rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                            <li>
                                <Link to="/" className="block py-2 px-3 md:p-0 text-dark font-semibold hover:font-bold hover:text-blue-800 text-xl " aria-current="page">Home</Link>
                            </li>
                            <li>
                                <a href="#service" className="block py-2 px-3 md:p-0 text-dark font-semibold hover:font-bold hover:text-blue-800 text-xl">Services</a>
                            </li>
                            <li>
                                <a href="#footer" className="block py-2 px-3 md:p-0 text-dark font-semibold hover:font-bold hover:text-blue-800 text-xl">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
           
        </>
    );
};

export default Navbar;
