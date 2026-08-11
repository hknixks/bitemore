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


const AdminSignup = () => {
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
            adminToken: '',
            password: '',
            confirmpassword: '',
            profile_image: null
        },
        validationSchema: Yup.object({
            firstname: Yup.string().required('First name is required'),
            lastname: Yup.string().required('Last name is required'),
            phonenumber: Yup.string().required('Phone number is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            adminToken: Yup.string().required('admin token is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            confirmpassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm password is required')
        }),
        onSubmit: value => {
            setloader(true);
            if (value) {
                axios.post(`${baseUrl}/adminSignup`, value)
                    .then((res) => {
                        const message = res.data.message;
                        if (res.data.status) {
                            enqueueSnackbar(message, { variant: 'success' });
                            navigate("/admin/login");
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
                <div className="flex items-center justify-between h-screen text bg-slate-200 md:p-20">
                    <div className="flex flex-wrap justify-between w-full h-screen mx-auto text">
                        <div className="flex items-center w-full mx-auto bg-blue-500 text md:w-full lg:w-1/3 lg:block">
                            <div className="text">
                                <div className="px-3 py-5 font-mono text-2xl font-bold text-white text">
                                    Create a new account
                                </div>
                                <img src={logingif} alt="" className='hidden w-full text lg:block md:hidden' />
                            </div>
                        </div>
                        <div className="relative z-30 w-full pt-5 bg-white border text md:2/3 lg:w-2/3">
                            <div className="h-full px-3 mx-auto text lg:w-4/5 md:w-4/5">
                                <div className="items-center py-8 border rounded-lg shadow-lg text h-fit lg:mx-16 md:mx-16">
                                    <div className="text">
                                        <div className='gap-5 px-4'>
                                            <form onSubmit={formik.handleSubmit}>
                                                <div className="flex justify-between text">
                                                    <div className="relative w-1/2 my-2 input-group me-2">
                                                        <input type="text" className='relative w-full border-2 rounded border-slate-400' placeholder="First name" name="firstname"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.firstname} minLength={3} />
                                                        <small className="font-medium text-red-500">
                                                            {formik.touched.firstname && formik.errors.firstname && <div>{formik.errors.firstname}</div>}
                                                        </small>
                                                    </div>
                                                    <div className="relative w-1/2 my-2 input-group">
                                                        <input type="text" className='relative w-full border-2 rounded border-slate-400' placeholder="Last name" name='lastname'
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.lastname} minLength={3} />
                                                        <small className="font-medium text-red-500">
                                                            {formik.touched.lastname && formik.errors.lastname && <div>{formik.errors.lastname}</div>}
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className="relative my-2 input-group">
                                                    <input type="email" className='relative w-full border-2 rounded border-slate-400' placeholder="Email" name='email'
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.email} minLength={3} />
                                                    <small className="font-medium text-red-500">
                                                        {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}
                                                    </small>
                                                </div>
                                                <div className="relative my-2 input-group">
                                                    <input type="tel" className='relative w-full border-2 rounded border-slate-400' placeholder="Phone number" name="phonenumber"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.phonenumber} minLength={3} />
                                                    <small className="font-medium text-red-500">
                                                        {formik.touched.phonenumber && formik.errors.phonenumber && <div>{formik.errors.phonenumber}</div>}
                                                    </small>
                                                </div>
                                                <div className="relative my-2 input-group">
                                                    <input type="text" className='relative w-full border-2 rounded border-slate-400' placeholder="Admin token" name='adminToken'
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.adminToken} minLength={3} />
                                                    <small className="font-medium text-red-500">
                                                        {formik.touched.adminToken && formik.errors.adminToken && <div>{formik.errors.adminToken}</div>}
                                                    </small>
                                                </div>
                                                <div className="my-2 input-group">
                                                    <div className="flex items-center border-2 rounded-lg text border-slate-400">
                                                        <input type={passwordVisible ? 'text' : 'password'} className='relative w-full border-2 border-white rounded' name="password"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.password} placeholder="Password" />
                                                        <div className='px-2 cursor-pointer text' onClick={togglePasswordVisibility}>
                                                            {passwordVisible ? <AiFillEyeInvisible className='text-2xl' /> : <AiFillEye className='text-2xl' />}
                                                        </div>
                                                    </div>
                                                    <small className="font-medium text-red-500">
                                                        {formik.touched.password && formik.errors.password && <div>{formik.errors.password}</div>}
                                                    </small>
                                                </div>
                                                <div className="my-2 input-group">
                                                    <div className="flex items-center border-2 rounded-lg text border-slate-400">
                                                        <input type={passwordVisible2 ? 'text' : 'password'} className='relative w-full border-2 border-white rounded' name="confirmpassword"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.confirmpassword} placeholder="Confirm Password" />
                                                        <div className='px-2 cursor-pointer text' onClick={togglePasswordVisibility2}>
                                                            {passwordVisible2 ? <AiFillEyeInvisible className='text-2xl' /> : <AiFillEye className='text-2xl' />}
                                                        </div>
                                                    </div>
                                                    <small className="font-medium text-red-500">
                                                        {formik.touched.confirmpassword && formik.errors.confirmpassword && <div>{formik.errors.confirmpassword}</div>}
                                                    </small>
                                                </div>
                                                <button className="outline-none mt-2 shadow-2xl bg-blue-500 rounded-lg  w-full p-3 transition-all ease-in-out duration-300 text-white hover:border-[#035ec5] hover:border-solid border font-mono font-bold text-lg disabled:bg-black" type="submit">Submit</button>
                                            </form>
                                            <div className="text">
                                                <div className="flex items-center my-4 text justify">
                                                    <span className="w-full border-t-2 text border-slate-400 ms-2"></span>
                                                    <span className="px-5 text-lg font-medium text">or</span>
                                                    <span className="w-full border-t-2 text border-slate-400 me-2"></span>
                                                </div>
                                                <button className="flex items-center justify-center w-full p-3 space-x-2 font-semibold transition-all duration-200 ease-in-out bg-white border rounded-lg shadow-2xl cursor-pointer border-slate-300 hover:border-slate-100 hover:border-solid">
                                                    <svg
                                                        version="1.1"
                                                        id="Layer_1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        x="0px"
                                                        y="0px"
                                                        viewBox="0 0 512 512"
                                                        style={{ enableBackground: 'new 0 0 512 512' }}
                                                        xmlSpace="preserve"
                                                        className='px-2 w-[40px]'
                                                    >
                                                        <path
                                                            fill="#FBBB00"
                                                            d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456C103.821,274.792,107.225,292.797,113.47,309.408z"
                                                        ></path>
                                                        <path
                                                            fill="#518EF8"
                                                            d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
                                                        ></path>
                                                        <path
                                                            fill="#28B446"
                                                            d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
                                                        ></path>
                                                        <path
                                                            fill="#F14336"
                                                            d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0C318.115,0,375.068,22.126,419.404,58.936z"
                                                        ></path>
                                                    </svg>
                                                    Google
                                                </button>
                                            </div>
                                            <div className="text">
                                                <div className='flex justify-center pt-4 text-center'>
                                                    <span className="text">Already have an acount ?</span>
                                                    <Link to={'/admin/login'}>
                                                        <span className='font-medium text-blue-500 ps-2'>Signin</span>
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

export default AdminSignup
