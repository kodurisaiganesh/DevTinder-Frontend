import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionsSlice';

const Connections = () => {
    const dispatch=useDispatch();
    const connections=useSelector((store)=>store.connections)
    const fetchConnections=async()=>{
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
    }

    useEffect(()=>{
        fetchConnections()
    },[])
    if(!connections) return ;
    if(connections.length==0){
       return <h1>No Connections</h1>
    }

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      {connections.map((connection) => {
        const { _id, firstName, lastName, age, gender, about, skills, photoUrl } = connection;
        return (
          <div
            key={_id}
            className="card bg-base-100 w-80 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow"
          >
            <figure className="px-4 pt-4">
              <img
                alt={`${firstName}'s profile`}
                src={photoUrl}
                className="aspect-square w-full rounded-xl object-cover"
              />
            </figure>
            <div className="card-body items-center text-center">
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
              {about && <p className="text-sm">{about}</p>}
              <div className="card-actions mt-2 flex flex-wrap justify-center gap-2">
                {skills?.map((skill) => (
                  <div key={skill} className="badge badge-outline">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default Connections


