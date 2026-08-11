import axios from 'axios';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import baseUrl from '../../../BaseUrl';
import { useSnackbar } from 'notistack';
import img from '../../../assets/reset.png';
import '../style.css';
import { useFormik } from 'formik';
import Loader from '../../../utils/Loader';
import { Button } from '@material-tailwind/react';
import * as Yup from 'yup';

const UserResetPassword = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            email: email,
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                .required('Confirm password is required')
        }),
        onSubmit: value => {
            setLoader(true);
            if (value) {
                axios.post(`${baseUrl}/userForgotPin`, value)
                    .then((res) => {
                        const message = res.data.message;
                        if (res.data.status) {
                            enqueueSnackbar(message, { variant: 'success' });
                            navigate("/user/login");
                        } else {
                            enqueueSnackbar(message, { variant: 'warning' });
                        }
                    }).catch((err) => {
                        const message = err.response.data.message
                        enqueueSnackbar(message, { variant: 'error' });
                    }).finally(() => {
                        setLoader(false);
                    })
            } else {
                enqueueSnackbar(formik.errors, { variant: 'warning' });
                setLoader(false);
            }
        }
    });
    return (
        <>
            {loader && <Loader />}
            <div className="h-screen text bg-slate-100 flex items-center">
                <section className="items-center flex w-full">
                    <div className="container mx-auto flex px-5 md:justify-between justify-center items-center w-full sm:justify-center">
                        <div className="md:w-1/2 border py-10 rounded-xl bg-white shadow-lg px-4 h-full">
                            <h1 className='w-full mb-6 font-serif text-2xl font-bold text-center text-indigo-500 underline underline-offset-4'>Reset Password</h1>
                            <form onSubmit={formik.handleSubmit} className='w-full'>
                                <div className="relative w-full input-group md:w-4/6 lg:w-1/2">
                                    <label htmlFor="newPassword" className="leading-7 font-medium text-gray-600">New Password</label>
                                    <input type="text" className='relative w-full border-2 rounded border-slate-400' placeholder="New Password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.newPassword} minLength={4} name='newPassword' />
                                    <small className="font-medium text-red-500">
                                        {formik.touched.newPassword && formik.errors.newPassword && <div>{formik.errors.newPassword}</div>}
                                    </small>
                                </div>
                                <div className="relative w-full input-group md:w-4/6 lg:w-1/2 mt-3">
                                    <label htmlFor="Confirm Password" className="leading-7  font-medium text-gray-600">Confirm Password</label>
                                    <input type="text" className='relative w-full border-2 rounded border-slate-400' placeholder="Confirm Password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.confirmPassword} name='confirmPassword' minLength={4} />
                                    <small className="font-medium text-red-500">
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword && <div>{formik.errors.confirmPassword}</div>}
                                    </small>
                                </div>
                                <div className="mt-5 text w-full">
                                    <Button type='submit' className=" text-white bg-red-600 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg font-medium">
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        </div>
                        <div className="md:w-1/2 w-fit h-fit hidden md:block lg:block">
                            <img className="object-cover object-center rounded lg:h-[450px] md:h-fit mx-auto" alt="hero" src={img} />
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default UserResetPassword