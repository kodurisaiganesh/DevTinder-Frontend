import { createSlice } from "@reduxjs/toolkit";

const connectionSlice=createSlice({
    name:'connections',
    initialState:null,
    reducers:{
        addConnections:(state,action)=>{
            return action.payload
        },
        removeConnections:()=>null
    }
})
export const {addConnections,removeConnections}=connectionSlice.actions;
const connectionReducer = connectionSlice.reducer;
export default connectionReducer;