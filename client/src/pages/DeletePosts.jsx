import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import Loader from '../components/Loader';

const DeletePosts = ({postId:id}) => {
  const {currentUser} = useContext(UserContext);
const token = currentUser?.token;
const navigate = useNavigate()
const location = useLocation()
const[isLoading,setIsLoading] = useState(false);

// redirect to login page for any user who isn't logged in

useEffect(()=>{
  if(!token){
    navigate('/login')
   }
},[token,navigate])


const removePost = async() =>{
  setIsLoading(true);
  try {
    const response = await axios.delete(`https://blog-application-h0j4.onrender.com/api/posts/${id}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
    if(response.status === 200){
      if(location.pathname === `/myposts/${currentUser.id}`){
        navigate(0)
      }else{
        navigate('/')
      }
    }
  } catch (error) {
    console.log("Couldn't delete post");
  }
  setIsLoading(false);
}

if(isLoading){
  return <Loader/>
}


  return (
    <Link className='btn sm danger' onClick={()=>removePost(id)}>Delete</Link>
  )
}

export default DeletePosts
