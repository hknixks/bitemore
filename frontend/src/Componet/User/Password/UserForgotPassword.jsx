import React, { useEffect, useState } from 'react'
import logingif from '../../../assets/reset.png';
import '../style.css';
// import logingif from '../login.gif';
import axios from 'axios';
import baseUrl from '../../../BaseUrl';
import { useSnackbar } from 'notistack';
import Loader from '../../../utils/Loader';
import { Link, useNavigate } from 'react-router-dom';
import OTPInput from 'react-otp-input';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { Cancel } from '@mui/icons-material';

const UserForgotPassword = () => {
    const [email, setemail] = useState('');
    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(false)
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false)

    const handleChanges = (e) => setemail(e.target.value);

    const handleSubmit = () => {
        if (!email) {
            return enqueueSnackbar('invalid email', { variant: 'error' });
        }
        setLoader(true)
        setIsLoading(true);
        axios.post(`${baseUrl}/userResetpassword`, { email })
            .then((res) => {
                if (res.data.status) {
                    enqueueSnackbar('success', { variant: 'success' });
                    handleOpen();
                }

            }).catch((err) => {
                const message = err.response.data.message;
                enqueueSnackbar(message, { variant: 'error' });
            }).finally(() => {
                setLoader(false)
                setIsLoading(false);
            })
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            {loader && <Loader />}
            <div className="text">
                <div className="flex items-center mx-auto justify-between h-screen text md:p-20" id='loginImage'>
                    <div className="flex flex-wrap justify-between w-full h-screen mx-auto text">
                        
                        <div className="relative z-30 mx-auto w-full pt-5 flex justify-center items-center text md:2/3 lg:w-2/3">
                            <div className="h-full px-3 mx-auto text w-full">
                                <div className="items-center py-8 mt-20  shadow-lg text h-fit lg:mx-16 md:mx-16 ">
                                    <div className="text">
                                    <div className="px-3 py-5 font-mono text-5xl text-white font-extrabold text-center">
                                    Forgot password
                                </div>
                                        <div className='gap-5 px-4'>
                                            <div className="relative input-group p-2">
                                                <input type="email" className='relative w-full  rounded' placeholder="Enter your email" onChange={handleChanges} value={email} />
                                                <span className="input-error block mt-[5px] text-[13px] text-red-500">
                                                    Not a valid email
                                                </span>
                                            </div>

<button disabled={isLoading} className="outline-none mt-2 shadow-2xl bg-red-600 rounded-lg  w-full p-3 transition-all ease-in-out duration-300 text-white font-semibold text-xl" type="submit" onClick={handleSubmit} >
                                            <b>
                                                {isLoading ? "Loading..." : "Send Otp"}
                                            </b>
                                        </button>



                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DialogDefault open={open} handleClose={handleClose} handleSubmit={handleSubmit} email={email} />
        </>

    )
}
export default UserForgotPassword


export function DialogDefault({ open, handleClose, handleSubmit, email }) {
    const [otpCodes, setOtpCodes] = React.useState('');
    const [otpResent, setOtpResent] = React.useState(false);
    const [resendDisabled, setResendDisabled] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(300);

    const handleOpen = () => {
        // handleClose();
        setOtpCodes('');
        setTimeLeft(300); // Reset the timer
    };

    const handleVerifyOtp = () => {
        axios.post(`${baseUrl}/userVerifyOTP`, { email: email, otp: otpCodes })
            .then((res) => {
                const message = res.data.message
                enqueueSnackbar(message, { variant: 'success' });
                if (res.data.status) {
                    navigate(`/user/resetPassword?email=${email}`)
                }

            }).catch((err) => {
                console.log(err);
                const message = err.response.data.message;
                enqueueSnackbar(message, { variant: 'error' });
            })
    };
    const handleResendCode = () => {
        handleSubmit();
        setResendDisabled(true);
        setOtpResent(true);
        setOtpCodes('')
        setTimeLeft(300); // Reset the timer

    };

    useEffect(() => {
        let timer;

        if (open) {
            timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 0) {
                        clearInterval(timer);
                        setResendDisabled(false);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        // Clean up the interval on component unmount
        return () => {
            clearInterval(timer);
        };
    }, [open, resendDisabled]);

    useEffect(() => {
        if (timeLeft === 0) {
            setResendDisabled(false);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secondsLeft = seconds % 60;
        return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
    };

    return (
        <>
            <Dialog open={open} handler={handleOpen} size={"xs"}>
                <DialogHeader className='flex justify-between'>
                    <div className="text">
                        Enter Verification Code
                    </div>
                    <Button variant="text" color="red" onClick={handleClose} className="mr-1">
                        <Cancel />
                    </Button>
                </DialogHeader>
                <DialogBody>
                    <OTPInput
                        value={otpCodes}
                        onChange={(e) => setOtpCodes(e)}
                        numInputs={4}
                        containerStyle="px-2 sm:px-0 text-[32px] "
                        shouldAutoFocus={true}
                        inputStyle="border border-[#00693D] focus:border-yellow-900 rounded sm:rounded-md min-w-[2rem] sm:min-w-[3.3rem] min-h-[2rem] sm:min-h-[3.3rem] mx-auto"
                        renderSeparator={<span className="mx-2 sm:mx-3"> </span>}
                        renderInput={(props) => <input {...props} />}
                    />
                </DialogBody>
                <DialogFooter>
                    <button
                        className="outline-none mt-2 shadow-2xl bg-red-600 rounded-lg  w-full p-3 transition-all ease-in-out duration-300 text-white hover:border-solid border font-mono font-bold text-lg"
                        type="submit"
                        onClick={handleVerifyOtp}
                        disabled={otpCodes.length !== 4}
                    >
                        Verify Otp
                    </button>
                    <div className="text w-full mt-3">
                        <span className=' font-medium pe-5'>Didn&lsquo;t get code</span>
                        {otpResent && <span className="text-green-600 me-4 font-medium">Code Resent!!!</span>}
                        <Button variant="gradient" color="green" onClick={handleResendCode}
                            disabled={resendDisabled}>
                            <span> Resend Code</span>
                        </Button>
                        {(
                            <span className="ms-3 font-medium text-red-600">{formatTime(timeLeft)}</span>
                        )}
                    </div>

                </DialogFooter>
            </Dialog>
        </>
    );
}