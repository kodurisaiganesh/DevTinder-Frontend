import { useState } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { addUser } from "../utils/userSlice";
import { useNavigate } from 'react-router-dom';
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const handleLogin = async () => {
    try {
      const res=await axios.post(
        "http://localhost:3000/login",
        { email, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex justify-center my-10">
    <div className="card card-border bg-base-100 w-96">
  <div className="card-body">
    <h2 className="card-title">Login Page</h2>
    <div>
    <fieldset className="fieldset">
  <legend className="fieldset-legend">Email</legend>
  <input type="email" className="input" placeholder="Type here" 
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
   />
</fieldset>
</div>
<div>
    <fieldset className="fieldset">
  <legend className="fieldset-legend">Password</legend>
  <input type="password" className="input" placeholder="Type here" 
  value={password}
  onChange={(e)=>setPassword(e.target.value)}
  />
</fieldset>
</div>
    <div className="card-actions justify-center">
      <button className="btn btn-primary justify-center" onClick={handleLogin}>Login</button>
    </div>
  </div>
</div>
</div>
  );
}

export default Login;