import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        '',
        { firstName, lastName, username, password },
        { withCredentials: true }
      );
      localStorage.setItem('token', response.data.token);
      console.log(response.data);
      navigate('/dashboard');
    } catch (err) {
      toast({
        title: "An error occurred.",
        description: err.response?.data?.message || 'An error occurred',
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-gray-900">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <div className="w-full max-w-md mx-auto bg-slate-800 text-white p-8 rounded-lg shadow-lg shadow-black flex flex-col items-center gap-3 justify-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Sign Up</h2>
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="form-group mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="Enter Your First Name"
                className="mt-1 block w-full bg-gray border border-gray-300 text-gray-700 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-12 px-4"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Enter Your Last Name"
                className="mt-1 block w-full bg-gray border border-gray-300 text-gray-700 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-12 px-4"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="username" className="block text-sm font-medium">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter Your Username"
                className="mt-1 block w-full bg-gray border border-gray-300 text-gray-700 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-12 px-4"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter Your Password"
                className="mt-1 block w-full bg-gray border border-gray-300 text-gray-700 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-12 px-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-4 bg-gray-800 text-white text-lg font-bold border-2 border-white py-2 px-4 transition-all duration-300 ease-in rounded-md shadow-sm hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-50 h-12"
            >
              Sign Up
            </Button>
          </form>
          <h2 className='text-gray-400'>Already have an Account? <Link to={'/signin'}> <span className='font-bold hover:text-white transition-all duration-300 ease-in'>SignIn</span></Link></h2>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
