import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useRoutes } from 'react-router-dom'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import '../style.css';
import logingif from '../../../assets/login.gif';
import axios from 'axios';
import baseUrl from '../../../BaseUrl';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import Loader from '../../../utils/Loader';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loader, setloader] = useState(false)

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    
    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),

        }),
        onSubmit: value => {
            setloader(true);
            if (value) {
                axios.post(`${baseUrl}/adminLogin`, value)
                    .then((res) => {
                        const message = res.data.message;
                        if (res.data.status) {
                            localStorage.token = res.data.token;
                            enqueueSnackbar(message, { variant: 'success' });
                            navigate("/admin/upload");
                        } else {
                            enqueueSnackbar(message, { variant: 'warning' });
                        }
                    }).catch((err) => {
                        const message = err.response.data.message
                        enqueueSnackbar(message, { variant: 'error' });
                    }).finally(() => {
                        setloader(false);
                    })
            } else {
                enqueueSnackbar(formik.errors, { variant: 'warning' });
                setloader(false);
            }
        }
    });
  return (
    <>
            {loader && <Loader />}
            <div className="text">
                <div className="flex items-center justify-between h-screen  md:p-20" id='loginImage'>
                    <div className="flex flex-wrap justify-between w-full h-screen mx-auto text">
                        <div className="relative z-30 mt-[5em] w-full pt-5 mx-auto  text md:2/3 lg:w-2/3">
                            <div className="h-full px-3 mx-auto  lg:w-4/5 md:w-4/5">
                                <div className="items-center py-8 rounded-lg  text h-fit lg:mx-16 md:mx-16">
                                    <div className="text">
                                    <div className="px-3 py-5 mb-4 text-5xl text-white font-bold text-center">
                                  Admin Login
                                </div>
                                        <div className='gap-5 px-4'>
                                            <form onSubmit={formik.handleSubmit}>

                                                <div className="relative my-2 input-group">
                                                    <input type="email" className='relative w-full  rounded' placeholder="Email" name='email'
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.email} minLength={3} />
                                                    <small className="font-medium text-red-500">
                                                        {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}
                                                    </small>
                                                </div>

                                                <div className="my-2 input-group">
                                                    <div className="flex items-center border-2 rounded-lg ">
                                                        <input type={passwordVisible ? 'text' : 'password'} className='relative w-full border-2 border-white rounded' name="password"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.password} placeholder="Password" />
                                                        <div className='px-2 cursor-pointer text-white ' onClick={togglePasswordVisibility}>
                                                            {passwordVisible ? <AiFillEyeInvisible className='text-2xl' /> : <AiFillEye className='text-2xl' />}
                                                        </div>
                                                    </div>
                                                    <small className="font-medium text-red-500">
                                                        {formik.touched.password && formik.errors.password && <div>{formik.errors.password}</div>}
                                                    </small>
                                                </div>
                                                <button className="outline-none mt-2 shadow-2xl bg-red-600 rounded-lg  w-full p-3 transition-all ease-in-out duration-300 text-white font-bold text-2xl" type="submit">Submit
                                                    </button>
                                            </form>
                                            <div className="text">
                                                <Link to={'/user/forgotpassword'}>
                                                    <div className="my-4 font-medium text-center text-white text hover:underline">
                                                        Forgot password?
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}

export default AdminLogin