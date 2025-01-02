import React from 'react'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import Signup from './pages/Signup/Signup.jsx'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' 
const routes=(
  <Router>
    <Routes>
      <Route path="/dashboard" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
    </Routes>
  </Router>
);
const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App
