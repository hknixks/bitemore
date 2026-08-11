import axios from "axios";
import React, { useEffect, useState } from "react";
import baseUrl from "../BaseUrl";
import StarRating from "./StarRating";
import Carosel from "../Componet/Carosel";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Menubutton from "./Dashboard/Menubutton";
import Whatapp from "./Dashboard/Whatapp";
// import useGetUser from "../GetUser";

const Gallary = () => {
    const [info, setinfo] = useState([]);
    const navigate = useNavigate();
    const [filter, setFilter] = useState("");
    const [cart, setcart] = useState({});
    const [myCarrt, setmyCarrt] = useState([]);
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        axios
            .get(baseUrl + `/api`)
            .then((res) => {
                setinfo(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const filteredInfo = info.filter((item) =>
        item.name.toLowerCase().includes(filter.toLowerCase())
    );

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };
    useEffect(() => {
        axios.get(baseUrl + `/getcart${userId}`)
            .then((res) => {
                setmyCarrt(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [cart])

    const ordernow = () => {
        setmyCarrt([...myCarrt, cart]);
        setIsOpen(false);
        axios.post(baseUrl + `/cart${userId}`, { cart, userId })
            .then((res) => {
            }).catch((err) => {
                console.log(err);
            })
    };
    const [isOpen, setIsOpen] = useState(false);

    const openModal = (item) => {
        setIsOpen(true);
        setcart(item);
    };

    const closeModal = () => {
        setIsOpen(false);
    };
    const [quantity, setQuantity] = useState(1);
    const itemPrice = parseFloat(cart.price);
    const total = (itemPrice * quantity).toFixed(2);

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    const modalClasses = isOpen ? "block" : "hidden";
    return (
        <>
            <Whatapp />
            <Carosel />
            <Menubutton />
            <div className="w-full text h-fit">
                <div className="w-full text-center ">
                    <input
                        type="text"
                        list="input"
                        className="w-full mx-auto border rounded shadow border-slate-300 md:w-3/5"
                        placeholder="Search for items..."
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
            <div className="py-4 font-mono text-xl font-medium tracking-wider text-center text-indigo-500 underline underline-offset-4 ">
                Our Main Dishes
            </div>
            <div className="text bg-slate-50">
                <div className="container flex flex-wrap mx-auto text">
                    {filteredInfo.map((item) => (
                        <div className="w-full  md:w-1/2.5 lg:w-1/3 sm:w-1/2" key={item.id}>
                            < div className="p-4" >
                                <div className="h-full overflow-hidden bg-white border-2 border-gray-200 rounded-lg border-opacity-60">
                                    <div className="text">
                                        <div className="absolute pt-3 text-white">
                                            <span className="bg-blue-100 text-lg font-medium text-blue-800 shadow-lg font-mono  mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">{item.rating}k</span>
                                        </div>
                                    </div>
                                    <img
                                        className="object-cover object-center w-full lg:h-48 h-44"
                                        src={item.image}
                                        alt={item.name}
                                    />
                                    <div className="p-6">
                                        <div className="flex justify-between text">
                                            <h1 className="mb-3 text-lg font-medium text-gray-900 title-font">
                                                {item.name.split("").map((each, index) => (
                                                    <span
                                                    key={index}
                                                        className={
                                                            filter.split("").includes(each)
                                                                ? "text-red-500"
                                                                : ""
                                                        }
                                                    >
                                                        {each}
                                                    </span>
                                                ))}
                                            </h1>
                                        </div>
                                        <div className="flex items-center mt-2.5 mb-2">
                                            <StarRating rating={item.rating} />
                                        </div>
                                        <p className="mb-3 leading-relaxed">{item.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-3xl font-bold text-gray-900 dark:text-white">${item.price}</span>
                                            <button onClick={() => openModal(item)} className="text-indigo-500 bg-slate-200 hover:bg-slate-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg cursor-pointer font-mono px-2  items-center inline-flex py-3 text-center dark:bg-blue-600 dark:hover:bg-slate-300 dark:focus:ring-blue-800 md:mb-2 lg:mb-0 h-fit ring-2">Order now
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
                                        <div className="flex items-center justify-between">

                                        </div>
                                    </div>
                                </div>
                            </div >
                        </div >
                    ))}
                </div >
            </div >
            {/* </div> */}
            < div className={`fixed z-10 inset-0 overflow-y-auto transition-all ease-in-out duration-500 delay-100 cursor-default ${modalClasses}`}>
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <div
                        className="inline-block w-full overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-headline"
                    >
                        <div className="p-2 pb-4 bg-white sm:p-6 sm:pb-4">
                            <img
                                src={cart.image}
                                alt=""
                                className="object-cover object-center w-full lg:h-48 h-44 rounded-xl"
                            />
                            <h3
                                className="py-3 font-mono text-xl font-bold leading-6 text-center text-gray-900 "
                                id="modal-headline"
                            >
                                {cart.name}
                            </h3>
                            <div className="mt-2">
                                <p className="w-full text-sm text-gray-500">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">${cart.price}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center mx-auto mb-3 text">
                            <button
                                onClick={decreaseQuantity}
                                type="button"
                                className="flex items-center px-5 py-1 text-3xl font-bold text-gray-600 bg-gray-200 border border-transparent rounded-lg h-fit hover:bg-slate-300"
                            >
                                -
                            </button>
                            <p className="flex items-center py-3 mx-8 text-xl font-bold text-gray-600 rounded-lg px-9 bg-slate-200 ">
                                {quantity}
                            </p>
                            <button
                                onClick={increaseQuantity}
                                type="button"
                                className="flex justify-center px-5 py-1 text-2xl font-bold text-gray-600 bg-gray-200 border border-transparent rounded-lg hover:bg-slate-300 h-fit"
                            >
                                +
                            </button>
                        </div>
                        <div className="flex px-4 py-3 mr-auto text-right bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                onClick={ordernow}
                                type="button"
                                className="inline-flex justify-center px-4 py-2 mx-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm w-fit hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Add
                            </button>
                            <button
                                onClick={closeModal}
                                type="button"
                                className="inline-flex justify-center px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm w-fit hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default Gallary;
