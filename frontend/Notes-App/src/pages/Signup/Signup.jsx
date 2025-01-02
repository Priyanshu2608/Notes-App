import React, {useState} from 'react'
import Navbar from '../../Components/Navbar';

const Signup = () => {
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[error,setError]=useState(null);
  const handleSignup = async(e) => {
    e.preventDefault();
    }
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
            </form>
            </div>
            </div>
            </>
  )
}

export default Signup
