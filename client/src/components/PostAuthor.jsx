import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'
TimeAgo.addLocale(en);
TimeAgo.addLocale(ru)


const PostAuthor = ({authorID,createdAt}) => {
  const [author,setAuthor] = useState({})
  useEffect(()=>{
    const getAuthor = async()=>{
      try {
        const response = await axios.get(`https://blog-application-tqqt.onrender.com/api/users/${authorID}`)
        setAuthor(response?.data)
      } catch (error) {
        console.log(error);
      }
    }
    getAuthor();
  },[authorID])
  return (
    <Link to={`/posts/users/${authorID}`} className='post__author'>
        <div className='posts__author-avatar'>
            <img src={`https://blog-application-tqqt.onrender.com/uploads/${author?.avatar}`} alt="" />
        </div>
        <div className="post__author-details">
            <h5>by: {author?.name}</h5>
            <small><ReactTimeAgo date={new Date(createdAt)}/></small>
        </div>
    </Link>
  )
}

export default PostAuthor
