import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { BsJournalBookmarkFill, BsTwitter, BsYoutube } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillFacebook } from 'react-icons/ai';
import { FaInstagramSquare, FaTelegram } from 'react-icons/fa';
import img from '../../assets/food2.jpg'
import { NavbarContent, AdminNavbarContent } from '../Constant';
import { MdRestaurantMenu } from 'react-icons/md';
import { GiSelfLove } from "react-icons/gi";
import { FaBowlFood } from "react-icons/fa6";
import { BsGraphUpArrow } from "react-icons/bs";
import { Avatar } from "@material-tailwind/react";
import useUserAuthorization from '../../hooks/UserAuth';
import useUserCart from '../../hooks/UserCartItem';
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";
import { RiFileHistoryLine, RiOrderPlayFill } from "react-icons/ri";
import { useSelector } from 'react-redux';

const AdminNavbar = () => {

    const logOut = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true })
      }
      
const navigate = useNavigate()
    const user = useSelector((state) => state.user.user);
    const [state, setState] = useState({
        left: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}>
            <div className='w-32 h-32 p-3 mx-auto md:w-40 md:h-40'>
                <img src={img} alt="" className='w-full h-full bg-contain rounded-full' />
            </div>
            <List>
                {AdminNavbarContent.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <Link className='w-full' to={item.link}>
                            <ListItemButton>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.name} className={item.log ? 'text-red-500' : ''} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <div className='px-1 py-3 font-bold text-white uppercase list-none bg-white border-b border-opacity-50 cursor-pointer md:px-5 sm:px-5 text-md border-slate-300'>
                    <div className="container flex justify-between mx-auto text-[30px]">
                        <AiFillFacebook className='text-blue-700 transition-all duration-300 ease-in-out cursor-pointer hover:scale-150 drop-shadow-lg' />
                        <FaInstagramSquare className='transition-all duration-300 ease-in-out rounded-lg cursor-pointer hover:scale-150 drop-shadow-lg bg-gradient-to-r from-yellow-700 to-pink-500 xt-red-500' />
                        <BsYoutube className='text-red-500 transition-all duration-300 ease-in-out cursor-pointer hover:scale-150 drop-shadow-lg' />
                        <BsTwitter className='transition-all duration-300 ease-in-out cursor-pointer hover:scale-150 drop-shadow-lg text-sky-400' />
                        <FaTelegram className='text-blue-500 transition-all duration-300 ease-in-out cursor-pointer hover:scale-150 drop-shadow-lg' />
                    </div>
                </div>
            </List>
        </Box>
    );
    return (
        <div className=' !sticky !top-0 bg-red-600 !z-50'>
            {['left'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <div className="text">
                        <div className="flex justify-between px-2 text-white text">
                            <IconButton
                                size="large"
                                edge="start"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}>
                                <Button onClick={toggleDrawer(anchor, true)}>
                                    <MenuIcon className='!text-white' />
                                </Button>
                            </IconButton>

                            <div className="flex text">
                                <div className="flex items-center overflow-auto">
                                    <div className="!visible mt-2 hidden ms-5 flex-grow basis-[100%] items-center lg:mt-0 lg:!flex lg:basis-auto"
                                        id="navbarSupportedContent3" data-te-collapse-item>
                                        <ul className="flex flex-col pl-0 mr-auto list-style-none lg:flex-row" data-te-navbar-nav-ref>
                                        </ul>
                                        <Button onClick={()=> navigate('/admin/order')} className="flex ms-2.5 items-center border-slate-300 font-mono text-bold text-lg border px-3 rounded cursor-pointer ">
                                            <RiOrderPlayFill className="text-3xl" />
                                            <sup className="items-center w-8 h-8 text-lg text-center text-white bg-dark rounded-full -top-4 pt-0.5">
                                             0
                                            </sup>
                                        </Button>
                                    </div>
                                    <div className="ps-2">
                                        <Menu animate={{ mount: { y: 0 }, unmount: { y: 25 } }}>
                                            <MenuHandler>
                                                <Button>
                                                    {user.profileImage ? (
                                                        <Avatar src={img} alt="avatar" size="lg" />
                                                    ) : (
                                                        <div className="bg-slate-200 lg: w-[50px] h-[50px] flex items-center justify-center p-2 text-[1.1rem]  rounded-full uppercase text-black font-medium">
                                                            {user.firstname && user.firstname.charAt(0)}
                                                            {user.lastname && user.lastname.charAt(0)}
                                                        </div>
                                                    )}
                                                </Button>
                                            </MenuHandler>
                                            <MenuList>
                                                <MenuItem>
                                                <p  onClick={logOut} >LogOut</p>
                                                </MenuItem>

                                            </MenuList>
                                        </Menu>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}>
                        {list(anchor)}
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
        </div>
    );
}

export default AdminNavbar