import Navbar from './Navbar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addUser } from '../utils/userSlice';
import { useEffect, useState } from 'react';
const Body = () => {
  const navigate=useNavigate();
  const location=useLocation();
  const dispatch=useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const fetchUser=async()=>{
    try{
    const res=await axios.get("http://localhost:3000/profile",
      {withCredentials:true}
    );
    dispatch(addUser(res.data));
    setIsCheckingAuth(false);
  }
  catch(err){
    if(err.response?.status===401){
      navigate("/login")
      return;
    }
    console.log(err)
    setIsCheckingAuth(false);
  }
  }
  useEffect(()=>{
    if (location.pathname === '/login' || location.pathname === '/signup') {
      setIsCheckingAuth(false);
      return;
    }
    setIsCheckingAuth(true);
    fetchUser();
  },[location.pathname])
  if (isCheckingAuth) {
    return <div className="flex min-h-screen items-center justify-center">Checking session...</div>;
  }
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
