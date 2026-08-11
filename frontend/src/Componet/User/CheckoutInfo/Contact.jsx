import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { nigeriaState } from '../../Constant';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import {
    setAddress,
    setState,
    setCity,
    setPhoneNo
} from '../../../Redux/DeliveryInfo.slice'

const Contact = () => {
    const deliveryInfo = useSelector((state) => state.delivery);
    const dispatch = useDispatch();

    return (
        <>
            <div className="text h-fit bg-white w-full rounded shadow-lg">
                <div className="text w-full p-3 text-[1rem] font-medium flex justify-between text-red-600 ">
                    <div className="text">
                        CUSTOMER ADDRESS
                    </div>
                    <div className="text items-center cursor-pointer hover:underline">
                        <small>Change</small> <span className='text-lg'>{'>'}</span>
                    </div>
                </div>
                <hr />
                <div className="text w-full h-fit p-3">
                    <div>
                        <div className="text mb-3">
                            <div className="text-lg pb-3 text-red-600 font-medium">
                                Input your delivery address:
                            </div>
                            <small className='text-[13px] font-[500]'>
                                This must be your home or office address.
                            </small>
                            <br />
                            <small className='text-[13px] font-[500]'>
                                Please input an address that includes a street name and
                                a house or buliding number.
                            </small>
                        </div>
                        <div className="text">
                            <textarea
                                name="address"
                                required
                                onChange={(e) =>
                                    dispatch(setAddress({ address: e.target.value }))
                                }
                                value={deliveryInfo.address}
                                id="outlined-multiline-static"
                                label="Enter your delivery address"
                                className="w-full bg-white rounded border border-gray-300 ring-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out mb-3"
                                placeholder="Enter your delivery address"></textarea>
                            <TextField
                                name="phoneNo"
                                required
                                onChange={(e) =>
                                    dispatch(setPhoneNo({ phoneNo: e.target.value }))
                                }
                                value={deliveryInfo.phoneNo}
                                id="outlined-multiline-static"
                                label="Enter your phone number"
                                className='w-full bg-white'
                            />
                            <FormControl fullWidth className="!my-4 border border-red-600">
                                <InputLabel id="demo-simple-select-label">
                                    Select State
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    value={deliveryInfo.state}
                                    onChange={(e) =>
                                        dispatch(setState({ state: e.target.value }))
                                    }
                                    name="state"
                                    label="Select Department"
                                >
                                    <MenuItem value={""} className="hidden">
                                        Select State
                                    </MenuItem>
                                    {nigeriaState.map((states, index) => (
                                        <MenuItem value={states.name} key={index}>
                                            {states.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {deliveryInfo.state && (
                                <div className="relative">
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">
                                            Select City
                                        </InputLabel>
                                        <Select
                                        required
                                            labelId="demo-simple-select-label"
                                            value={deliveryInfo.city}
                                            onChange={(e) =>
                                                dispatch(setCity({ city: e.target.value }))
                                            }
                                            name="city"
                                            label="Select City"
                                        >
                                            <MenuItem value={""} className="hidden">
                                                Select City
                                            </MenuItem>
                                            {nigeriaState.find((state) => state.name === deliveryInfo.state)?.localGovenment.map((local, index) => (
                                                <MenuItem value={local} key={index}>
                                                    {local}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact