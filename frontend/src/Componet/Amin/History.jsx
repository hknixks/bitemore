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

const History = () => {
    const { user } = useAdminAuthorization();
    const [info, setinfo] = useState([])
    console.log(info);

    useEffect(() => {
        axios
            .get(baseUrl + `/getAllUserHistory`)
            .then((res) => {
                setinfo(res.data.data)
                console.log(res.data)
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
    return (
        <>
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-semibold mb-4">Order History</h2>
                <div className="text">
                    {info && info.length > 0 ? (
                        info.map((item) => (
                            <li key={item._id} className="bg-white shadow-md rounded-lg p-4 mb-2 list-none">
                                <div className="flex justify-between items-center">
                                    <div className=''>
                                        <p className='font-medium text-[15px] py-2'>Status:
                                            <span className={`inline-block py-1 px-2 ms-3 rounded-full text-white ${item.status === 'Accepted' ? 'bg-green-500' : item.status === "Paid" ? "bg-blue-500" : 'bg-red-500'}`}>
                                                {item.status}
                                            </span> </p>
                                        <p className='font-medium text-[15px]'>Total price: ₦{commaNumber(item.totalFee)}</p>
                                        <p className='font-medium text-[15px]'>Delivery Type: {item.deliveryType}</p>
                                        <p className='font-medium text-[14px] py-2'>Tracking id: #{item._id.slice(-7)}</p>
                                        <p className='font-medium text-[14px]'>Date: {new Date(item.createdAt).toLocaleString()}</p>

                                    </div>

                                </div>
                                <div>
                                    <Accordion open={open === item._id} icon={<Icon id={item._id} open={open} />}>
                                        <AccordionHeader onClick={() => handleOpen(item._id)} className=' font-mono text-lg'>{open === item._id ? 'Show less' : 'Show more'}</AccordionHeader>
                                        <AccordionBody>
                                            <div>
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
                        <li>No orders found</li>
                    )}
                </div>
            </div>
        </>
    )
}

export default History