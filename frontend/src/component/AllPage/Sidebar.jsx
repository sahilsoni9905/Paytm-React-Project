import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaMoneyBill, FaUser, FaExchangeAlt, FaUsers ,FaTimes , FaRegListAlt, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiWallet } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate=useNavigate()
    const LogoutHandle=()=>{
        localStorage.removeItem('token');
        navigate('/')
    }
    return (
        <div className="flex">
            <div className="hidden lg:flex flex-col bg-gray-900 text-white w-96 p-6 h-screen">
            <div className="flex items-center justify-start mb-8">
                <span className="text-2xl font-bold">PAYZAR</span>
            </div>
            <div className="flex flex-col flex-1 space-y-8">
                <NavLink 
                    to="/user/dashboard" 
                    className={({ isActive }) => 
                        isActive 
                        ? 'flex items-center text-2xl font-bold bg-gray-800 p-4 rounded-lg text-blue-400'
                        : 'flex items-center text-2xl font-bold p-4 rounded-lg hover:bg-gray-700 hover:text-blue-300'
                    }
                >
                    <FaHome />
                    <span className="ml-6">Dashboard</span>
                </NavLink>
                <NavLink 
                    to="/user/transactions" 
                    className={({ isActive }) => 
                        isActive 
                        ? 'flex items-center text-2xl font-bold bg-gray-800 p-4 rounded-lg text-blue-400'
                        : 'flex items-center text-2xl font-bold p-4 rounded-lg hover:bg-gray-700 hover:text-blue-300'
                    }
                >
                    <FaMoneyBillTransfer />
                    <span className="ml-6">Transactions</span>
                </NavLink>
                <NavLink 
                    to="/user/pay" 
                    className={({ isActive }) => 
                        isActive 
                        ? 'flex items-center text-2xl font-bold bg-gray-800 p-4 rounded-lg text-blue-400'
                        : 'flex items-center text-2xl font-bold p-4 rounded-lg hover:bg-gray-700 hover:text-blue-300'
                    }
                >
                    <FaMoneyBill />
                    <span className="ml-6">Transfer A Sum</span>
                </NavLink>
                <NavLink 
                    to="/user/balance" 
                    className={({ isActive }) => 
                        isActive 
                        ? 'flex items-center text-2xl font-bold bg-gray-800 p-4 rounded-lg text-blue-400'
                        : 'flex items-center text-2xl font-bold p-4 rounded-lg hover:bg-gray-700 hover:text-blue-300'
                    }
                >
                    <GiWallet />
                    <span className="ml-6">Check Balance</span>
                </NavLink>
                
                <NavLink 
                    to="/user/account" 
                    className={({ isActive }) => 
                        isActive 
                        ? 'flex items-center text-2xl font-bold bg-gray-800 p-4 rounded-lg text-blue-400'
                        : 'flex items-center text-2xl font-bold p-4 rounded-lg hover:bg-gray-700 hover:text-blue-300'
                    }
                >
                    <FaUser />
                    <span className="ml-6">Account</span>
                </NavLink>
                <button onClick={LogoutHandle} className="flex items-center mt-auto text-2xl font-bold p-4 rounded-lg hover:bg-gray-700 hover:text-red-400 cursor-pointer">
                    <FaSignOutAlt />
                    <span className="ml-6">Quit</span>
                </button>
            </div>
        </div>

        <div className="lg:hidden flex flex-col bg-gray-900 text-white p-6 relative">
                <button
                    className="text-xl focus:outline-none"
                    onClick={() => setIsOpen(true)}
                >
                    <FaBars />
                </button>

                <div
                    className={`absolute top-0 left-0 w-64 bg-gray-900 p-4 transform transition-transform duration-300 ease-in-out z-50 ${
                        isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-2xl font-bold">Menu</span>
                        <button
                            className="text-2xl focus:outline-none"
                            onClick={() => setIsOpen(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="flex flex-col space-y-6 mt-6">
                        <NavLink onClick={()=>setIsOpen(false)} to="/user/dashboard" className="flex items-center text-xl">
                            <FaHome />
                            <span className="ml-4">Dashboard</span>
                        </NavLink>
                        <NavLink onClick={()=>setIsOpen(false)} to="/user/transactions" className="flex items-center text-xl">
                            <FaMoneyBillTransfer />
                            <span className="ml-4">Transactions</span>
                        </NavLink>
                        <NavLink onClick={()=>setIsOpen(false)} to="/user/pay" className="flex items-center text-xl">
                            <FaMoneyBill />
                            <span className="ml-4">Transfer A Sum</span>
                        </NavLink>
                        <NavLink onClick={()=>setIsOpen(false)} to="/user/balance" className="flex items-center text-xl">
                            <GiWallet />
                            <span className="ml-4">Check Balance</span>
                        </NavLink>
                        <NavLink onClick={()=>setIsOpen(false)} to="/user/account" className="flex items-center text-xl">
                            <FaUser />
                            <span className="ml-4">Account</span>
                        </NavLink>
                        <div className="flex items-center text-xl">
                            <FaSignOutAlt />
                            <span className="ml-4">Quit</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
