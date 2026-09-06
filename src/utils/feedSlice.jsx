import { createSlice } from "@reduxjs/toolkit";

const feedSlice=createSlice({
    name:'feed',
    initialState:null,
    reducers:{
        getFeed:(state,action)=>{
            return action.payload;
        },
        removeFeed:(state,action)=>{
            return null;
        }
    }

})
export const{getFeed,removeFeed}=feedSlice.actions;
export default feedSlice.reducer;