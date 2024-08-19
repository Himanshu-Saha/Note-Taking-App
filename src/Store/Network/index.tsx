import { createSlice } from "@reduxjs/toolkit";

const network = createSlice({
    name:'network',
    initialState:{
        isAvailable:true,
    },
    reducers:{
        updateNetwork:(state,action)=>{
            state.isAvailable = action.payload;
        },
    }
})

export const {updateNetwork} = network.actions;

export default network.reducer;