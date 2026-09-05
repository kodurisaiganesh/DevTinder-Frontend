import Navbar from './Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addUser } from '../utils/userSlice';
import { useEffect } from 'react';
const Body = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const fetchUser=async()=>{
    try{
    const res=await axios.get("http://localhost:3000/profile",
      {withCredentials:true}
    );
    dispatch(addUser(res.data));
  }
  catch(err){
    if(err.status===401){
      navigate("/login")
    }
    console.log(err)
  }
  }
  useEffect(()=>{
    fetchUser();
  },[])
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Body
