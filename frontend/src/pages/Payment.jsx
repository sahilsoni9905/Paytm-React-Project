import React, { useState } from 'react';
import TopInfo from '../component/TopInfo';
import { FaPaperPlane } from 'react-icons/fa';
import { IoMdDoneAll } from 'react-icons/io';
import { MdCurrencyRupee } from "react-icons/md";
import { MdOutlineCancel } from 'react-icons/md';
import { FaUserCheck } from "react-icons/fa";
import { FaTimes } from 'react-icons/fa';

function Payment() {
  const [payPopup, setPayPopup] = useState(false)
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [passwordPopup, setPasswordPopup] = useState(false);
  const [password, setPassword] = useState("");

  const transactions = [
    {
      id: 1,
      isUser: true,
      amount: 500,
      status: 'Completed',
      date: '2024-09-01',
      time: '10:15 AM',
      purpose: 'Grocery Shopping',
    },
    {
      id: 2,
      isUser: false,
      amount: 1000,
      status: 'Completed',
      date: '2024-09-02',
      time: '12:45 PM',
      purpose: 'Dinner Payment',
    },
    {
      id: 3,
      isUser: true,
      amount: 250,
      status: 'Pending',
      date: '2024-09-03',
      time: '02:30 PM',
      purpose: 'Mobile Recharge',
    },
    {
      id: 4,
      isUser: false,
      amount: 1500,
      status: 'Completed',
      date: '2024-09-04',
      time: '09:00 AM',
      purpose: 'Rent',
    },
    {
      id: 5,
      isUser: true,
      amount: 800,
      status: 'Completed',
      date: '2024-09-05',
      time: '03:45 PM',
      purpose: 'Utility Bills',
    },
    {
      id: 6,
      isUser: false,
      amount: 2000,
      status: 'Completed',
      date: '2024-09-06',
      time: '11:30 AM',
      purpose: 'Loan Repayment',
    },
  ];

  const user = {
    username: 'anmoltripathi',
    firstName: 'Anmol',
    lastName: 'Tripathi',
    image: '',
  };

  const statusIcon = (status) => {
    if (status === 'Completed') {
      return <IoMdDoneAll className="text-green-500" size={20} />;
    } else {
      return <MdOutlineCancel className="text-red-500" size={20} />;
    }
  };
  const handlePay = async () => {
    setPasswordPopup(true);

  }
  const handleContinue = () => {
    console.log("Password entered: ", password);
    setPasswordPopup(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <TopInfo user={user} />
      <div className="flex-grow overflow-auto h-full bg-slate-800 p-4 sm:p-2">
        <div className="max-h-[79vh] overflow-y-auto custom-scrollbar">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`flex ${transaction.isUser ? 'justify-end' : 'justify-start'
                } mb-4 px-3`}
            >
              <div
                className={`p-3 rounded-lg shadow-md w-[45%] lg:w-64 ${transaction.isUser ? 'bg-gray-700' : 'bg-gray-600'
                  }`}
              >
                <p className="font-bold md:text-lg text-xs">
                  {transaction.isUser ? `You Paid ${user.firstName}` : `${user.firstName} Paid You`}
                </p>
                <p className="text-sm text-gray-400">{transaction.purpose}</p>
                <div className="md:text-xl text-base lg:text-2xl flex items-center font-semibold md:mt-2">
                  <MdCurrencyRupee /> <span>{transaction.amount}</span>
                </div>
                <div className="flex flex-col items-start justify-start mt-1 md:mt-4">
                  <div className="flex  gap-1 text-xs md:text-sm text-gray-400">
                    {statusIcon(transaction.status)} {transaction.status} <br />
                    {transaction.date}
                  </div>
                  <div className="self-end text-xs md:text-sm text-gray-400">{transaction.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className=" fixed bottom-0 w-full flex flex-row items-center justify-evenly p-4 sm:p-6 bg-slate-900 shadow-md">
        <button onClick={() => setPayPopup(true)} className="flex items-center gap-2 sm:gap-4 font-bold text-md  lg:text-xl  bg-blue-600 text-white py-2 px-4 sm:py-3 sm:px-6 lg:py-4 lg:px-8 rounded-full hover:bg-blue-700 transition duration-200">
          <span>Send Money</span> <FaPaperPlane />
        </button>
        <button className="flex items-center gap-2 sm:gap-4 font-bold text-md lg:text-xl  bg-green-600 text-white py-2 px-4 sm:py-3 sm:px-6 lg:py-4 lg:px-8 rounded-full hover:bg-green-700 transition duration-200">
          <span>Request Money</span> <FaUserCheck />
        </button>
      </div>
      {payPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-slate-800 flex flex-col items-center justify-center w-96 h-auto p-8 rounded-lg relative shadow-lg space-y-6">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-300"
              onClick={() => setPayPopup(false)}
            >
              <FaTimes size={20} />
            </button>

            <div className="flex justify-center items-center">
              <div className="w-16 h-16 bg-purple-400 rounded-full flex justify-center items-center text-white text-3xl">
                S
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-200">Paying {' '} {user.firstName}</h2>
              <p className="text-sm text-gray-400">@{user.username}</p>
            </div>

            <div className="flex justify-center items-center space-x-2">
              <span className="text-4xl font-semibold text-gray-200">₹</span>
              <input
                type="number"
                className="text-4xl font-semibold text-center text-gray-200 bg-slate-800 border-b-2 border-gray-600 w-28 focus:outline-none"
                placeholder="0"
                value={amount}
                min="0"
                style={{
                  appearance: 'textfield',
                  MozAppearance: 'textfield',
                  WebkitAppearance: 'none',
                }}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="mt-4 w-3/4">
              <input
                type="text"
                placeholder="Add a note"
                className="w-full py-2 px-4 bg-slate-700 text-gray-300 rounded-lg focus:outline-none focus:bg-slate-600"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="w-full flex justify-center mt-6">
              <button
                className="bg-blue-500 w-full text-white font-semibold py-3 rounded-full hover:bg-blue-600"
                onClick={handlePay}
                disabled={amount <= 0}
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
      {passwordPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-slate-800 w-96 p-8 rounded-lg relative shadow-lg space-y-6">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-300"
              onClick={() => setPasswordPopup(false)}
            >
              <FaTimes size={20} />
            </button>

            {/* Password Title */}
            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-200">Enter Password</h2>
              <p className="text-sm text-gray-400">To complete the transaction, enter your password.</p>
            </div>

            {/* Password Input */}
            <div className="flex justify-center mt-6">
              <input
                type="password"
                placeholder="Password"
                className="w-full py-2 px-4 bg-slate-700 text-gray-300 rounded-lg focus:outline-none focus:bg-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Continue Button */}
            <div className="w-full flex justify-center mt-6">
              <button
                className="bg-blue-500 w-full text-white font-semibold py-3 rounded-full hover:bg-blue-600"
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}

export default Payment;
