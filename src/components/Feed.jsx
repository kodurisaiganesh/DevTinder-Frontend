import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {getFeed} from '../utils/feedSlice'
import UserCard from './UserCard';
const Feed = () => {

  const dispatch=useDispatch();
  const feed=useSelector((store)=>store.feed)
  const getFeeds=async()=>{
    try{
    const res=await axios.get("http://localhost:3000/feed",
      {withCredentials:true}
    )
    dispatch(getFeed(res.data))
  }
  catch(err){
    console.error("Feed failed"+err.message)

  }
  }

  useEffect(()=>{
    getFeeds()
  },[])

  if(!feed || feed.length===0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {feed.map((user)=>(
        <UserCard key={user._id} user={user}/>
      ))}
    </div>
  )
}

export default Feed

