import React, { useEffect, useState } from 'react'
import img from '../../assets/reset.png'
import baseUrl from '../../BaseUrl'
import axios from 'axios'
import { useNavigate, useRoutes } from 'react-router-dom'
// import useGetUser from '../../GetUser'
import Button from '@mui/material/Button';
import { SnackbarProvider, useSnackbar } from 'notistack';

const Resetpas = () => {
    const navigate = useNavigate();
    // const [{ user }] = useGetUser();
    const [message, setmessage] = useState('');
    const userId = sessionStorage.getItem('userId');
    const email = sessionStorage.getItem('email');
    const [msgerror, setmsgerror] = useState('Internal server error');
    const [msgsucces, setmsgsucces] = useState('Password reset successful');
    const handleClick = (variant) => {
        enqueueSnackbar(msgerror, { variant });
    };

    const handleClickVariant = (variant) => () => {
        enqueueSnackbar(msgsucces, { variant });
    };
    const { enqueueSnackbar } = useSnackbar();
    const [data, setdata] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: '',
        email: email,
    });
    const handleChanges = (e) => {
        const { name, value } = e.target;
        setdata({ ...data, [name]: value })
    };
    const reSet = () => {
        if (
            data.otp.trim() === '' ||
            data.newPassword.trim() === '' ||
            data.confirmPassword.trim() === '' ||
            data.email.trim() === ''
        ) {
            handleClick('error')();
            return;
        }

        if (data.newPassword !== data.confirmPassword) {
            setmsgerror("Password do not match");
            handleClick('error')();
            return;
        } else {
            axios.post(baseUrl + '/forgotPin', data).then((res) => {
                // console.log(res);
                handleClickVariant('success')();
                setmessage(res.data.message)
                if (res) {
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                    // sessionStorage.removeItem(email);
                }
            }).catch((err) => {
                console.log(err);
                setmsgerror(err.response.data.message)
                handleClick('error')();
            })
        }
    };
    return (
        <>
           
            <div className="h-screen text bg-slate-100">

                <section className="items-center flex">
                    <div className="container mx-auto flex px-5 md:py-24 md:flex-row flex-col pt-16 items-center">
                        <div className="lg:flex-grow md:w-3/4 lg:pr-2 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center border py-10 rounded-xl bg-white shadow-lg px-4 h-full">
                            <h1 className='w-full mb-6 font-serif text-2xl font-bold text-center text-indigo-500 underline underline-offset-4'>Reset Password</h1>
                            <div className="relative w-full input-group md:w-4/6 lg:w-1/2">
                                <label htmlFor="otp" className="leading-7 font-medium text-gray-600">Your OTP Code</label>
                                <input type="text" className='relative w-full border-2 rounded border-slate-400' placeholder="Your OTP Code"
                                    value={data.otp} onChange={handleChanges} name='otp' pattern="[0-9]{4}" />
                                <span className="input-error block mt-[5px] text-[13px] text-red-500">
                                    Not a valid email
                                </span>
                            </div>
                            <div className="relative w-full input-group md:w-4/6 lg:w-1/2">
                                <label htmlFor="otp" className="leading-7  font-medium text-gray-600">New Password</label>
                                <input type="text" className='relative w-full border-2 rounded border-slate-400' placeholder="New Password"
                                    value={data.newPassword} onChange={handleChanges} name='newPassword' pattern="[a-z0-9]{6,}" />
                                <span className="input-error block mt-[5px] text-[13px] text-red-500">
                                    Not a valid email
                                </span>
                            </div>
                            <div className="relative w-full input-group md:w-4/6 lg:w-1/2">
                                <label for="otp" className="leading-7  font-medium text-gray-600">Confirm Password</label>
                                <input type="text" className='relative w-full border-2 rounded border-slate-400' placeholder="Confirm Password"
                                    value={data.confirmPassword} onChange={handleChanges} name='confirmPassword' pattern="[a-z0-9]{6,}" />
                                <span className="input-error block mt-[5px] text-[13px] text-red-500">
                                    Not a valid email
                                </span>
                            </div>
                            <div className="flex justify-end mt-5 text">
                                <button onClick={reSet} className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg font-medium">
                                    Reset
                                </button>
                            </div>


                        </div>
                        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 h-fit hidden md:block lg:block">
                            <img className="object-cover object-center rounded" alt="hero" src={img} />
                        </div>
                    </div>
                </section>

            </div>
        </>
    )
}

export default Resetpas