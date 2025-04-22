import React, {useState} from 'react'
import Navbar from '../../Components/Navbar';
import PasswordInput from '../../Components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const Signup = () => {
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[error,setError]=useState(null);

  const navigate = useNavigate()
  const handleSignup = async(e) => {
    e.preventDefault();

    if(!name){
      setError("Please enter your name");
      return;}

    if(!validateEmail(email)) {
      setError("Please enter your email");
      return;
    }
    if(!password){
      setError("Please enter a password");
      return;
    }
    setError("");
    try {
      const response = await axiosInstance.post("/create-account", { 
        fullName: name,
        email: email, 
        password: password });
      if (response.data && response.data.error) {
        setError(response.data.message)
        return
        
      }
      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken)
        navigate('/dashboard')
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
    <Navbar/>
    <div className="flex justify-center items-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl mb-7">Signup</h4>
            <input 
            type="text" 
            placeholder='Name' 
            className="input-box"
            value={name} 
            onChange={(e)=>setName(e.target.value)}
             />

<input 
            type="text" 
            placeholder='Email' 
            className="input-box"
            value={email} 
            onChange={(e)=>setEmail(e.target.value)}
             />
             <PasswordInput
              value={password}
              onChange={(e)=>setPassword(e.target.value)} 
            />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}  
            <button type='submit' className='btn-primary'>
              Create An Account
            </button>
            <p className="text-sm text-center mt-4">
              Have an account?{""}
              <Link to='/login' className="font-medium text-primary underline">Login </Link>

            </p>
            </form>
            </div>
            </div>
            </>
  )
}

export default Signup
