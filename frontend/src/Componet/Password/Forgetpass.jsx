import React, { useEffect, useState } from 'react'
import logingif from '../../assets/reset.png';
import axios from 'axios';
import baseUrl from '../../BaseUrl';
import { useNavigate } from 'react-router-dom';

const Forgetpass = () => {
    const [email, setemail] = useState('');
    const [message, setmessage] = useState('')
    const [errMsg, seterrMsg] = useState('')
    const navigate = useNavigate();

    const handleChanges = (e) => {
        setemail(e.target.value)
    }
    const handlesubmmit = () => {
        console.log(email);
        axios.post(baseUrl + '/resetpass', { email })
            .then((res) => {
                console.log(res);
                setmessage(res.data.message);
                // if (res.data.status) {
                //     sessionStorage.email = email;
                //     navigate('/resetpassword')
                // }

            }).catch((err) => {
                seterrMsg(err.response.data.message)
                console.log(err.response.data.message);
                console.log(err);
            })
    }

    return (
        <div className="text">

            <div className="flex items-center justify-between h-screen text bg-slate-200 md:p-20">
                <div className="flex flex-wrap justify-between w-full h-screen mx-auto text">
                    <div className="flex items-center w-full bg-blue-500 text lg:w-1/3 md:rounded-full lg:rounded-none">
                        <div className="text">
                            <div className="px-5 text">
                                {/* <div className="text-4xl hidden lg:block -mt- mb-10 font-black cursor-pointer text-white text w-fit" onClick={toLogin} >
                                    ⇽
                                </div> */}
                            </div>
                            <div className="mx-auto">
                                <img src={logingif} alt="" className='w-full' />
                            </div>
                        </div>
                    </div>
                    <div className="relative z-30 w-full pt-3 bg-white border text md:2/3 lg:w-2/3">
                        <div className="h-full px-3 mx-auto text lg:w-4/5 md:w-4/5">
                            <div className="px-3 py-3 text-center font-mono text-2xl font-bold text md:py-5 underline underline-offset-4 text-indigo-500">
                                Forgot password
                            </div>
                            <div className="items-center w-full md:py-8 border bg-white drop-shadow-lg rounded-lg text h-fit lg:mx-16 md:mx-16">
                                <div className="relative input-group p-2">
                                {message !== '' ? <div className="bg-green-100 border-l-4 rounded border-green-500 text-green-700 mx-3 p-4" role="alert">
                                        <p className="font-medium text-xl font-mono text-green-500 animate-pulse">{message}</p>
                                    </div> : ''}
                                    {errMsg !== '' ? <div className="bg-green-100 border-l-4 rounded border-red-500 text-red-700 mx-3 p-4 my-5" role="alert">
                                        <p className="font-medium text-xl font-mono text-red-500 animate-pulse">{errMsg}</p>
                                    </div> : ''}
                                    <input type="email" className='relative w-full border-2 rounded border-slate-400' placeholder="Enter your email" onChange={handleChanges} value={email} />
                                    <span className="input-error block mt-[5px] text-[13px] text-red-500">
                                        Not a valid email
                                    </span>
                                </div>
                                <div className="text px-2">
                                    <button className="outline-none mt-2 shadow-2xl bg-blue-500 rounded-lg  w-full p-3 mx- transition-all ease-in-out duration-300 text-white hover:border-[#035ec5] hover:border-solid border font-mono font-bold text-lg disabled:bg-black" type="submit"
                                        onClick={handlesubmmit}
                                    >Send Otp</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Forgetpass