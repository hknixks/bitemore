import {configureStore} from "@reduxjs/toolkit";
import user from "./User.slice";
import cart from './Cart.slice';
import delivery from './DeliveryInfo.slice'

export const  store=configureStore({
    reducer:{
        user,
        cart,
        delivery
    },
    devTools:true
})