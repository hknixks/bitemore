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


const UserSignup = () => {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordVisible2, setPasswordVisible2] = useState(false);
    const [loader, setloader] = useState(false)

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const togglePasswordVisibility2 = () => {
        setPasswordVisible2(!passwordVisible2);
    };

    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            firstname: '',
            phonenumber: '',
            lastname: '',
            email: '',
            password: '',
            confirmpassword: '',
            profile_image: null
        },
        validationSchema: Yup.object({
            firstname: Yup.string().required('First name is required'),
            lastname: Yup.string().required('Last name is required'),
            phonenumber: Yup.string().required('Phone number is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            confirmpassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm password is required')
        }),
        onSubmit: value => {
            setloader(true);
            if (value) {
                axios.post(`${baseUrl}/userSignup`, value)
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
                <div className="flex items-center justify-between h-screen text bg-slate-200 md:p-20" id='loginImage'>
                    <div className="flex flex-wrap justify-between w-full h-screen mx-auto text">
                        <div className="relative z-30 w-full mx-auto pt-5 mt-15 text md:2/3 lg:w-2/3">
                            <div className="h-full px-3 mx-auto text lg:w-4/5 md:w-4/5">
                                <div className="items-center py-8  rounded-lg  text h-fit lg:mx-16 md:mx-16">
                                    <div className="text">
                                    <div className="px-3 py-5 text-center text-4xl font-bold text-white text">
                                    Create a new account
                                </div>
                                        <div className='gap-5 px-4'>
                                            <form onSubmit={formik.handleSubmit}>
                                                <div className="flex justify-between text my-5">
                                                    <div className="relative w-1/2  input-group me-2">
                                                        <input type="text" className='relative w-full  rounded' placeholder="First name" name="firstname"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.firstname} minLength={3} />
                                                        <small className="font-medium text-red-500">
                                                            {formik.touched.firstname && formik.errors.firstname && <div>{formik.errors.firstname}</div>}
                                                        </small>
                                                    </div>
                                                    <div className="relative w-1/2  input-group">
                                                        <input type="text" className='relative w-full  rounded ' placeholder="Last name" name='lastname'
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.lastname} minLength={3} />
                                                        <small className="font-medium text-red-500">
                                                            {formik.touched.lastname && formik.errors.lastname && <div>{formik.errors.lastname}</div>}
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className="relative my-5 input-group">
                                                    <input type="email" className='relative w-full  rounded' placeholder="Email" name='email'
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.email} minLength={3} />
                                                    <small className="font-medium text-red-500">
                                                        {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}
                                                    </small>
                                                </div>
                                                <div className="relative my-5 input-group">
                                                    <input type="tel" className='relative w-full  rounded ' placeholder="Phone number" name="phonenumber"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.phonenumber} minLength={3} />
                                                    <small className="font-medium text-red-500">
                                                        {formik.touched.phonenumber && formik.errors.phonenumber && <div>{formik.errors.phonenumber}</div>}
                                                    </small>
                                                </div>
                                                <div className="my-5 input-group">
                                                    <div className="flex items-center  rounded-lg ">
                                                        <input type={passwordVisible ? 'text' : 'password'} className='relative w-full  border-white rounded' name="password"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.password} placeholder="Password" />
                                                        <div className='px-2 cursor-pointer text-white' onClick={togglePasswordVisibility}>
                                                            {passwordVisible ? <AiFillEyeInvisible className='text-2xl' /> : <AiFillEye className='text-2xl' />}
                                                        </div>
                                                    </div>
                                                    <small className="font-medium text-red-500">
                                                        {formik.touched.password && formik.errors.password && <div>{formik.errors.password}</div>}
                                                    </small>
                                                </div>
                                                <div className="my-5 input-group">
                                                    <div className="flex items-center  rounded-lg ">
                                                        <input type={passwordVisible2 ? 'text' : 'password'} className='relative w-full  border-white rounded' name="confirmpassword"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.confirmpassword} placeholder="Confirm Password" />
                                                        <div className='px-2 cursor-pointer text-white' onClick={togglePasswordVisibility2}>
                                                            {passwordVisible2 ? <AiFillEyeInvisible className='text-2xl' /> : <AiFillEye className='text-2xl' />}
                                                        </div>
                                                    </div>
                                                    <small className="font-medium text-red-500">
                                                        {formik.touched.confirmpassword && formik.errors.confirmpassword && <div>{formik.errors.confirmpassword}</div>}
                                                    </small>
                                                </div>
                                                <button className="outline-none mt-2 shadow-2xl bg-red-600 rounded-lg  w-full p-3 transition-all ease-in-out duration-300 text-white  font-bold text-2xl disabled:bg-black" type="submit">
                                                    Submit
                                                </button>
                                            </form>
                                            <div className="text">
                                                <div className='flex justify-center pt-4 text-center'>
                                                    <span className="text-white">Already have an acount ?</span>
                                                    <Link to={'/user/login'}>
                                                        <span className='font-medium text-red-600 hover:underline ps-2'>Signin</span>
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
            </div>
        </>
    )
}

export default UserSignup
