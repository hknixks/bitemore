import { createSlice } from "@reduxjs/toolkit";

const User=createSlice({
    name:'user',
    initialState:{
        user:{},
       
    },
    reducers:{
        addUser(state,action){
            state.user=action.payload;
        },
    }

});

export default User.reducer;

export const { addUser } = User.actions;