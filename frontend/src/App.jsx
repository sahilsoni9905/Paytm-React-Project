import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import SignUp from './pages/Signup.jsx';
import SignIn from './pages/Signin.jsx';
import DashBoard from './pages/DashBoard.jsx';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/dashboard' element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
