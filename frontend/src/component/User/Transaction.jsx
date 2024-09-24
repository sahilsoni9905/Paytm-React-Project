import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader } from 'rsuite'; // Importing React Suite Loader
import 'rsuite/dist/rsuite.min.css';
import { FaIndianRupeeSign, FaPlus, FaMinus} from "react-icons/fa6";
import { FaRegUserCircle } from 'react-icons/fa';

function Transaction() {
  const [transaction, setTransaction] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      const response = await axios.get(
        'http://localhost:3000/api/v1/account/transaction-history',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.transactions)

      if (response.data.length === 0) {
        setTransaction([]);
        setError('No transactions found with this person.');
      } else {
        setTransaction(response.data.transactions);
      }
    } catch (err) {
      console.error('Error fetching transaction history:', err);
      setError('Failed to fetch transaction history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className='min-h-[93.3vh] bg-black flex flex-col justify-start gap-24'>
      <div className='bg-slate-900 flex flex-col gap-4 p-4'>
        <h1 className='font-bold text-2xl lg:text-6xl text-slate-400'>See Your Transaction</h1>
        <h3 className='font-bold text-xl lg:text-2xl underline underline-offset-3 text-slate-400'>
          A record of trust, built one transaction at a time.
        </h3>
      </div>

      <div className='bg-slate-800 h-[60vh] flex flex-col-reverse overflow-y-auto mx-2 custom-scrollbar p-6 lg:mx-8 border-2 border-gray-700 rounded-lg '>
        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <Loader size="lg" content="Processing Transactions..." vertical />
          </div>
        ) : error ? (
          <p className='text-center text-red-500'>{error}</p>
        ) : transaction.length === 0 ? (
          <p className='text-center text-white'>No transactions found.</p>
        ) : (
          transaction.map((trans, index) => (
            <div key={index} className='bg-slate-700 rounded-xl p-4 mb-4 flex justify-between items-center'>
              <div className='flex items-center gap-4'>
                {trans.profilePic ? (
                  <img
                    src={trans.profilePic}
                    alt={trans.firstName}
                    className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover"
                  />
                ) : (
                  <FaRegUserCircle className="w-10 h-10 md:w-16 md:h-16 text-slate-400" />
                )}
                <div>
                  <h4 className='text-white font-bold'>Message: {' '}{trans.message || 'No message attached'}</h4>
                  <p className='text-gray-400 text-sm'>{new Date(trans.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className='text-right text-xl font-bold'>
                {trans.type?(<div className="flex items-center text-red-400">
                                <FaMinus size={20} className="mr-2" />
                                <FaIndianRupeeSign className="mr-1" />
                                {trans.amount}
                            </div>):(<div className="flex items-center text-green-400">
                                <FaPlus size={20} className="mr-2" />
                                <FaIndianRupeeSign className="mr-1" />
                                {trans.amount}
                            </div>)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Transaction;
