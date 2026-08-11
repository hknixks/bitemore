import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Amin/AdminNavbar';

const AdminLayout = () => {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    )
}

export default AdminLayout