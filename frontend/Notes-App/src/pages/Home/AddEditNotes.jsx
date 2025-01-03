import React, {useState} from 'react'
import TagInput from '../../Components/Input/TagInput';
import { MdClose } from 'react-icons/md';

const AddEditNotes = ({onClose}) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);
  return (
    
    <div>
      <button
      className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500"
      onClick={onClose}

      >
        <MdClose className="text-xl text-slate-400"/>
      </button>
      <div className=" flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input 
        type="text"
        className="text-2xl text-slate-950 outline-none"
        placeholder="Go To Gym At 5 " 
        value= {title}
        onChange={({target})=>setTitle(target.value)}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label"> CONTENT</label>
        <textarea 
        type="text"
        className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
        placeholder="Content"
        rows={10}
        value= {content}
        onChange={({target})=>setContent(target.value)}
        ></textarea>
      </div>
      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags}/>
      </div>
      <button className="btn-primary font-medium mt-5 p-3" onClick={()=>{}}>ADD</button>
    </div>
  )
}

export default AddEditNotes
