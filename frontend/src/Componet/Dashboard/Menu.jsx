import React, { useState, useEffect } from 'react';
import { BsPlus } from "react-icons/bs";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
} from "@material-tailwind/react";
import img from '../../assets/food2.jpg';
import baseUrl from '../../BaseUrl';
import axios from 'axios';
import Loader from '../../utils/Loader';
import CartAlert from '../../utils/CartAlert';
import { useNavigate } from 'react-router-dom';
import commaNumber from 'comma-number';
import './button.css';

const Menu = () => {
    const [info, setInfo] = useState([]);
    const [searchFood, setSearchFood] = useState('');
    const [openAlert, setOpenAlert] = useState(false);
    const [status, setStatus] = useState('success');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(baseUrl + `/api`)
            .then((res) => {
                if (res.data.status) {
                    const shuffledData = res.data.data.sort(() => Math.random() - 0.5);
                    setInfo(shuffledData);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    const filteredInfo = info.filter((item) =>
        item.name.toLowerCase().includes(searchFood.toLowerCase())
    );



    const handleFilterChange = (e) => {
        setSearchFood(e.target.value);
    };


    return (
        <>
            {openAlert && <CartAlert setOpenAlert={setOpenAlert} openAlert={openAlert} message={message} status={status} />}
            <div className="mb-6">

                <div className="w-full text h-fit my-4">
                    <div className="w-full text-center px-5">
                        <input type="text" value={searchFood} onChange={handleFilterChange} className='w-full mx-auto border rounded shadow border-slate-300 md:w-3/5' placeholder='Search For Food...' />

                        <datalist id="input">
                            {info.map((item) => (
                                <option key={item.id} value={item.name} className="" />
                            ))}
                        </datalist>

                    </div>
                </div>


                <div className=" container mx-auto w-full overflow-x-auto scrollbar-hidden grid  grid-cols-1 md:grid-cols-4 gap-4">
                    {info.length > 0 ? (
                        filteredInfo.length > 0 ? (
                            filteredInfo.map((item, index) =>
                                index < 10 && (

                                    <center>

                                    <div className="max-w-sm bg-white  border  border-gray-200 rounded-lg  shadow" key={index}>
                                        <div className='w-full'>
                                            <img
                                                src={item.profileImage || img}
                                                alt={item.name}
                                                className="object-cover object-center w-full lg:h-48 h-44 "
                                            />
                                        </div>
                                        <div className="p-5">
                                            <a href="#">
                                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-dark">{item.name}</h5>
                                            </a>
                                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">₦ {commaNumber(item.price)}</p>
                                            <a onClick={() => navigate('/user/login')} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg">
                                                Order now
                                                <svg fill="currentColor" viewBox="0 0 24 24" className="icon ms-4">
                                                    <path clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" fillRule="evenodd"></path>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                    </center>

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
    );
}

export default Menu;
