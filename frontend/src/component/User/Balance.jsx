import React, { useState, useEffect, useRef } from 'react';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { AiOutlineClose } from 'react-icons/ai';
import { gsap } from "gsap";
import axios from 'axios';
import { Loader } from 'rsuite'; 
import 'rsuite/dist/rsuite.min.css'; 

function Balance() {
  const [openBox, setOpenBox] = useState(false);
  const dialogRef = useRef(null);
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (openBox) {
      gsap.fromTo(
        dialogRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [openBox]);

  const checkHandle = async () => {
    setLoading(true);
    setOpenBox(false);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/v1/account/balance',
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBalance(response.data.balance);
      setShowBalance(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error fetching Balance", error);
    }
  };

  return (
    <div className='flex gap-12 bg-[#F5F5F5] lg:h-[93.1vh] flex-col items-start justify-start p-8'>
      <div className='flex flex-col items-start gap-8 justify-start'>
        <h1 className='font-bold text-2xl lg:text-6xl text-slate-950'>
          Check Balance
        </h1>
        <div className={`flex items-center font-bold text-green-800 justify-center text-4xl lg:text-6xl ${showBalance ? '' : 'hidden'} gap-1`}>
          <FaIndianRupeeSign />
          {balance}
        </div>
      </div>

      <div className="flex items-start justify-start">
        <button
          onClick={() => setOpenBox(true)}
          disabled={loading}
          className='font-semibold text-xl text-slate-950 hover:text-gray-400 hover:shadow-sm hover:shadow-gray-500 border border-slate-950 py-2 px-4 rounded-md transition-all duration-300 ease-in'
        >
         {loading ? <Loader content="Loading..." /> : "CHECK"}
        </button>
      </div>

      {openBox && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-500">
          <div ref={dialogRef} className="relative flex flex-col items-center gap-6 bg-white p-8 rounded-lg shadow-lg max-w-md w-full border-2 border-black">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setOpenBox(false)}
            >
              <AiOutlineClose size={24} />
            </button>

            <h2 className="text-2xl font-semibold text-slate-950 mb-4">
              Enter Your Password
            </h2>

            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-slate-950"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="font-semibold text-xl text-slate-200 bg-slate-950 hover:bg-slate-800 hover:text-white py-2 px-6 rounded-md transition-all duration-300 ease-in shadow-lg"
              onClick={checkHandle}
              
            >
               CHECK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Balance;
