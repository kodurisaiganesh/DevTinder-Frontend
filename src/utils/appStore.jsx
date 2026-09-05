import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'

const Store=new configureStore({
    reducer:{
        user:userReducer
    }
})
export default Store;