import React, { useEffect, useState } from 'react'
import PostItem from '../components/PostItem'
import Loader from '../components/Loader'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const AutherPosts = () => {
  const[post,setPost] = useState([])
  const[isLoading,setIsLoading] = useState(false);


    const {id} = useParams()
    console.log(id);
  useEffect(()=>{
    const fetchPosts = async()=>{
      setIsLoading(true);
      try {
        const response = await axios.get(`https://blog-application-tqqt.onrender.com/api/posts/users/${id}`)
        setPost(response?.data)
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    fetchPosts()
  },[id])

  if(isLoading){
    return <Loader/>
  }
return (
  <section className='posts'>
    { post.length > 0 ?
       <div className="container posts__container">
       {
            post.map(({_id: id , thumbnail, title,description,category, creator,createdAt})=> <PostItem 
            key={id} postID ={id}  thumbnail={thumbnail} category={category} title ={title} description ={description} authorID = {creator}  createdAt={createdAt}
            />)
        } 
       </div> : <h2 className='center'>No posts found</h2>
    }
  </section>
) 
}

export default AutherPosts
