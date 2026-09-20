import Navbar from './Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addUser } from '../utils/userSlice';
import { startTransition, useCallback, useEffect, useState } from 'react';
const Body = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const fetchUser=useCallback(async()=>{
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
  }, [dispatch, navigate])
  useEffect(()=>{
    startTransition(() => fetchUser());

    const heartbeatId = setInterval(fetchUser, 60000);
    return () => clearInterval(heartbeatId);
  },[fetchUser])
  if (isCheckingAuth) {
    return <div className="flex min-h-screen items-center justify-center">Checking session...</div>;
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="app-main flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Body
