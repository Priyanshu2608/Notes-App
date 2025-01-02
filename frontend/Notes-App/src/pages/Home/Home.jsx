import React from 'react'
import Navbar from '../../Components/Navbar'
import NoteCard from '../../Components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'


const Home = () => {
  return (
    <>
    <Navbar/>
    <div className="container mx-auto pl-4 pr-4">
      <div className="grid grid-cols-3 gap-3 mt-8 ">
      <NoteCard 
      title="meeting on 20th" 
      date="20th january 2024" 
      content="I have flight"
      tags="#Meeting"
      isPinned={true}
      onEdit={()=>{}}
      onDelete={()=>{}}
      onPinNote={()=>{}}
      />
      </div>
    </div>
    <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10  " onClick={()=>{}}>
      <MdAdd className="text-[32px] text-white"/>
    </button>
    </>
  )
}

export default Home
