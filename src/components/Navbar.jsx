import React from 'react'
import { useSelector } from 'react-redux'
const Navbar = () => {

const user=useSelector((store)=>store.user)
console.log(user);
  return (
    <header className="sticky top-0 z-20">
       <div className="navbar min-h-16 bg-base-200 px-4 shadow-sm sm:px-6">
  <div className="flex-1">
    <a className="btn btn-ghost px-2 text-xl" href="/">DevTinder</a>
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
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
    </header>
  )
}

export default Navbar
