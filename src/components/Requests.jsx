import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addRequest, removeRequest } from '../utils/requestSlice'
import axios from 'axios'

const Requests = () => {
   const dispatch=useDispatch()
   const requests=useSelector((store)=>store.request)
    const requestConnection=useCallback(async()=>{
      try{
      const res=await axios.get("http://localhost:3000/user/request/received",
       {withCredentials:true}
      )
      console.log("Received requests API response:", res.data);
      const receivedRequests = Array.isArray(res.data?.data) ? res.data.data : [];
      dispatch(addRequest(receivedRequests));
        }
  catch(err){
    console.log("Error: "+err.message);
  }
    }, [dispatch])

    const reviewRequest=async(status,requestId)=>{
        try{
          await axios.post("http://localhost:3000/request/view/"+status+"/"+requestId,{},
            {withCredentials:true})
          dispatch(removeRequest(requestId));
        }
        catch(err){
          console.error("Error: "+err.message)
        }
    }

    useEffect(()=>{
      requestConnection()
    },[requestConnection])
    if(!requests) return;
    if(requests.length==0){
      return <h1 className="empty-state">No Request Found</h1>
    }
  return (
    <div className="directory-grid">
      {requests.map((request) => {
        if (!request.fromUserId) {
          console.warn("Request has no populated fromUserId:", request);
          return null;
        }

        const {
          _id,
          firstName,
          lastName,
          age,
          gender,
          about,
          skills,
          photoUrl,
          Bio,
          Skills,
        } = request.fromUserId;
        const userAbout = about || Bio;
        const userSkills = skills || Skills;
        return (
          <div
            key={request._id}
            className="card directory-card bg-base-100"
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
              {userAbout && <p className="text-sm">{userAbout}</p>}
              <div className="card-actions mt-2 flex flex-wrap justify-center gap-2">
                {userSkills?.map((skill) => (
                  <div key={skill} className="badge badge-outline">
                    {skill}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex w-full gap-3">
                <button
                  className="btn btn-success flex-1"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-error btn-outline flex-1"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default Requests
