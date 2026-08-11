import React from 'react'
import { Outlet } from 'react-router-dom';
import Loader from '../../../utils/Loader';
import useUserAuthorization from '../../../hooks/UserAuth';
import NavBar from '../UserNavbar';


const UserLayout = () => {
    const { user, isLoading } = useUserAuthorization();
    return (
        <>
            {isLoading && <Loader />}
            <NavBar />
            <Outlet />
        </>
    )
}

export default UserLayout