import { createSlice } from "@reduxjs/toolkit";

const requestSlice=createSlice({
    name:'request',
    initialState:[],
    reducers:{
        addRequest:(state,action)=>{
            return action.payload;
        },
        removeRequest:(state,action)=>{
            return state.filter((request) => request._id !== action.payload);
        }
    }
})
export const {addRequest,removeRequest}=requestSlice.actions;
const requestReducer = requestSlice.reducer;
export default requestReducer;