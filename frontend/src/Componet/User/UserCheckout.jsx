import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import useUserCart from '../../hooks/UserCartItem';
import { PaystackButton } from 'react-paystack';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../utils/Loader';
import commaNumber from 'comma-number';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { ArrowBackIos, ArrowDropDown, ArrowDropDownOutlined, ArrowForwardIos, Cancel, Delete, LocationCity, LocationCityRounded, LocationOn, NoteAdd, NoteAddOutlined, NoteAddRounded, NoteAddSharp, NoteAltSharp } from '@mui/icons-material';
import { Alert, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { nigeriaState } from '../Constant';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import {
    Textarea,
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    Stepper,
    Step,
    Typography,
    Option,
} from "@material-tailwind/react";
import baseUrl from '../../BaseUrl';
import {
    CogIcon,
    UserIcon,
    BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import Contact from './CheckoutInfo/Contact';
import Delivery from './CheckoutInfo/Delivery';
import PayMent from './CheckoutInfo/PayMent';
import PaymentValidation from './CheckoutInfo/PaymentValidation'
import DeliveryValidation from './CheckoutInfo/DeliveryValidation'
import contactValidation from './CheckoutInfo/contactValidation';

const UserCheckout = () => {
    const user = useSelector((state) => state.user.user);
    const cart = useSelector((state) => state.cart.cart);
    const deliveryInfo = useSelector((state) => state.delivery);
    const { enqueueSnackbar } = useSnackbar();

    const [activeStep, setActiveStep] = React.useState(0);
    const [isLastStep, setIsLastStep] = React.useState(false);
    const [isFirstStep, setIsFirstStep] = React.useState(false);
    

    const handleNext = () => {
        let validationResponse;
        switch (activeStep) {
            case 0:
                validationResponse = contactValidation(deliveryInfo);
                break;
            case 1:
                validationResponse = DeliveryValidation(deliveryInfo);
                break;
            case 2:
                validationResponse = PaymentValidation(cart, deliveryInfo, user);
                break;
            default:
                validationResponse = { status: "success" };
        }

        if (validationResponse.status === "success") {
            if (!isLastStep) setActiveStep((cur) => cur + 1);
        } else {
            enqueueSnackbar(validationResponse.message, { variant: 'warning' });
        }
    };
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    return (
        <>
            <div className="text bg-slate-100">
                <div className="w-full px-24 py-4">
                    <Stepper
                        activeStep={activeStep}
                        isLastStep={(value) => setIsLastStep(value)}
                        isFirstStep={(value) => setIsFirstStep(value)}
                    >
                        <Step onClick={() => setActiveStep(0)}>
                            <UserIcon className="h-5 w-5" />
                            <div className="absolute -bottom-[4.5rem] w-max text-center">
                                <Typography variant="h6" color={activeStep === 0 ? "red" : "gray"}>
                                    Contact Details
                                </Typography>
                            </div>
                        </Step>
                        <Step onClick={() => setActiveStep(1)}>
                            <CogIcon className="h-5 w-5" />
                            <div className="absolute -bottom-[4.5rem] w-max text-center">
                                <Typography variant="h6" color={activeStep === 1 ? "red" : "gray"}>
                                    Delivery Information
                                </Typography>
                            </div>
                        </Step>
                        <Step onClick={() => setActiveStep(2)}>
                            <BuildingLibraryIcon className="h-5 w-5" />
                            <div className="absolute -bottom-[4.5rem] w-max text-center">
                                <Typography variant="h6" color={activeStep === 2 ? "red" : "gray"}>
                                    Payment Method
                                </Typography>
                            </div>
                        </Step>
                    </Stepper>
                    <div className="mt-32"></div>
                </div>
                <div className="text w-[85%] mt-5 container mx-auto">
                    <div className="text">
                        {activeStep === 0 ? (
                            <Contact />
                        ) : activeStep === 1 ? (
                            <Delivery />
                        ) : activeStep === 2 ? (
                            <PayMent />
                        ) : ""}
                    </div>
                    <div className="mt-10 flex justify-between">
                        <Button onClick={handlePrev} disabled={isFirstStep}>
                            Prev
                        </Button>
                        <Button onClick={handleNext} disabled={isLastStep}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserCheckout

export function DialogDefault({ open, handleClose, getLocation }) {
    const handleOpen = () => handleClose();

    return (
        <>
            <Dialog open={open} handler={handleOpen} size={"xs"}>
                <DialogHeader className='gap-1 items-center flex'>
                    <Alert severity="warning" className='w-full border'>Alert</Alert>
                    <div className="text">
                        <Cancel className="text-red-500 cursor-pointer" onClick={() => handleClose()} />
                    </div>
                </DialogHeader>
                <DialogBody>
                    <div className="text">
                        <div className='font-medium text-lg'>
                            For easy verification, we need your device&lsquo;s location.
                        </div>
                        <br className="my-2" />
                        <p className=" font-medium">
                            Please select allow in the next dialog.
                        </p>
                        <div className="text ">
                            <Button
                                className="px-6 py-2 mt-4 text-white text-lg bg-indigo-500"
                                onClick={() => getLocation()}>
                                ok
                            </Button>
                        </div>
                    </div>
                </DialogBody>
            </Dialog>
        </>
    );
}