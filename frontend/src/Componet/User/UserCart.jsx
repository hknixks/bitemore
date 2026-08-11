import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useEffect, useRef, useState } from "react";
import baseUrl from '../../BaseUrl'
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { BiDownload, BiMinus, BiPlus } from 'react-icons/bi';
import { FaCreditCard, FaPaypal, FaStripe, FaApple, FaGoogle } from 'react-icons/fa';
import Whatapp, { HomeDelivery } from '../Dashboard/Whatapp'
import Button from '@mui/material/Button';
import { Delete, PlusOneOutlined, Remove } from '@mui/icons-material';
import commaNumber from 'comma-number'
import useUserCart from '../../hooks/UserCartItem';
import Loader from '../../utils/Loader';
import PayMentCard from '../../utils/PayMentCard';
import { PaystackButton } from "react-paystack";
import { useSelector } from 'react-redux';
import { Textarea } from '@material-tailwind/react';


const UserCart = () => {
  const user = useSelector((state) => state.user.user)
  const { cart, refetch } = useUserCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [openCard, setOpenCard] = useState(false)

  useEffect(() => {
    refetch();
  }, [])

  const closeModal = () => setIsOpen(false);
  const payMentmethod = () => navigate('/user/checkout');

  const handleIncreaseQuantity = async (item) => {
    try {
      const resp = await axios.put(`${baseUrl}/cart/increaseQuantity/${item._id}`, { quantity: item.quantity + 1 });
      refetch();
    } catch (error) {
      enqueueSnackbar('Internal server error', { variant: 'error' });
    }
  };
  const handleDecreaseQuantity = async (item) => {
    if (item.quantity > 1) {
      try {
        const resp = await axios.put(`${baseUrl}/cart/decreaseQuantity/${item._id}`, { quantity: item.quantity - 1 });
        refetch();
      } catch (error) {
        enqueueSnackbar('Internal server error', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('Minimum quantity reached', { variant: 'warning' });
    }
  };
  const handleDeleteFromCart = async (item) => {
    try {
      const resp = await axios.delete(`${baseUrl}/deleteUserItem/${item._id}`);
      const message = resp.data.message
      enqueueSnackbar(message, { variant: 'success' });
      refetch()
    } catch (error) {
      enqueueSnackbar('Internal server error', { variant: 'error' });
    }
  };
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cart.forEach(item => {
      totalPrice += item.price * item.quantity;
    });
    return totalPrice;
  };
  const modalClasses = isOpen ? "block" : "hidden";
  const publicKey = 'pk_test_fb8e6ca8bf86aecccd78ba8772768e112d45e32a';

  const [paymentDetails, setPaymentDetails] = useState({
    email: user.email,
    amount: calculateTotalPrice(),
    reference: '',
    description: '',
  });

  const handlePaymentSuccess = (response) => {
    console.log('Payment successful', response);
  };

  const handlePaymentClose = () => {
  };
  return (
    <>
      <div className="text h-screen overflow-y-scroll bg-gray-100 ">
        
        <div className="text w-[85%] gap-7 md:flex justify-between container mx-auto " style={{marginTop:"5em"}}>
          <div className="text w-5/6 h-fit  bg-white rounded border shadow mb-6">
            <div className="text w-full p-3 text-[1.2rem] font-medium ">
              Cart({cart.length ?? 0})
            </div>
            <hr />
            {cart !== null ? (
              cart.length > 0 ? (
                cart.map((item, i) =>
                  <div className="text  w-full p-3" key={i}>
                    <div className="text w-full p-2 flex justify-between">
                      <Link to={''} className='flex justify-between'>
                        <div className="text flex justify-between w-[70%] gap-3">
                          <div className="text w-[30%]">
                            <img src={item.profileImage} alt="" className='rounded object-cover object-center w-full' />
                          </div>
                          <div className="text p-2 w-full text-sm line-clamp-5">
                            <p className='text-lg font-medium'>{item.name}</p>
                            {item.description}
                          </div>
                        </div>
                        <div className="text flex justify-center w-48 py-1">
                          <div className="text w-full">
                            <p className=' text-right font-medium text-xl'>₦ {commaNumber(item.price)}</p>
                            <div className="text text-right flex justify-end gap-3 mt-1">
                              <del>₦ 885,000 </del>
                              <p className='p-1 text-sm font-medium bg-[#fceee2] text-[#ffc374] w-fit'>-5%</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="text p-3 flex justify-between">
                      <Button className='!text-red-600' onClick={() => handleDeleteFromCart(item)}>
                        <Delete /> 
                      </Button>
                      <div className="text flex items-center gap-2">
                        <Button className='!bg-gray-600 !px-0 !text-white' onClick={() => handleIncreaseQuantity(item)}>
                          <BiPlus className='text-xl' />
                        </Button>
                        <div className="text px-2">
                          {item.quantity}
                        </div>
                        <Button className='!bg-gray-600 !px-0 !text-white' onClick={() => handleDecreaseQuantity(item)}>
                          <BiMinus className='text-xl' />
                        </Button>
                      </div>
                    </div>
                    <hr />
                  </div>
                )
              ) : (
                <div className="w-full bg-gray-100 p-4">
                  No item in your cart at the moment.
                </div>
              )
            ) : (
              <div className="w-full p-4">
                <Loader />
              </div>
            )}
          </div>
          <div className="md:w-2/6 h-fit bg-white rounded border shadow md:p-5 p-10">
            <div className="text-xl w-full p-3 text-[0.9rem] font-medium ">
              CART SUMMARY
            </div>
            <hr />
            <div className="text px-3 py-1 ">
              <div className="text text-center mx-auto flex justify-between items-center">
                <p className='text-lg font-medium'>Subtotal</p>
                <p className='text-right font-medium t003ext-xl'>₦ {commaNumber(calculateTotalPrice())}</p>
              </div>
              <small className='text-xs'>Delivery fees not included yet.</small>
              <hr className='my-2' />
              <button 
              disable={calculateTotalPrice() == 0}
              onClick={()=> {
                if(calculateTotalPrice() != 0) {
                  payMentmethod()
                } else {
                  enqueueSnackbar('Please add items to cart', { variant: 'warning' });
                }
              }}
               className='py-2 text-white bg-red-500 rounded hover:bg-red-700 w-full uppercase font-medium shadow-lg disabled:cursor-not-allowed disabled:opacity-100'>
                Checkout (₦ {commaNumber(calculateTotalPrice())})
              </button>
            </div>
          </div>
        </div>
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
              <button onClick={() => setIsOpen(false)} type="button" className="inline-flex justify-center px-4 py-2 font-black text-white bg-red-600 border border-transparent rounded-md shadow-sm cursor-pointer w-fit hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto">
                &times;
              </button>
            </div>
            <div className="p-2 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="container py-3 mx-auto">
                <h1 className="text-2xl font-bold text-center pb-5">Payment Methods</h1>
                <div className='grid'>
                  
                  <div className="w-full mt-3 border border-red-500 py-3">
                    <Textarea
                      label="Message"
                      value={paymentDetails.description}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, description: e.target.value })} />
                  </div>

                  <PaystackButton
                    text="Make Payment"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    publicKey={publicKey}
                    email={paymentDetails.email}
                    amount={paymentDetails.amount * 100}
                    onSuccess={handlePaymentSuccess}
                    onClose={handlePaymentClose}
                    reference={paymentDetails.reference}
                    description={paymentDetails.description}
                    currency="NGN"
                    channels={['card', 'bank_transfer']}
                    currencyFormat="NGN"
                    disabled={false}
                    customButton={<button>Custom Pay Button</button>}
                    embed={true}
                    textStyle={{ fontWeight: 'bold' }}
                    beforeInitialize={() => console.log('Initializing payment...')}
                    metadata={{
                      custom_fields: [
                        {
                          display_name: "Product Name",
                          variable_name: "product_name",
                          value: "Product X"
                        },
                        {
                          display_name: "Category",
                          variable_name: "category",
                          value: "Electronics"
                        }
                      ]
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >

      {/* <PayMentCard /> */}
      {openCard && <PayMentCard />}
      <Whatapp />
      <HomeDelivery />
    </>
  )
}

export default UserCart

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


