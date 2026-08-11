import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { nigeriaState } from '../../Constant';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import {
    setAddress,
    setState,
    setCity,
    setPhoneNo,
    setDeliveryType,
    setDeliverNote,
    setLatitude,
    setLongitude,
} from '../../../Redux/DeliveryInfo.slice';
import { ArrowDropDownOutlined, ArrowForwardIos, LocationOn, NoteAltSharp } from '@mui/icons-material';
import { DialogDefault } from '../UserCheckout';

const Delivery = () => {
    const deliveryInfo = useSelector((state) => state.delivery);
    const [addNote, setAddNote] = useState(false);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                console.log(latitude);
                console.log(longitude);
                dispatch(setLatitude({ latitude: latitude.toString() }))
                dispatch(setLongitude({ longitude: longitude.toString() }))
                setOpen(false);
            },
                (error) => {
                    console.error('Error getting location:', error.message);
                }
            );
        } else {
            console.error('Geolocation is not supported by your browser.');
        }
    };
    console.log(deliveryInfo);
    const handleClose = () => setOpen(false);
    return (
        <>
            <div className="text h-fit bg-white w-full rounded shadow-lg">
                <div className="text w-full p-3 text-[1rem] font-bold flex justify-between text-red-600 ">
                    <div className="text">
                        Delivery Information
                    </div>
                    <div className="text items-center cursor-pointer hover:underline">
                        <small>Change</small> <span className='text-lg'>{'>'}</span>
                    </div>
                </div>
                <hr />
                <div className="text w-full h-fit p-3">
                    <div>
                        <div className="text">
                            <div className="text-red-600 font-medium">
                                Delivery type
                            </div>
                            <div className="w-72">
                                <FormControl fullWidth className="!my-4 border border-red-600">
                                    <InputLabel id="demo-simple-select-label">
                                        Delivery type
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        value={deliveryInfo.deliveryType}
                                        required
                                        onChange={(e) =>
                                            dispatch(setDeliveryType({ deliveryType: e.target.value }))
                                        }
                                        name="deliveryType"
                                    >

                                        {['Delivery', 'Pickup'].map((states) => (
                                            <MenuItem value={states} key={states}>
                                                {states}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        {/* <div className="text">
                            <div  className="">
                                <Button 
                                 className='!border !border-red-500 !bg-gray-200 flex gap-3 text-indigo-500 cursor-pointer my-2 items-center justify-center py-1 px-2'>
                                    <LocationOn className=' animate-bounce text-3xl' />
                                    <div className="text font-medium">
                                        Select location
                                    </div>
                                </Button>

                            </div>
                        </div> */}
                        <div className="text">
                            <div className="text-red-600 font-medium">
                                Select State
                            </div>
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
                        </div>
                        {deliveryInfo.state && (
                            <div className="relative">
                                <div className="text-red-600 font-medium mb-3">
                                    Select City
                                </div>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">
                                        Select City
                                    </InputLabel>
                                    <Select
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
                        <div className="text mt-3.5">
                            <div className="text-red-600 font-medium ">
                                Delivery address
                            </div>
                            <textarea
                                name="address"
                                required
                                onChange={(e) =>
                                    dispatch(setAddress({ address: e.target.value }))
                                }
                                value={deliveryInfo.address}
                                id="outlined-multiline-static"
                                label="Enter your delivery address"
                                className="w-full bg-white rounded border border-gray-300 ring-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out mb-3 mt-5"
                                placeholder="Enter your delivery address"></textarea>
                        </div>
                        <div className="text">
                            <div className="text-red-600 font-medium mt-3.5">
                                Order notes
                            </div>
                            <div className="text flex px-5 justify-between cursor-pointer" onClick={() => setAddNote(!addNote)}>
                                <div className="text flex gap-4 cursor-pointer my-2">
                                    <NoteAltSharp />
                                    <div className="text font-medium">
                                        Add a order note
                                    </div>
                                </div>
                                <div className="text">
                                    {addNote ? (
                                        <ArrowForwardIos />
                                    ) : (
                                        <ArrowDropDownOutlined />
                                    )}
                                </div>
                            </div>
                            {addNote && (
                                <div className="text">
                                    <textarea
                                        name="deliverNote"
                                        onChange={(e) =>
                                            dispatch(setDeliverNote({ deliverNote: e.target.value }))
                                        }
                                        value={deliveryInfo.deliverNote}
                                        id="outlined-multiline-static"
                                        label="Enter your delivery address"
                                        className="w-full bg-white rounded border border-gray-300 ring-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out mb-3 mt-5"
                                        placeholder="Enter your delivery note"></textarea>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <DialogDefault open={open} handleClose={handleClose} getLocation={getLocation} />
        </>
    )
}

export default Delivery;

