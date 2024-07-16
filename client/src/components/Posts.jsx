import React, { useEffect, useState } from 'react'
import PostItem from './PostItem'
import Loader from './Loader'
import axios from 'axios';


const Posts = () => {
    const[post,setPost] = useState([])
    const[isLoading,setIsLoading] = useState(false);
    useEffect(()=>{
      const fetchPosts = async()=>{
        setIsLoading(true);
        try {
          const response = await axios.get('https://blog-application-h0j4.onrender.com/api/posts')
          setPost(response?.data)
        } catch (error) {
          console.log(error);
        }
        setIsLoading(false);
      }
      fetchPosts()
    },[])

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

export default Posts
