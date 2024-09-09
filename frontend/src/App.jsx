import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import SignUp from './pages/SignUp.jsx';
import SignIn from './pages/Signin.jsx';
import Pay from './component/User/Pay.jsx';
import Transaction from './component/User/Transaction.jsx';
import Balance from './component/User/Balance.jsx';
import People from './component/User/People.jsx';
import Account from './component/User/Account.jsx';
import User from './pages/User.jsx';
import Dashboard from './component/User/Dashboard.jsx';
import Payment from './pages/Payment.jsx';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/user' element={<User />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='pay' element={<Pay />} />
            <Route path='transactions' element={<Transaction />} />
            <Route path='balance' element={<Balance />} />
            <Route path='recipients' element={<People />} />
            <Route path='account' element={<Account />} />
          </Route>
          <Route path='/payment/:id' element={<Payment/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
