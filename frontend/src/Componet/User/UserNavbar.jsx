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
import { PiNotification } from 'react-icons/pi';
import { BsJournalBookmarkFill, BsTwitter, BsYoutube } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillFacebook } from 'react-icons/ai';
import { FaInstagramSquare, FaTelegram } from 'react-icons/fa';
import img from '../../assets/food2.jpg'
import { NavbarContent } from '../Constant';
import { MdRestaurantMenu } from 'react-icons/md';
import { GiSelfLove } from "react-icons/gi";
import { FaBowlFood } from "react-icons/fa6";
import { BsGraphUpArrow } from "react-icons/bs";
import { Avatar, Badge } from "@material-tailwind/react";
import useUserAuthorization from '../../hooks/UserAuth';
import useUserCart from '../../hooks/UserCartItem';
import useLogout from '../../hooks/UseLogout'
import logo from '../../assets/logo.png';
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";
import { useSelector } from 'react-redux';


const NavBar = () => {

    const userLogin = useSelector((state) => state.user.user);

    const logOutt = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true })
      }

    const { user } = useUserAuthorization();
    const navigate = useNavigate();
    const logout = useLogout();
    const cart = useSelector((state) => state.cart.cart);
    const [notificationCount, setNotificationCount] = useState(0);
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


    useEffect(() => {
        if (cart && cart.length > 0) {
            setNotificationCount(cart.length ?? 0)
        } else {
            setNotificationCount(0)
        }
    }, [cart]);

    const logOut = () => logout();

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}>
            <div className='w-32 h-32 p-3 mx-auto md:w-40 md:h-40'>
                <img src={userLogin.profileImage} alt="" className='w-full h-full bg-contain rounded-full' />
            </div>
            <List>
                {NavbarContent.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton component={Link} to={item.link.includes('/logout') ? undefined : item.link} onClick={item.link.includes('/user/logout') ? logOut : undefined}>
                            <ListItemIcon>
                                {item.name === 'My cart' ? (
                                    <Badge content={notificationCount.toString()}>
                                        {item.icon}
                                    </Badge>
                                ) : (
                                    item.icon
                                )}
                            </ListItemIcon>
                            <ListItemText primary={item.name} className={item.log ? 'text-red-500' : ''} />
                        </ListItemButton>
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
                        <div className="flex justify-between text-white text">
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
                                        <div className="flex items-center text-white">
                                            <Button onClick={() => navigate('/user/menu')} className="flex items-center !border-slat font-mono text-bold text-lg !border px-3 py-1 rounded cursor-pointer !text-white">
                                                Menu
                                                <MdRestaurantMenu className='ms-2 text-2xl text-indigo-' />
                                            </Button>
                                            
                                        </div>
                                        
                                        <Button onClick={() => navigate('/user/cart')} className="flex ms-2.5 items-center border-slate-300 font-mono text-bold text-lg border px-3 rounded cursor-pointer ">
                                            <Badge content={notificationCount.toString()}>
                                                <FaBowlFood className="flex py-1 text-4xl text-white " />
                                            </Badge>
                                        </Button>
                                    </div>
                                    <div className=" md:px-2">
                                        <Menu animate={{ mount: { y: 0 }, unmount: { y: 25 } }}>
                                            <MenuHandler>
                                                <Button>
                                                    {user.profile_image ? (
                                                        <Avatar src={img} alt="avatar" size="lg" />
                                                    ) : (
                                                        <div className="bg-slate-200 lg: w-[50px] h-[50px] flex items-center justify-center p-2 text-[1.1rem]  rounded-full uppercase text-black font-medium">
                                                            {user.firstname && user.firstname.charAt(0)}
                                                            {user.lastname && user.lastname.charAt(0)}
                                                        </div>
                                                    )}
                                                </Button>
                                            </MenuHandler>
                                            <MenuList className='text-sm font-medium'>
                                                <MenuItem><Link to={'/user/profile'}>Profile</Link></MenuItem>
                                                <MenuItem><Link onClick={logOutt}>Log-out</Link></MenuItem>
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
export default NavBar