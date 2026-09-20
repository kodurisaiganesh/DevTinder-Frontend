import React from 'react'
import EditProfile from './EditProfile'
import { useSelector } from 'react-redux'
const Profile = () => {
 const user=useSelector((store)=>store.user)

  return(user && (
    <main className="profile-page">
      <div className="profile-page-heading">
        <div>
          <p className="connections-eyebrow">YOUR SPACE</p>
          <h1>Shape your profile</h1>
          <p>Keep your details current so the right developers can find you.</p>
        </div>
      </div>
      <EditProfile user={user} />
    </main>
  ))
}

export default Profile
