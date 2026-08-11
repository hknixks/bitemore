import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useEffect, useRef, useState } from "react";
import baseUrl from "../BaseUrl";
import { MdDelete, MdRestaurantMenu } from "react-icons/md";
import img from '../assets/food.jpg'
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { BiDownload } from 'react-icons/bi';
import Navbar from './Navbar';
import Whatapp from './Dashboard/Whatapp';
import { FaCreditCard, FaPaypal, FaStripe, FaApple, FaGoogle } from 'react-icons/fa';
import { BsPlus } from 'react-icons/bs';


const Mycart = () => {
  const userId = sessionStorage.getItem('userId');
  const [msgerror, setmsgerror] = useState('Item deleted not successfully')
  const [msgsucces, setmsgsucces] = useState('Item deleted successfully!')
  const [cartArr, setcartArr] = useState([]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const paymentMethods = [
    { name: 'Credit Card', icon: <FaCreditCard className="mx-4 text-3xl text-blue-500" /> },
    { name: 'PayPal', icon: <FaPaypal className="mx-4 text-3xl text-green-500" /> },
    { name: 'Stripe', icon: <FaStripe className="mx-4 text-3xl text-red-500" /> },
    { name: 'Apple Pay', icon: <FaApple className="mx-4 text-3xl text-indigo-500" /> },
    { name: 'Google Pay', icon: <FaGoogle className="mx-4 text-3xl text-yellow-500" /> },
  ];
  // const ref=useRef(true);  
  const payMentmethod = () => {
    setIsOpen(true);
  }

  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (variant) => {
    enqueueSnackbar(msgerror, { variant });
  };

  const handleClickVariant = (variant) => () => {
    enqueueSnackbar(msgsucces, { variant });
  };

  const fetchCartData = () => {
    axios.get(baseUrl + `/secondNavbar${userId}`)
      .then((res) => {
        // console.log(res);
        setcartArr(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    axios.get(baseUrl + `/secondNavbar${userId}`)
      .then((res) => {
        // console.log(res);
        setcartArr(res.data)
      }).catch((err) => {
        console.log(err);
      })
  }, [])

  const handleDeleteFromCart = (index) => {
    const id = cartArr[index]._id;
    axios.delete(baseUrl + `/deleteitem${id}`)
      .then((res) => {
        fetchCartData();
        // console.log(res);
        handleClickVariant('success')();
      }).catch((err) => {
        console.log(err);
        handleClick('error')();
      })
  };
  const todash = () => {
    navigate('/dashboard')
  }

  const modalClasses = isOpen ? "block" : "hidden";

  return (
    <>
      <Whatapp />
      <div className="px-5 py-2 text md:mt-20 mt-14">
        <div className="px-2 text-4xl font-black cursor-pointer text w-fit" onClick={todash}>
          ⇽
        </div>
        <hr className='mt-1' />
      </div>
      <div className="text">

        <section className="text-gray-600 body-font">
          <div className="container px-5 py-2 mx-auto">
            <div className="flex flex-wrap w-full mb-4">

              <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 font-serif tracking-widest text-gray-900">Welcome to Titus kichen</h1>
                <div className="h-1 w-20 bg-indigo-500 rounded"></div>
              </div>
              <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">heard of them Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos repellat, nam modi ab a itaque? Iusto, ullam ipsam, dolorum facilis fuga molestiae animi consectetur, qui architecto velit reprehenderit voluptatem veritatis. man bun deep jianbebrag.</p>
            </div>

          </div>
        </section>

      </div>
      {/* <div className='flex justify-center w-full p-2 border-b'>
        <ComboBox className='w-full mx-auto' />
      </div> */}
      <div className="mx-5 text">
        <div className="container w-full mx-auto text">
          <div className="m-4 flex flex-wrap">
            {cartArr.length === 0 ? (<div className='flex items-center justify-center w-full font-mono text-3xl font-bold tracking-wider text-center text-red-500 uppercase h-60 animate-pulse '>
              no item in your cart
            </div>) : (<div>
            </div>)}
            {cartArr.map((item, index) => (
              <div className="w-full  md:w-1/2.5 lg:w-1/3 sm:w-1/2" key={index}>
                <div className="m-1 text">


                  <div className="bg-gray-100 rounded-lg">
                    <img
                      className="object-cover object-center w-full h-40 mb-3 rounded"
                      src={item.cart.image}
                      alt={item.cart.name}
                    />
                    <h2 className="px-5 mb-4 text-lg font-medium text-gray-900 title-font">
                      {item.cart.name}
                    </h2>
                    <p className="px-5 mt-4 text-base font-semibold">Quality : 1</p>
                    <p className="px-5 mt-4 text-xl font-extrabold tracking-widest">$ {item.cart.price}</p>
                    <div className="px-5 pb-4 mt-4">
                      <button
                        className="flex items-center justify-center w-full px-2 py-1 mt-3 font-mono text-center text-white bg-red-500 rounded-lg hover:bg-red-600"
                        onClick={() => handleDeleteFromCart(index)}
                      >
                        Delete item <MdDelete className='mx-3 text-2xl' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
      <div className="flex justify-center w-full py-4 mx-auto text-center border text ">
        <button onClick={payMentmethod} className='flex items-center px-3 py-3 font-mono text-xl font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600'>Checkout <BiDownload className='mx-2 text-3xl animate-bounce' />
        </button>
      </div>

      < div className={`fixed z-10 inset-0 overflow-y-auto transition-all ease-in-out duration-500 delay-100 cursor-default items-center mt-10 ${modalClasses}`}>
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203; 
          </span>
          <div className="inline-block w-full overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline" >
            <div className="flex justify-end px-4 py-3 bg-gray-300 sm:px-6">
              <button onClick={() => setIsOpen(false)}  type="button"  className="inline-flex justify-center px-4 py-2 font-black text-white bg-red-600 border border-transparent rounded-md shadow-sm cursor-pointer w-fit hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto">
                &times;
              </button>
            </div>
            <div className="p-2 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="container py-3 mx-auto md:py-8">
                <h1 className="text-2xl font-bold text-center">Payment Methods</h1>
                <hr className='my-4' />
                <ul className="flex flex-wrap">
                  {paymentMethods.map((method, index) => (
                    <div className="w-full md:w-1/2 text " key={index}>
                      <li  className="flex items-center p-3 m-1 transition-all duration-300 ease-in-out border rounded-md shadow-md cursor-pointer md:p-4 md:m-2 hover:bg-slate-200 hover:scale-125">
                        {method.icon}
                        <span className="text-lg font-medium text">
                          {method.name}
                        </span>

                      </li>
                    </div>
                  ))}
                </ul>
              </div>

            </div>


          </div>
        </div>
      </div >
    </>

  )
}

export default Mycart

export function ComboBox() {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={top100Films}
      sx={{ width: 800 }}
      renderInput={(params) => <TextField {...params} label="Food" />}
    />
  );
}


const top100Films = [
  { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { label: 'Goodfellas', year: 1990 },
  { label: 'The Matrix', year: 1999 },
  { label: 'Dangal', year: 2016 },
  { label: 'The Sting', year: 1973 },
  { label: '2001: A Space Odyssey', year: 1968 },
  { label: "Singin' in the Rain", year: 1952 },
  { label: 'Toy Story', year: 1995 },
  { label: 'Bicycle Thieves', year: 1948 },
  { label: 'The Kid', year: 1921 },
  { label: 'Inglourious Basterds', year: 2009 },
  { label: 'Snatch', year: 2000 },
  { label: '3 Idiots', year: 2009 },
  { label: 'Monty Python and the Holy Grail', year: 1975 },
];