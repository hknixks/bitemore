import React, { useEffect, useState } from 'react'
import Whatapp, { HomeDelivery } from '../Dashboard/Whatapp'
import CarouselCustomNavigation from '../Carosel';
import Menubutton from '../Dashboard/Menubutton'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import baseUrl from '../../BaseUrl'
import StarRating from '../StarRating'
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { Cancel, Troubleshoot } from '@mui/icons-material';
import commaNumber from 'comma-number'
import useUserAuthorization from '../../hooks/UserAuth'
import CartAlert from '../../utils/CartAlert'
import useUserCart from '../../hooks/UserCartItem'

const UserMenu = () => {
    const { cart, refetch } = useUserCart();
    const { user } = useUserAuthorization();

    const [info, setinfo] = useState([]);
    const navigate = useNavigate();
    const [filter, setFilter] = useState("");
    const [openAlert, setOpenAlert] = useState(false);
    const [status, setStatus] = useState('success');
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios
            .get(baseUrl + `/api`)
            .then((res) => {

                setinfo(res.data.data)
            }
            )
            .catch((err) => console.log(err));
    }, []);

    const filteredInfo = info.filter((item) =>
        item.name.toLowerCase().includes(filter.toLowerCase())
    );

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };
    const orderNow = async (item) => {
        setOpenAlert(false)
        const data = {
            item: item,
            status: 'Pending',
            user: user._id,
            quantity: 1,
        }
        try {
            setOpenAlert(true)
            const resp = await axios.post(`${baseUrl}/userCart`, data)

            setMessage(resp.data.message);
            setStatus(resp.data.status ? 'success' : 'warning');
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
            setStatus('error');
        } finally {
            refetch();
            setTimeout(() => {
                setOpenAlert(false)
            }, 2500);
        }
    };

    return (
        <>
            {openAlert && <CartAlert setOpenAlert={setOpenAlert} openAlert={openAlert} message={message} status={status} />}

            <div className="w-full text h-fit my-4">
                <div className="w-full text-center ">
                    <input
                        type="text"
                        list="input"
                        className="w-full mx-auto border rounded shadow border-slate-300 md:w-3/5"
                        placeholder="Search for foods..."
                        value={filter}
                        onChange={handleFilterChange}
                    />
                    <datalist id="input">
                        {info.map((item) => (
                            <option key={item.id} value={item.name} className="" />
                        ))}
                    </datalist>
                </div>
            </div>
            <hr className="mx-3" />
            <div className="py-4 font-mono text-2xl font-bold tracking-wider text-center text-red-600 underline underline-offset-4 ">
                Our Main Dishes
            </div>
            <div className="text bg-slate-50 px-2">
                <div className="container flex flex-wrap mx-auto">
                    {filteredInfo.map((item, index) => (
                        <div className="w-full  md:w-1/2 lg:w-1/4 sm:w-1/2" key={index}>
                            < div className="p-1.5" >
                                <div className="overflow-hidden bg-white shadow-lg rounded-lg border-opacity-60 cursor-pointer h-[21rem]">
                                    <div className="text">
                                    </div>
                                    <img className="object-cover object-center w-full lg:h-48 h-44"

                                        src={item.profileImage}
                                        alt={item.name}
                                    />
                                    <div className="p-2">
                                        <div className="flex justify-between text">
                                            <h1 className="mb-2 text-lg font-medium text-gray-900 title-font line-clamp-1">
                                                {item.name.split("").map((each, index) => (
                                                    <span key={index} className={`${filter.split("").includes(each)
                                                        ? "text-red-500"
                                                        : ""}`}>
                                                        {each}
                                                    </span>
                                                ))}
                                            </h1>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-gray-900">₦ {commaNumber(item.price)}</span>
                                            <button onClick={() => orderNow(item)} className="text-white bg-red-600 font-medium rounded-lg cursor-pointer px-2 items-center inline-flex py-3 text-center md:mb-2 lg:mb-0 h-fit">Order now
                                                <svg
                                                    className="w-4 h-4 ml-2"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    stroke-linejoin="round"
                                                >
                                                    <path d="M5 12h14"></path>
                                                    <path d="M12 5l7 7-7 7"></path>
                                                </svg></button>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </div >
                    ))}
                </div >
            </div >
            <HomeDelivery />
            <Whatapp />
        </>
    )
}

export default UserMenu

export function DialogDefault({ open, handleClose, item }) {
    const { user } = useUserAuthorization();
    const itemPrice = Number(item.price)
    const [quality, setQuality] = useState(1)
    const [totalPrice, setTotalPrice] = useState(itemPrice * quality);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('success')

    const data = {
        item: item,
        totalPrice: totalPrice,
        status: 'Pending',
        user: user,
    }
    const handleOpen = () => {
        handleClose();
        setQuality(1);
    };
    const decreaseQuality = () => {
        if (quality > 1) {
            setQuality(previous => previous - 1);
        }
    };
    useEffect(() => {
        const total = itemPrice * quality;
        setTotalPrice(total);
    }, [quality, itemPrice])



    const handleSubmit = async () => {

        setLoading(true);
        try {
            const resp = await axios.post(baseUrl + `/userCart`, data)
            const message = resp.data.message
            if (resp.data.status) {
                setMessage(message);
                const timer = setTimeout(() => {
                    setStatus('success');
                }, 3000);
            } else {
                setMessage(message);
                const timer = setTimeout(() => {
                    setStatus('success');
                }, 3000);
            }
        } catch (error) {
            const message = error.response.data.message
            setMessage(message);
            const timer = setTimeout(() => {
                setStatus('error');
            }, 3000);
        } finally {
            setLoading(false);
            handleClose();
            setQuality(1);
        }
    };

    return (
        <>
            {loading && <CartAlert setLoading={setLoading} loading={loading} message={message} status={status} />}
            <Dialog open={open} handler={handleOpen} size={"xs"}>
                <DialogHeader className='flex justify-between'>
                    <div className="text">
                        Item
                    </div>
                    <Button variant="text" color="red" onClick={handleOpen} >
                        <Cancel />
                    </Button>
                </DialogHeader>
                <DialogBody>
                    <img
                        src={item.profileImage}
                        alt={item.name}
                        className="object-cover object-center w-full lg:h-48 h-44 rounded-xl"
                    />
                    <h3 className="py-3 font-mono text-xl font-bold leading-6 text-center text-gray-900">
                        {item.name}
                    </h3>
                    <div className="mt-2">
                        <p className="w-full text-gray-500 text-xl font-bold mb-2">
                            Price: <span className=" text-gray-900 dark:text-white">₦ {commaNumber(itemPrice)}</span>
                        </p>
                        <p className="w-full text-gray-500 text-xl font-bold">
                            Total price: <span className="text-gray-900 dark:text-white">₦ {commaNumber(totalPrice)}</span>
                        </p>
                    </div>
                    <div className="flex items-center justify-center mx-auto mt-3 text">
                        <button
                            onClick={decreaseQuality}
                            type="button"
                            className="flex items-center px-5 py-1 text-3xl font-bold text-gray-600 bg-gray-200 border border-transparent rounded-lg h-fit hover:bg-slate-300"
                        >
                            -
                        </button>
                        <p className="flex items-center py-3 mx-8 text-xl font-bold text-gray-600 rounded-lg px-9 bg-slate-300 ">
                            {quality}
                        </p>
                        <button
                            onClick={() => setQuality(previous => previous + 1)}
                            type="button"
                            className="flex justify-center px-5 py-1 text-2xl font-bold text-gray-600 bg-gray-200 border border-transparent rounded-lg hover:bg-slate-300 h-fit"
                        >
                            +
                        </button>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <div className="flex w-full py-3 bg-gray-100 justify-between gap-2 px-3">
                        <button
                            onClick={handleSubmit}
                            type="button"
                            className="px-4 py-2 w-1/2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md sm:text-sm">
                            Add to cart
                        </button>
                        <button
                            onClick={handleOpen}
                            className="px-4 py-2 w-1/2 text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md sm:text-sm">
                            Close
                        </button>
                    </div>
                </DialogFooter>
            </Dialog >
        </>
    );
}