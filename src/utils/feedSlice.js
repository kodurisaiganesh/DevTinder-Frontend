import { createSlice } from "@reduxjs/toolkit";

const feedSlice=createSlice({
    name:'feed',
    initialState:null,
    reducers:{
        getFeed:(state,action)=>{
            return action.payload;
        },
        removeFeed:()=>null
    }

})
export const{getFeed,removeFeed}=feedSlice.actions;
const feedReducer = feedSlice.reducer;
export default feedReducer;