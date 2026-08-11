import axios from 'axios';
import React, { useEffect, useState } from 'react'
import baseUrl from '../../BaseUrl';
import useAdminAuthorization from '../../hooks/AdminAuth';
import commaNumber from 'comma-number'
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import { useSnackbar } from 'notistack';


const Order = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAdminAuthorization();
    const [info, setInfo] = useState([])

    useEffect(() => {
        axios
            .get(baseUrl + `/getNewOrder`)
            .then((res) => {
                setInfo(res.data.data)
            }).catch((err) => console.log(err));
    }, []);

    function Icon({ id, open }) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
        );
    }
    const [open, setOpen] = React.useState(0);

    const handleOpen = (value) => setOpen(open === value ? 0 : value);

    const acceptOffer = async (orderId) => {
        try {
            const res = await axios.post(baseUrl + '/acceptOffer', { orderId });
            if (res.status === 200) {
                setInfo(prevInfo => prevInfo.filter(item => item._id !== orderId));
                enqueueSnackbar('Order accepted successfully!', { variant: 'success' });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const declineOffer = async (orderId) => {
        try {
            const res = await axios.post(baseUrl + '/declineOffer', { orderId });
            if (res.status === 200) {
                setInfo(prevInfo => prevInfo.filter(item => item._id !== orderId));
                enqueueSnackbar('Order declined successfully!', { variant: 'success' });
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <div className="text">
                <main className="flex-1 overflow-y-auto p-6">
                    <section className="mb-8">
                        <h2 className="text-xl mb-4">Orders</h2>

                        <ul>
                            {info && info.length > 0 ? (
                                info.map((item) => (
                                    <li key={item._id} className="bg-white shadow-md rounded-lg p-4 mb-2 ">
                                    <div className="flex justify-between items-center">
                                        <div className=''>
                                            <p className='font-medium text-[15px]'>Full Name: {item.user.firstname} {item.user.lastname}</p>
                                            <p className='font-medium text-[15px] py-2'>Status: <span className='border rounded-lg px-2.5 py-1 text-[blue] font-[500] border-[blue]'>{item.status}</span> </p>
                                            <p className='font-medium text-[15px]'>Total price: ₦{commaNumber(item.totalFee)}</p>
                                            <p className='font-medium text-[15px]'>Delivery Type: {item.deliveryType}</p>
                                            <p className='font-medium text-[14px] py-2'>Tracking id: #{item._id.slice(-7)}</p>
                                            <p className='font-medium text-[14px]'>Date: {new Date(item.createdAt).toLocaleString()}</p>

                                        </div>
                                        <div className="text grid gap-2">
                                            <button
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                                onClick={() => acceptOffer(item._id)}
                                            >
                                                Mark Complete
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                onClick={() => declineOffer(item._id)}
                                            >
                                                Mark Decline
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <Accordion open={open === item._id} icon={<Icon id={item._id} open={open} />}>
                                            <AccordionHeader onClick={() => handleOpen(item._id)} className=' font-mono text-lg'>{open === item._id ? 'Show less' : 'Show more'}</AccordionHeader>
                                            <AccordionBody>
                                                <div>
                                                    <p className='font-medium text-[15px]'>Email: {item.user.email} </p>
                                                    <p className='font-medium text-[15px]'>Phone Number:  {item.phoneNo} </p>
                                                    <p className='font-medium text-[15px]'>Price: ₦{commaNumber(item.amount)}</p>
                                                    <p className='font-medium text-[15px]'>Delivery fee: ₦{commaNumber(item.deliveryFee)}</p>
                                                    <p className='font-medium text-[15px]'>Address: {item.address}</p>
                                                    <p className='font-medium text-[15px]'>State: {item.state}</p>
                                                    <div className="text font-medium text-[15px]">
                                                        <div className="text uppercase underline py-2">
                                                            Order
                                                        </div>
                                                        {item.cart.map((food, index) => (
                                                            <div className="text " key={index}>
                                                                {index + 1} {food.name} ({food.quantity})
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </AccordionBody>
                                        </Accordion>
                                    </div>
                                </li>
                                ))
                            ) : (
                                <div className="text w-full bg-slate-300 py-2 px-2">
                                    <li>No orders found</li>
                                </div>
                            )}
                        </ul>
                        
                    </section>
                </main>
            </div>
        </>
    )
}

export default Order