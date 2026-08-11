import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: "",
    reference: "",
    status: "",
    transaction: "",
    latitude: "",
    longitude: "",
    state: "",
    city: "",
    address: "",
    email: "",
    phoneNo: "",
    amount: 0,
    deliveryFee: 0,
    totalFee: 0,
    deliveryType: "",
    cart: [],
    deliverNote: "",
};

const deliveryInfoSlice = createSlice({
    name: "delivery",
    initialState,
    reducers: {
        setMessage: (state, action) => {
            state.message = action.payload.message;
        },
        setReference: (state, action) => {
            state.reference = action.payload.reference;
        },
        setStatus: (state, action) => {
            state.status = action.payload.status;
        },
        setTransaction: (state, action) => {
            state.transaction = action.payload.transaction;
        },
        setLatitude: (state, action) => {
            state.latitude = action.payload.latitude;
        },
        setLongitude: (state, action) => {
            state.longitude = action.payload.longitude;
        },
        setState: (state, action) => {
            state.state = action.payload.state;
        },
        setCity: (state, action) => {
            state.city = action.payload.city;
        },
        setAddress: (state, action) => {
            state.address = action.payload.address;
        },
        setEmail: (state, action) => {
            state.email = action.payload.email;
        },
        setPhoneNo: (state, action) => {
            state.phoneNo = action.payload.phoneNo;
        },
        setAmount: (state, action) => {
            state.amount = action.payload.amount;
        },
        setDeliveryFee: (state, action) => {
            state.deliveryFee = action.payload.deliveryFee;
        },
        setTotalFee: (state, action) => {
            state.totalFee = action.payload.totalFee;
        },
        setCart: (state, action) => {
            state.cart = action.payload.cart;
        },
        setDeliveryType: (state, action) => {
            state.deliveryType = action.payload.deliveryType;
        },
        setDeliverNote: (state, action) => {
            state.deliverNote = action.payload.deliverNote;
        },

        clearKycInputFields: (state) => {
            state.message = "";
            state.reference = "";
            state.status = "";
            state.transaction = "";
            state.latitude = "";
            state.longitude = "";
            state.state = "";
            state.city = "";
            state.address = "";
            state.email = "";
            state.phoneNo = "";
            state.amount = 0;
            state.deliveryFee = 0;
            state.totalFee = 0;
            state.deliveryType = "";
            state.cart = [];
            state.deliverNote;
        },
    },
});

export const {
    clearKycInputFields,
    setMessage,
    setReference,
    setStatus,
    setTransaction,
    setLatitude,
    setLongitude,
    setState,
    setCity,
    setAddress,
    setEmail,
    setPhoneNo,
    setAmount,
    setDeliveryFee,
    setTotalFee,
    setDeliveryType,
    setCart,
    setDeliverNote
} = deliveryInfoSlice.actions;

export default deliveryInfoSlice.reducer;
