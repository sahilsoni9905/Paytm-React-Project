import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import IMG from "../assets/side_2.jpg"; 

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/user/signin',
        { username, password },
        { withCredentials: true }
      );
      
      localStorage.setItem('token', response.data.token);
      console.log('Login successful:', response.data);

      setToastMessage({ type: 'success', text: 'Login successful!' });
      setTimeout(() => navigate('/user/dashboard'), 2000);
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setToastMessage({
        type: 'error',
        text: err.response?.data?.message || 'An error occurred while trying to log in.',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-gray-100 px-4 relative">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <div className="w-full max-w-4xl mx-auto bg-slate-800 text-white p-4 rounded-lg shadow-lg shadow-black flex flex-col md:flex-row items-center gap-8">
          
          <div
            className="hidden lg:w-1/2 lg:flex lg:items-center lg:justify-center lg:rounded-lg lg:shadow-md"
            style={{
              backgroundImage: `url(${IMG})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              height: '300px', 
            }}
          />

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">Sign In</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter Your Username"
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm px-4 py-2"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter Your Password"
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm px-4 py-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gray-800 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-gray-700 transition duration-200"
              >
                Sign In
              </button>
            </form>
            <p className="text-center text-gray-400 mt-4">
              Don't have an account? <Link to="/signup" className="text-white font-bold hover:underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-4 left-4 p-4 rounded-md text-white shadow-lg ${
            toastMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toastMessage.text}
        </div>
      )}
    </div>
  );
};

export default SignIn;
