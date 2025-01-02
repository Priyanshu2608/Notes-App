import React, {useState} from 'react'
import Navbar from '../../Components/Navbar'
import { Link } from 'react-router-dom'
import PasswordInput from '../../Components/Input/PasswordInput.jsx'
const Login = () => {
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[error,setError]=useState(null);

  const handlelogin= async(e)=>{
    e.preventDefault();
  }
  return (
    <>
      <Navbar/>
      <div className="flex justify-center items-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handlelogin}>
            <h4 className="text-2xl mb-7">Login</h4>
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
            <button type='submit' className='btn-primary'>
              Login
            </button>
            <p className="text-sm text-center mt-4">
              Not registered yet?{""}
              <Link to='/signup' className="font-medium text-primary underline">Create an Account</Link>

            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
