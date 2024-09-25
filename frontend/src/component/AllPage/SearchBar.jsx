import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useDebounce } from 'use-debounce';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContxt';
const SearchBar = () => {
    const [show, setShow] = useState(false);
    const [searchedTerm, setSearchedTerm] = useState('');
    const [appearedUser, setAppearedUser] = useState([]);
    const [debouncedSearchedTerm] = useDebounce(searchedTerm, 200);
    const navigate = useNavigate()
    const { user } = useUser()

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

    const handleInputChange = (e) => {
        setSearchedTerm(e.target.value);
    };
    const LogoutHandle = () => {
        localStorage.removeItem('token');
        navigate('/')
    }

    return (
        <div className=" flex w-full justify-evenly items-center gap-4 px-4 py-2 bg-white shadow-md rounded-lg">
            <div className="relative w-full">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Type to search..."
                    className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 "
                    onChange={handleInputChange}
                />

                {appearedUser.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-gray-900 text-white shadow-lg rounded-lg mt-2 z-10 max-w-md sm:max-w-lg md:max-w-xl">
                        {appearedUser.map((user, index) => (
                            <div key={index}>
                                <Link className='text-current no-underline' to={`/payment/${user._id}`}>
                                    <div
                                        className="flex justify-between items-center px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-200 ease-in-out"
                                    >
                                        <div className="text-sm md:text-base">
                                            <span className="font-semibold text-gray-400 ">{user.firstName} {user.lastName}</span>
                                            <span className="block text-xs text-gray-400 md:text-sm">@{user.username}</span>
                                        </div>
                                    </div>
                                </Link>

                                {index !== appearedUser.length - 1 && (
                                    <hr className="bg-gray-700 h-0.5 mx-4 my-0.5 w-3/4 rounded-xl" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className='flex items-center justify-center p-2'>
                <button onClick={() => setShow(!show)}>
                    {user.profilePic === '' ? (<FaUserCircle size={34} className="text-gray-800" />) : (<img
                        src={user.profilePic}
                        alt={user.firstName}
                        className="w-8 h-8 rounded-full object-cover"
                    />)}

                </button>
            </div>

            {show && (
                <div className="absolute top-12 right-5 mt-2 w-38 bg-gray-900 shadow-lg rounded-lg p-4">
                    <button onClick={LogoutHandle} className="w-full shadow-md flex items-center justify-start gap-4 font-bold px-4 py-2 hover:bg-gray-700 text-white rounded-b-lg">
                        Logout
                        <MdLogout />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
