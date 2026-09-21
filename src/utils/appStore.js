import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice.js'
import feedReducer from './feedSlice.js'
import connectionReducer from './connectionsSlice.js'
import requestReducer from './requestSlice.js'
const Store=new configureStore({
    reducer:{
        user:userReducer,
        feed:feedReducer,
        connections:connectionReducer,
        request:requestReducer
    }
})
export default Store;