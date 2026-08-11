import React, { useEffect } from 'react'
import { Alert, Button, Typography } from "@material-tailwind/react";
import { FcInfo } from "react-icons/fc";

const CartAlart = ({ openAlert, setOpenAlert, message, status }) => {
    return (
        <>
            <div className="w-[100%] fixed text-center mx-auto justify-center items-center ">
            <Alert
                open={openAlert}
                onClose={() => setOpenAlert(false)}
                icon={<FcInfo className='text-3xl' />}
                animate={{
                    mount: { y: 0 },
                    unmount: { y: 100 },
                }}
                color={status === 'success' ? "green" : status === 'warning' ? "amber" : status === 'error' ? "red" : "blue"}
            >
                {message}
            </Alert>
            </div>

        </>
    )
}

export default CartAlart