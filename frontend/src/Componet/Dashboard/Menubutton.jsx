import React, { useState, useEffect } from 'react'
import { BsPlus } from "react-icons/bs";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import img from '../../assets/food2.jpg'
import useUserCart from '../../hooks/UserCartItem';
import baseUrl from '../../BaseUrl'
import axios from 'axios'
import Loader from '../../utils/Loader';
import { ArrowForwardIosRounded } from '@mui/icons-material';
import './button.css'
import { IoMdArrowRoundForward } from "react-icons/io";
import StarRating from '../StarRating'
import commaNumber from 'comma-number'
// import useUserAuthorization from '../../hooks/UserAuth'
import CartAlert from '../../utils/CartAlert'
import { useNavigate } from 'react-router-dom';

const Menubutton = () => {
    // const { cart, refetch } = useUserCart();
    // const { user } = useUserAuthorization();

    const [info, setInfo] = useState([]);
    const [filter, setFilter] = useState([])
    const [openAlert, setOpenAlert] = useState(false);
    const [status, setStatus] = useState('success');
    const [message, setMessage] = useState('');

    const selectMenu = [
        { id: 1, name: "Rice Dishes", value: "rice" },
        { id: 2, name: "Pepper Soups", value: "soup" },
        { id: 3, name: "Snacks", value: "snacks" },
        { id: 4, name: "Swallows", value: "swallow" },
        { id: 5, name: "Meat and Protein", value: "Protein" },
        { id: 6, name: 'Vegetable Dishes', value: "vegetable" },
        { id: 7, name: 'Drinks', value: "drink" },
    ];
    useEffect(() => {
        axios
            .get(baseUrl + `/api`).then((res) => {
                const shuffledData = res.data.data.sort(() => Math.random() - 0.5);
                setInfo(shuffledData)
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        const dataInfo = info.filter((i) => !filter.includes(i.tag));
        setInfo(dataInfo);
        console.log(dataInfo);
        console.log(filter);
    }, [filter]);



    const toggleButton = (value) => {
        if (filter.includes(value)) {
            setFilter(filter.filter((item) => item !== value));
        } else {
            setFilter([...filter, value]);
        }
    };
  const navigate = useNavigate();


    const orderNow = async (item) => {
        setOpenAlert(false)
        const data = {
            item: item,
            status: 'Pending',
            // user: user,
            quantity: 1,
        }
        try {
            setOpenAlert(true)
            const resp = await axios.post(baseUrl + `/userCart`, data)
            setMessage(resp.data.message);
            // className=()
            if (resp.data.status) {
                setStatus('success');
            } else {
                setStatus('warning');
            }
        } catch (error) {
            console.log(error)
            setMessage(error.response.data.message);
            setStatus('error');
        } finally {
            // refetch()
            setTimeout(() => {
                setOpenAlert(false)
            }, 2500);
        }
    };
    return (
        <>
       {openAlert && <CartAlert setOpenAlert={setOpenAlert} openAlert={openAlert} message={message} status={status} />}
            <div className="mb-6 text">
                <div className="container flex flex-wrap justify-center mx-auto my-5 text">
                    {selectMenu.map((item) => (
                        <button key={item.id} className={`text-white border-0 py-2 px-2 transition-all  duration-300 ease-in-out font-medium focus:outline-none rounded text-sm flex items-center m-2 ${filter.includes(item.value) ? "bg-red-500 hover:bg-red-600" : "bg-indigo-500 hover:bg-indigo-600"}`} onClick={() => toggleButton(item.value)} >
                            {item.name}{" "}
                            {filter.includes(item.value) ? (
                                <BsPlus className="text-2xl transition-all duration-300 ease-in-out transform rotate-45 ms-2" />
                            ) : (
                                <BsPlus className="text-2xl transition-all duration-300 ease-in-out ms-2" />
                            )}
                        </button>
                    ))}
                </div>
                <div className="w-full overflow-x-auto scrollbar-hidden flex gap-5 pl-[5px] md:px-[20px] ">
                    {info !== null ? (
                        info.length > 0 ? (
                            info.map((item, i) =>
                                i < 10 && (
                                    <div className="mb-2 " key={i}>
                                        <Card className="w-64 cursor-pointer md:w-80">
                                            <img className="object-cover object-center w-full rounded-t-lg lg:h-48 h-44"
                                                src={item.profileImage}
                                                alt={item.name} />
                                            <CardBody>
                                                <Typography variant="h5" color="blue-gray" className="mb-2">
                                                    <div className="text-lg">
                                                        {item.name}
                                                    </div>
                                                </Typography>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">₦ {commaNumber(item.price)}</span>
                                                    {/* <div className="flex items-center mb-2">
                                                        <StarRating rating={item.rating} />
                                                    </div> */}
                                                </div>
                                                <div className='mt-3'>
                                                    <button  onClick={() => orderNow(item)} className="relative button ">
                                                        order now
                                                        <svg fill="currentColor" viewBox="0 0 24 24" className="icon ms-4">
                                                            <path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                )
                            )
                        ) : (
                            <div className="w-full p-4 bg-gray-100">
                                No food for sale at the moment.
                            </div>
                        )
                    ) : (
                        <div className="w-full p-4">
                            <Loader className="w-[50px] h-[50px]" />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Menubutton