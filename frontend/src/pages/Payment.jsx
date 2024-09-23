import React, { useEffect, useState, useRef } from 'react';
import TopInfo from '../component/TopInfo';
import { FaPaperPlane } from 'react-icons/fa';
import { IoMdDoneAll } from 'react-icons/io';
import { MdCurrencyRupee } from "react-icons/md";
import { MdOutlineCancel } from 'react-icons/md';
import { FaUserCheck } from "react-icons/fa";
import { FaTimes } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';  // import toast
import 'react-toastify/dist/ReactToastify.css'; // import toast CSS
import 'react-toastify/dist/ReactToastify.css'; // import toast CSS
import { Loader } from 'rsuite'; // Importing React Suite Loader
import 'rsuite/dist/rsuite.min.css';
function Payment() {
  const {id} = useParams()
  const [payPopup, setPayPopup] = useState(false)
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [passwordPopup, setPasswordPopup] = useState(false);
  const [password, setPassword] = useState("");
  const [transactions,setTransactions]=useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status,setStatus]= useState(true)
  const historyEndRef = useRef(null);
  const [paying, setPaying] = useState(false);
  const [receiver,setReceiver] = useState('')
  const fetchReceiver = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/v1/account/getReceiver',
        { to: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data)
      setReceiver(response.data);
    } catch (err) {
      console.error("Error fetching receiver:", err);
      setError("Failed to fetch receiver.");
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true); 
      setError(null);  
      const token = localStorage.getItem('token'); 
  
      const response = await axios.post(
        'http://localhost:3000/api/v1/account/person-transaction-history',
        { personId: id },  
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.message === 'No transactions found with this person') {
        setTransactions([]); 
        setError('No transactions found with this person.');
      } else {
        setTransactions(response.data); 
      }
  
    } catch (err) {
      console.error('Error fetching transaction history:', err);
      setError('Failed to fetch transaction history.');
    } finally {
      setLoading(false); 
    }
  };
  

  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transactions]);

  useEffect(() => {
    if (id) {
      fetchReceiver()
      fetchTransactionHistory();
    }
  }, [id]);
  

  const letter = (firstName) => {
    return firstName[0].toUpperCase();
  };
  

  const statusIcon = () => {
    if (status===true) {
      return <IoMdDoneAll className="text-green-500" size={20} />;
    } else {
      return <MdOutlineCancel className="text-red-500" size={20} />;
    }
  };

  const handlePay = () => {
    setPasswordPopup(true);
  };

  const handleContinue = async () => {
    setPasswordPopup(false)
    setPaying(true);
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        return setError("Authentication token not found");
      }

      const transferData = {
        amount: Number(amount),
        to: id,
        password,
        msgAttached: message, 
      };

      const response = await axios.post(
        'http://localhost:3000/api/v1/account/transfer',
        transferData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setPayPopup(false);
        setPasswordPopup(false);
        toast.success('Transfer successful!'); 
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      setPayPopup(false);
      setPasswordPopup(false);
      if (err.response) {
        if (err.response.status === 401) {
          toast.error("Wrong password");
        } else if (err.response.status === 400) {
          toast.error(err.response.data.message || "Transfer failed");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <TopInfo user={receiver} />
      <div className="flex-grow overflow-auto h-full bg-slate-800 p-4 sm:p-2">
        <div className="max-h-[79vh] overflow-y-auto custom-scrollbar">
          {transactions.map((transaction,index) => (
            <div
            key={index}
              className={`flex ${transaction.type ? 'justify-end' : 'justify-start'
                } mb-4 px-3`}
            >
              <div
                className={`p-3 rounded-lg shadow-md w-[45%] lg:w-64 ${transaction.isUser ? 'bg-gray-700' : 'bg-gray-600'
                  }`}
              >
                <p className="font-bold md:text-lg text-xs">
                  {transaction.isUser ? `You Paid ${receiver.firstName}` : `${receiver.firstName} Paid You`}
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
          <div ref={historyEndRef}></div>
        </div>
      </div>
      <div className="fixed bottom-0 w-full flex flex-row items-center justify-evenly p-4 sm:p-6 bg-slate-900 shadow-md">
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
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-300"
              onClick={() => setPayPopup(false)}
            >
              <FaTimes size={20} />
            </button>

            <div className="flex justify-center items-center">
            {receiver.profilePic ? (
                <img
                  src={receiver.profilePic}
                  alt={receiver.firstName}
                  className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-purple-400 rounded-full flex justify-center items-center text-white text-3xl">
                {letter(receiver.firstName)}
              </div>
              )}
                
            
              
            </div>

            <div className="text-center">
              <h2 className="text-lg font-bold text-gray-200">Paying {' '} {receiver.firstName}</h2>
              <p className="text-sm text-gray-400">@{receiver.username}</p>
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
                className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition duration-200"
                onClick={handlePay}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
       {paying && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <Loader size="lg" content="Processing payment..." vertical />
        </div>
      )}
      {passwordPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-slate-800 w-96 h-auto p-8 rounded-lg relative shadow-lg space-y-6">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-300"
              onClick={() => setPasswordPopup(false)}
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-lg font-bold text-gray-200">Enter Your Password</h2>

            <div className="w-full">
              <input
                type="password"
                className="w-full py-2 px-4 bg-slate-700 text-gray-300 rounded-lg focus:outline-none focus:bg-slate-600"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="w-full flex justify-center mt-6">
              <button
                className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition duration-200"
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
}

export default Payment;
