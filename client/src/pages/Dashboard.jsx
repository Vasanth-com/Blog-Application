import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import Loader from '../components/Loader'
import axios from 'axios'
import DeletePosts from './DeletePosts'
const Dashboard = () => {
  const navigate = useNavigate()
  const[posts,setPosts]=useState([])
  const[isLoading,setIsLoading] =useState(false);
  const {id}  = useParams();
  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;
  // redirect to login page for any user who isn't logged in
  
  
 useEffect(()=>{
  if(!token){
    navigate('/login')
   }
 },[token,navigate])

  useEffect(()=>{
    const fetchPosts = async()=>{
      setIsLoading(true);
      try {
        const response = await axios.get(`https://blog-application-h0j4.onrender.com/api/posts/users/${id}`,{withCredentials:true,headers:{Authorization: `Bearer ${token}`}})
        setPosts(response.data)
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false)
    }
    fetchPosts()
  },[id,token])

  if(isLoading){
    return <Loader/>
  }

  return (
   <section className="dashboard">
    {
      posts.length ? 
      <div className="container dashboard__container">
         {
          posts.map(post =>{
            return <article key={post.id} className='dashboard__post'>
              <div className="dashboard__post-info">
                <div className="dashboard__post-thumbnail">
                  <img src={`https://blog-application-h0j4.onrender.com/uploads/${post.thumbnail}`} alt="" />
                </div>
                <h5>{post.title}</h5>
              </div>
              <div className="dashboard__post-action">
                <Link to={`/posts/${post._id}`} className='btn sm'>View</Link>
                <Link to={`/posts/${post._id}/edit`} className='btn sm primary'>Edit</Link>
                <DeletePosts postId={post._id} />
              </div>
            </article>
          })
         }
      </div> : 
      <h2 className="center">You have no posts yet.</h2>
    }
   </section>
  )
}

export default Dashboard
