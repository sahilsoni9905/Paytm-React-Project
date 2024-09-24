import React, { useEffect, useState } from 'react';
import { FaRegUserCircle } from "react-icons/fa";
import { CgSearch } from "react-icons/cg";
import { Link } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import axios from 'axios';

// const people = [
//   { id: 1, name: 'John Doe', email: 'john@example.com', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
//   { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
//   { id: 3, name: 'David Johnson', email: 'david@example.com', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
//   { id: 4, name: 'Emily Brown', email: 'emily@example.com', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
//   { id: 5, name: 'Chris Green', email: 'chris@example.com' },
//   { id: 6, name: 'Anna White', email: 'anna@example.com' },
//   { id: 7, name: 'Mark Blue', email: 'mark@example.com' },
//   { id: 8, name: 'Sarah Yellow', email: 'sarah@example.com' },
//   { id: 9, name: 'Tom Black', email: 'tom@example.com' }
// ];

function Pay() {
  const [searchTerm, setSearchTerm] = useState('');
  const [appearedUser, setAppearedUser] = useState([]);
  const [debouncedSearchedTerm] = useDebounce(searchTerm, 200);
  useEffect(() => {
    const getUser = async () => {
      if (debouncedSearchedTerm) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.post(
            'http://localhost:3000/api/v1/user/bulk',
            { filter: debouncedSearchedTerm },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data.user);
          setAppearedUser(response.data.user);
        } catch (error) {
          console.log("Error searching", error);
        }
      } else {
        setAppearedUser([]);
      }
    };
    getUser();
  }, [debouncedSearchedTerm]);


  return (
    <div className="p-4 lg:p-8 bg-slate-950 flex flex-col gap-4 lg:gap-8 text-white lg:h-[93.1vh]">
      <h1 className='font-bold text-2xl lg:text-6xl mb-4'>Make a payment</h1>
      <h2 className="text-lg lg:text-2xl mb-6 text-slate-300">Find the person to pay or select a recipient</h2>

      <div className="mb-6">
        <div className='flex items-center w-full lg:w-2/6 relative'>
          <input
            type="text"
            placeholder="Type to search..."
            className="w-full pl-10 pr-2 py-2 rounded-full border-2 border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <CgSearch size={20} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2 lg:p-4 border-2 border-slate-800 bg-slate-900 rounded-lg overflow-y-auto h-[32rem] custom-scrollbar">
        {appearedUser.length > 0 ? (
          appearedUser.map(person => (
            <div key={person._id} className="p-4 border rounded-lg transition-all duration-300 ease-in shadow-md bg-slate-800 hover:bg-slate-700 flex justify-center flex-col items-center space-y-4">
              {person.profilePic ? (
                <img
                  src={person.profilePic}
                  alt='IMG'
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <FaRegUserCircle className="w-16 h-16 text-slate-400" />
              )}

              <div className='flex flex-col items-center justify-center gap-2'>
                <h3 className="text-lg font-semibold">{person.firstName} {' '} {person.lastName}</h3>
                <p className="text-slate-400">{person.username}</p>
                <Link to={`/payment/${person._id}`}>
                  <button className="mt-2 px-8 py-2 lg:text-lg font-bold bg-blue-500 text-white transition-all duration-300 ease-in rounded-lg hover:bg-blue-600">
                    Pay
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-500 font-bold text-xl col-span-full">No recipients found</p>
        )}
      </div>
    </div>
  );
}

export default Pay;
