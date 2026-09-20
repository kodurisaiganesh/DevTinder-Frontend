import axios from 'axios'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { addConnections } from '../utils/connectionsSlice';

const Connections = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const connections=useSelector((store)=>store.connections)
    const fetchConnections=useCallback(async()=>{
        try{
        const res=await axios.get("http://localhost:3000/user/connections",
            {withCredentials:true}
        )
        dispatch(addConnections(res.data.data));
        console.log(res.data.data)

        }
    catch(err){
        console.error("Error: "+err.message);
    }
      }, [dispatch])

    useEffect(()=>{
        fetchConnections()
    },[fetchConnections])
    if(!connections) return ;
     if(connections.length==0){
       return <h1 className="empty-state">No Connections</h1>
    }

  return (
    <section className="connections-page">
      <div className="connections-heading">
        <div className="connections-heading-copy">
          <p className="connections-eyebrow">NETWORK</p>
          <h1>My connections</h1>
          <p>Stay in touch with the people in your professional circle.</p>
        </div>
        <div className="connections-heading-aside">
          <span className="connections-count">{connections.length}</span>
          <span className="connections-count-label">people in your circle</span>
        </div>
      </div>
      <div className="directory-grid connections-grid">
      {connections.map((connection) => {
        const { _id, firstName, lastName, age, gender, about, Bio, skills, Skills, photoUrl } = connection;
        return (
          <div
            key={_id}
            className="card directory-card connection-card bg-base-100"
          >
            <figure className="connection-card-figure">
              <img
                alt={`${firstName}'s profile`}
                src={photoUrl}
                className="aspect-square w-full rounded-xl object-cover"
              />
              <figcaption className="connection-card-status">
                <span className="connection-status-dot" aria-hidden="true" />
                Connected
              </figcaption>
            </figure>
            <div className="card-body connection-card-body items-center text-center">
              <h2 className="card-title">
                {firstName} {lastName}
              </h2>
              {(age || gender) && (
                <p className="text-sm text-gray-500">
                  {age && `${age} yrs`}
                  {age && gender && " • "}
                  {gender}
                </p>
              )}
              {(about || Bio) && <p className="connection-card-about text-sm">{about || Bio}</p>}
              <div className="connection-card-skills card-actions mt-2 flex flex-wrap justify-center gap-2">
                {(skills || Skills)?.map((skill) => (
                  <div key={skill} className="badge badge-outline">
                    {skill}
                  </div>
                ))}
              </div>
              <div className="connection-actions mt-3">
                <button
                  className="btn connection-message-button"
                  type="button"
                  onClick={() => navigate(`/chat/${_id}`)}
                >
                  Message
                </button>
                <button
                  className="btn connection-profile-button"
                  type="button"
                  onClick={() => navigate(`/connection/${_id}`)}
                >
                  View profile
                </button>
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </section>
  )
}

export default Connections


