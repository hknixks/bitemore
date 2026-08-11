import React, { useEffect, useState } from 'react'
import axios from 'axios'; import { Link, useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogBody } from "@material-tailwind/react";
import { useCountries } from "use-react-countries";
import {
    CardHeader,
    CardBody,
    Input,
    Typography,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Select,
    Option,
} from "@material-tailwind/react";
import { CreditCardIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { FaPaypal } from 'react-icons/fa';

function formatCardNumber(value) {
    const val = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = val.match(/\d{4, 16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
        return parts.join(" ");
    } else {
        return value;
    }
}

function formatExpires(value) {
    return value
        .replace(/[^0-9]/g, "")
        .replace(/^([2-9])$/g, "0$1")
        .replace(/^(1{1})([3-9]{1})$/g, "0$1/$2")
        .replace(/^0{1,}/g, "0")
        .replace(/^([0-1]{1}[0-9]{1})([0-9]{1, 2}).*/g, "$1/$2");
}

const PayMentCard = () => {
    const { countries } = useCountries();
    const [type, setType] = useState("card");
    const [open, setOpen] = useState(true);
    const [countryName, setCountryName] = useState("");

    const handleOpen = () => setOpen(!open);

    const [data, setData] = useState({
        cardNumber: "",
        cardExpires: "",
        email: "",
        countryName: "Nigeria",
        name: "",
    });

    // const handleChange = (event) => {
    //     // const { name, value } = event.target;
    //     const { name, value } = event.target || event;
    //     if (!name) return;
    //     setData({ ...data, [name]: value });
    //     console.log(data)
    // };

    const handleChange = (event) => {
        if (!event) return; 
        const { name, value, type, checked } = event.target || event;
        if (!name) return;
        const newValue = type === 'checkbox' ? checked : value;
        setData((prevData) => ({...prevData, [name]: newValue}));
        console.log(data)
    };
     const handleSubmit = () => {
        try  {
            alert('Form Submitted Successfully');
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    };
    return (
        <>
            <Dialog open={open} handler={handleOpen} size={"xs"}>
                <DialogBody className=' overflow-y-auto'>
                    <CardHeader floated={false} shadow={false} className="m-0 grid place-items-center bg-blue-600 px-4 py-8 text-center">
                        <div className="h-10 text-white">
                            {type === "card" ? (
                                <CreditCardIcon className="h-10 w-10 text-white" />
                            ) : (
                                <FaPaypal className="h-10 w-10 text-white" />
                            )}
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Tabs value={type} className="overflow-visible">
                            <TabsHeader className="relative z-0 bg-blue-600">
                                <Tab value="card" onClick={() => setType("card")}>
                                    Pay with Card
                                </Tab>
                                <Tab value="paypal" onClick={() => setType("paypal")}>
                                    Pay with PayPal
                                </Tab>
                            </TabsHeader>
                            <TabsBody className="!overflow-x-hidden !overflow-y-visible"
                                animate={{
                                    initial: {
                                        x: type === "card" ? 400 : -400,
                                    },
                                    mount: {
                                        x: 0,
                                    },
                                    unmount: {
                                        x: type === "card" ? 400 : -400,
                                    },
                                }}>
                                <TabPanel value="card" className="p-0">
                                    <form className="mt-5 flex flex-col gap-4">
                                        <div>
                                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                                Your Email
                                            </Typography>
                                            <Input type="email"
                                                name="email"
                                                value={data.email}
                                                onChange={handleChange}
                                                placeholder="name@mail.com"
                                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                labelProps={{ className: "before:content-none after:content-none" }}
                                            />
                                        </div>
                                        <div className="my-3">
                                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                                Card Details
                                            </Typography>
                                            <Input maxLength={19}
                                                name="cardNumber"
                                                value={formatCardNumber(data.cardNumber)}
                                                onChange={handleChange}
                                                icon={<CreditCardIcon className="absolute left-0 h-4 w-4 text-blue-gray-300" />}
                                                placeholder="0000 0000 0000 0000"
                                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                                labelProps={{ className: "before:content-none after:content-none" }}
                                            />
                                            <div className="my-4 flex items-center gap-4">
                                                <div>
                                                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                                        Expires
                                                    </Typography>
                                                    <Input
                                                        maxLength={5}
                                                        name="cardExpires"
                                                        value={formatExpires(data.cardExpires)}
                                                        onChange={handleChange}
                                                        containerProps={{ className: "min-w-[72px]" }}
                                                        placeholder="00/00"
                                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                        labelProps={{ className: "before:content-none after:content-none" }}
                                                    />
                                                </div>
                                                <div>
                                                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                                        CVC
                                                    </Typography>
                                                    <Input
                                                        maxLength={4}
                                                        containerProps={{ className: "min-w-[72px]" }}
                                                        placeholder="000"
                                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                        labelProps={{ className: "before:content-none after:content-none" }}
                                                    />
                                                </div>
                                            </div>
                                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                                Holder Name
                                            </Typography>
                                            <Input
                                                name="name"
                                                value={data.name}
                                                onChange={handleChange}
                                                placeholder="name@mail.com"
                                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                labelProps={{ className: "before:content-none after:content-none" }}
                                            />
                                        </div>
                                        <Button size="lg" className='bg-blue-600' onClick={handleSubmit}>Pay Now</Button>
                                        <Typography variant="small" color="gray"
                                            className="mt-2 flex items-center justify-center gap-2 font-medium opacity-60">
                                            <LockClosedIcon className="-mt-0.5 h-4 w-4" /> Payments are
                                            secure and encrypted
                                        </Typography>
                                    </form>
                                </TabPanel>
                                <TabPanel value="paypal" className="p-0">
                                    <form className="mt-5 flex flex-col gap-4">
                                        <div>
                                            <Typography variant="paragraph" color="blue-gray" className="mb-4 font-medium">
                                                Personal Details
                                            </Typography>
                                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                                Your Email
                                            </Typography>
                                            <Input
                                                name="email"
                                                value={data.email}
                                                onChange={handleChange}
                                                type="email"
                                                placeholder="name@mail.com"
                                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                labelProps={{ className: "before:content-none after:content-none" }} />
                                        </div>
                                        <div className="mt-3">
                                            <Typography variant="paragraph" color="blue-gray" className="mb-4 font-medium">
                                                Billing Address
                                            </Typography>
                                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                                Country
                                            </Typography>
                                            <Select
                                                name="countryName"
                                                value={data.countryName}
                                                onChange={handleChange}
                                                placeholder="USA"
                                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                labelProps={{ className: "before:content-none after:content-none" }}
                                                menuProps={{ className: "h-48" }}>
                                                {countries.map((country) => (
                                                    <Option key={country.name} value={country.name}>
                                                        <div className="flex items-center gap-x-2">
                                                            <img
                                                                src={country.flags.svg}
                                                                alt={country.name}
                                                                className="h-4 w-4 rounded-full object-cover"
                                                            />
                                                            {country.name}
                                                        </div>
                                                    </Option>
                                                ))}
                                            </Select>
                                            <Typography variant="small" color="blue-gray" className="mt-4 -mb-2 font-medium">
                                                Postal Code
                                            </Typography>
                                            <Input
                                                placeholder="0000"
                                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                                labelProps={{ className: "before:content-none after:content-none" }}
                                                containerProps={{ className: "mt-4" }}
                                            />
                                        </div>
                                        <Button size="lg" className='bg-blue-600' onClick={handleSubmit}>pay with paypal</Button>
                                        <Typography variant="small" color="gray" className="flex items-center justify-center gap-2 font-medium opacity-60">
                                            <LockClosedIcon className="-mt-0.5 h-4 w-4" /> Payments are
                                            secure and encrypted
                                        </Typography>
                                    </form>
                                </TabPanel>
                            </TabsBody>
                        </Tabs>
                    </CardBody>
                </DialogBody>
            </Dialog>
        </>
    )
}

export default PayMentCard