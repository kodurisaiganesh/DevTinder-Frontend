import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { removeUser } from '../utils/userSlice';
const Navbar = () => {
const dispatch=useDispatch();
const navigate=useNavigate();
const user=useSelector((store)=>store.user)

const handleLogout=async()=>{
  try{
  await axios.post("http://localhost:3000/logout",
   {},
   { withCredentials: true }
  )
  dispatch(removeUser());
  navigate("/login")
}
catch(err)
{
  console.error("Logout Failed");
}
}
//console.log(user);
  return (
    <header className="sticky top-0 z-20">
       <div className="navbar min-h-16 bg-base-200 px-4 shadow-sm sm:px-6">
  <div className="flex-1">
    <Link  to={"/"} className="btn btn-ghost px-2 text-xl" href="/">DevTinder</Link>
  </div>
  <div className="flex items-center gap-2">
    <div className="dropdown dropdown-end">
     {(user &&  <div tabIndex={0} role="button" className="btn btn-ghost h-auto min-h-10 gap-2 px-2 sm:px-3">
           <span className="hidden text-sm font-medium sm:inline">Welcome, {user.firstName}</span>

        <div className="w-9 rounded-full sm:w-10">
         
          <img
            alt={`${user.firstName}'s profile`}
            className="aspect-square object-cover"
            src={user.photoUrl}
          />
        </div>
      </div>)}
      <ul
        tabIndex={-1}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <Link to={"/profile"} className="justify-between">
            Profile
            <span className="badge">New</span>
          </Link>
        </li>
        <li><a>Settings</a></li>
        <li onClick={handleLogout}><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
    </header>
  )
}

export default Navbar
