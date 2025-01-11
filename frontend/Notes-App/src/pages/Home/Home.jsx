import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar';
import NoteCard from '../../Components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import moment from "moment";
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../Components/ToastMessage/Toast';
import EmptyCard from '../../Components/EmptyCard/EmptyCard';
import emptynote from '../../assets/add-note.svg';

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({ isShown: false });
  const [allNotes, setAllNotes] = useState([]); // Default state is an empty array
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch]= useState(false);

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  // Function to show toast message
  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message, // Use the actual message
      type,    // Pass the type
    });

    // Automatically hide the toast after 3 seconds
    setTimeout(() => {
      setShowToastMsg((prev) => ({
        ...prev,
        isShown: false,
      }));
    }, 3000);
  };

  const handleCloseToast = () => {
    setShowToastMsg((prev) => ({
      ...prev,
      isShown: false,
    }));
  };

  // Function to fetch user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Function to fetch all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      console.log("Notes Response: ", response.data); // Debugging the response
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const deleteNote = async(data) => {
    const noteId = data._id
    try{
      const response= await axiosInstance.delete("/delete-note/"+ noteId);
      if(response.data && !response.data.error){
        showToastMessage("Note Deleted Successfully", 'delete') ;
        getAllNotes();
        
      }
    }
    catch(error){
      if(
        error.response &&
        error.response.data &&
        error.response.data.message
      ){
        console.log("An unexpected error occurred. Please try again.");
      }

      
    }
  }

  const onSearchNote = async(query)=>{
    try{
      const response =await axiosInstance.get("/search-notes",{
        params: {query},
      });
      if(response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    }catch(error){
      console.log(error);
    }
  }
   const handleClearSearch=() =>{
    setIsSearch(false);
    getAllNotes();
   };

  // Fetch user info and notes on component mount
  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
      <div className="container mx-auto pl-4 pr-4">
        {allNotes.length >0 ? (
        <div className="grid grid-cols-3 gap-3 mt-8">
          {/* Mapping through notes and rendering NoteCards */}
          {allNotes.map((item) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={item.createdOn} // Formatted date
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => {
                handleEdit(item);
              }}
              onDelete={() => deleteNote(item)}
              onPinNote={() => {}}
            />
          ))}
        </div>
        ) :(<EmptyCard imgSrc={emptynote} message={'What are you waiting start your brain dumping!! just click on the add button and start writing your thoughts or anything in your dumps!!'}/>)}
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() =>
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
