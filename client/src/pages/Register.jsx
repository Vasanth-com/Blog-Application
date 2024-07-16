import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const[userData,setUserData] = useState({
    name:'',
    email:'',
    password:'',
    password2:'',
  })
  const[error,setError] = useState('');
  const navigate = useNavigate();

  const handleOnChange = (e) =>{
    setUserData(prev=>{
      return {...prev, [e.target.name]:e.target.value}
    });
  }

  const registerUser = async(e)=>{
      e.preventDefault();
      try {
        const res = await axios.post('https://blog-application-h0j4.onrender.com/api/users/register',userData)
        console.log(res);
        const newUser = await res.data
        console.log(newUser);
        if(!newUser){
          setError("Couldn't register user. Please try again.")
        }
        navigate('/login')
      } catch (err) {
          setError(err.response.data.message);
      }
  }
  return (
    <section className='register'>
      <div className="container">
        <h2>Sign Up</h2>
        <form className='form register__form' onSubmit={registerUser}>
           { error && <p className="form__error-message"> {error} </p>}
          <input type="text" placeholder='Full Name' name='name' value={userData.name} onChange={handleOnChange} autoFocus />
          <input type="email" placeholder='Email ' name='email' value={userData.email} onChange={handleOnChange} />
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={handleOnChange} />
          <input type="password" placeholder='Confirm Password' name='password2' value={userData.password2} onChange={handleOnChange} />
        <button type='submit' className='btn primary'>Register</button>
        </form>
        <small>Already have an Account ? <Link to='/login'>Sign in</Link></small>
      </div>
    </section>
  )
}

export default Register
