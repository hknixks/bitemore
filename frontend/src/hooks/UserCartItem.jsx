import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import useUserAuthorization from './UserAuth';
import baseUrl from '../BaseUrl';
import { useDispatch, useSelector } from 'react-redux';
import { addCart } from '../Redux/Cart.slice';

const useUserCart = () => {
    const user = useSelector((state) => state.user.user);
    const { enqueueSnackbar } = useSnackbar();
    // const { user } = useUserAuthorization();
    const [cart, setCart] = useState([]);
    const dispatch = useDispatch();
    const info = useSelector((state) => state.cart.cart);

    // console.log(user);
    // console.log(info);
    // console.log(cart);
    const fetchData = async () => {
        if (!user || !user._id) {
            return; // Return early if user or user._id is undefined  
        }
        if (user) {
            try {
                const resp = await axios.get(`${baseUrl}/getUserCart/${user._id}`);
                const message = resp.data.message;
                const data = resp.data.data;
                const filterData = data.filter((item) => item.status !== 'Paid' && item.status !== 'Delivered');
                setCart(filterData)
                dispatch(addCart(filterData));
                if (resp.data.status) {
                    setCart(filterData)
                } else {
                    enqueueSnackbar(message, { variant: 'warning' });
                }
            } catch (error) {
                // console.log(error);
                enqueueSnackbar('Internal server error', { variant: 'error' });
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const refetch = () => {
        fetchData();
    };

    return { cart, refetch };
};

export default useUserCart;
