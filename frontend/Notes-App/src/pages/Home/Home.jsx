import React, { useState } from 'react';
import Navbar from '../../Components/Navbar';
import NoteCard from '../../Components/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({ isShown: false });

  const openModal = () => {
    setOpenAddEditModal({ isShown: true });
  };

  const closeModal = () => {
    setOpenAddEditModal({ isShown: false });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto pl-4 pr-4">
        <div className="grid grid-cols-3 gap-3 mt-8 ">
          <NoteCard
            title="meeting on 20th"
            date="20th january 2024"
            content="I have flight"
            tags="#Meeting"
            isPinned={true}
            onEdit={() => {}}
            onDelete={() => {}}
            onPinNote={() => {}}
          />
        </div>
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add",data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)'
          }
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes />
      </Modal>
    </>
  );
};

export default Home;
