import React, { useContext, useState } from 'react'
import { Link , useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const[userData,setUserData] = useState({
    email:'',
    password:'',
  })
const [error,setError] = useState('');
const navigate = useNavigate();

const {setCurrentUser} = useContext(UserContext);
  const handleOnChange = (e) =>{
    setUserData(prev=>{
      return {...prev, [e.target.name]:e.target.value}
    });
  }

  const loginUser = async(e) =>{
    e.preventDefault();
    try {
      const response = await axios.post('https://blog-application-tqqt.onrender.com/api/users/login',userData);
      const user = await response.data;
      setCurrentUser(user);
      navigate('/') 
    } catch (error) {
      setError(error.response.data.message)
    }
  }
  return (
    <section className='login'>
      <div className="container">
        <h2>Sign In</h2>
        <form className='form login__form' onSubmit={loginUser}>
          { error &&  <p className="form__error-message">
            {error}
          </p>}
          <input type="email" placeholder='Email ' name='email' value={userData.email} onChange={handleOnChange} autoFocus />
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={handleOnChange} />
        <button type='submit' className='btn primary'>Login</button>
        </form>
        <small>Don't have an Account ? <Link to='/register'>Sign up</Link></small>
      </div>
    </section>
  )
}

export default Login
