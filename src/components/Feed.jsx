import axios from 'axios';
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom';
import {getFeed} from '../utils/feedSlice'
import UserCard from './UserCard';
const Feed = () => {

  const dispatch=useDispatch();
  const feed=useSelector((store)=>store.feed)
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const getFeeds=useCallback(async()=>{
    try{
    const res=await axios.get(searchTerm ? "http://localhost:3000/user/search" : "http://localhost:3000/feed", {
      params: searchTerm ? { search: searchTerm } : {},
      withCredentials:true
    }
    )
    dispatch(getFeed(res.data))
    }
  catch(err){
    console.error("Feed failed"+err.message)

  }
  }, [dispatch, searchTerm])

  useEffect(()=>{
    getFeeds()
  }, [getFeeds])

  if(!feed) return null;

  return (
    <main className="home-page">
      {feed.length === 0 ? (
        <p className="empty-state">
          {searchTerm ? `No people found for "${searchTerm}".` : "No New User Found"}
        </p>
      ) : (
        <div className="home-feed-grid directory-grid">
          {feed.map((user)=>(
            <div className="directory-card" key={user._id}>
              <UserCard user={user}/>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Feed

