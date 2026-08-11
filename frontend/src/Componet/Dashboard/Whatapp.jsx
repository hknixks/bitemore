import React from 'react'
import { RiEBike2Fill, RiWhatsappFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';

const Whatapp = () => {
    const openWhatsApp = () => {
        const whatsappLink = 'https://api.whatsapp.com/send?phone=2348149445103';
        window.open(whatsappLink, '_blank');
    };
    return (
        <>
            <div className="absolute bottom-0 z-50 flex justify-end w-full px-5 pb-24 text">
                <RiWhatsappFill onClick={openWhatsApp} className='ml-auto cursor-pointer flex text-[3.5rem] text-green-500 hover:text-green-600 shadow-2xl fixed  p-[1px] bg-transparent' />
            </div>
        </>
    )
}

export default Whatapp

export const HomeDelivery = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className="absolute bottom-0 z-50 flex justify-end w-full px-5 pb-40 text">
                <RiEBike2Fill onClick={() => navigate('/user/cart')} className='ml-auto cursor-pointer flex text-[3.2rem] text-blue-500 hover:blue-green-600 shadow-2xl fixed p-[1px] bg-transparent' title='home delivery' />
            </div>
        </>
    )
}