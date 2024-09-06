import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import IMG from "../assets/side_1.jpg";

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/user/signup',
        { firstName, lastName, username, password },
        { withCredentials: true }
      );
      localStorage.setItem('token', response.data.token);
      setSuccess('Sign Up successful! Redirecting to dashboard...');
      setError('');

      setTimeout(() => {
        navigate('/user/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-gray-100">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <div className="w-full max-w-4xl mx-auto bg-slate-800 text-white p-4 rounded-lg shadow-lg shadow-black flex  md:flex-row items-center gap-4 ">

          <div
            className=" hidden lg:w-1/2 lg:flex lg:items-center lg:justify-center lg:rounded-lg lg:shadow-md"
            style={{
              backgroundImage: `url(${IMG})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              height: '500px', 
            }}
          />

          <div className="w-full lg:w-1/2 p-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">Sign Up</h2>

            {error && (
              <div className="bg-red-500 text-white w-full p-2 rounded-md text-center mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500 text-white w-full p-2 rounded-md text-center mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full">
              <div className="form-group mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Enter Your First Name"
                  className="mt-1 block w-full bg-slate-700 border border-slate-600 text-white rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 sm:text-sm h-12 px-4"
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
                  className="mt-1 block w-full bg-slate-700 border border-slate-600 text-white rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 sm:text-sm h-12 px-4"
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
                  className="mt-1 block w-full bg-slate-700 border border-slate-600 text-white rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 sm:text-sm h-12 px-4"
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
                  className="mt-1 block w-full bg-slate-700 border border-slate-600 text-white rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 sm:text-sm h-12 px-4"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full mt-4 bg-slate-700 text-white text-lg font-bold border-2 border-white py-2 px-4 transition-all duration-300 ease-in rounded-md shadow-sm hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-opacity-50 h-12"
              >
                Sign Up
              </button>
            </form>
            <h2 className='text-gray-400 text-center mt-4'>Already have an Account? <Link to={'/signin'}> <span className='font-bold hover:text-white transition-all duration-300 ease-in'>SignIn</span></Link></h2>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
