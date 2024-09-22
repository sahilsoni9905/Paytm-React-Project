import React, { useState,useEffect,useRef } from 'react';
import { FaRegUserCircle, FaCamera } from "react-icons/fa";
import axios from 'axios';
import { gsap } from "gsap";
import { AiOutlineClose } from 'react-icons/ai';
import { Loader } from 'rsuite'; 

function Account() {
  const [image, setImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false)
  const [email, , setEmail] = useState('')
  const [number, setNumber] = useState('')
  const dialogRef = useRef(null);
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showUpdate,setShowUpdate] = useState(false)
  const [updateFormData,setUpdateFormData]=useState(
    {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
    }
  )

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
  });
  useEffect(()=>{
    const handleDetail= async ()=>{
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:3000/api/v1/user/get-user-details',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        console.log(response)
        setUser({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          username: response.data.username || '',
          email: '',
          phone: '',
        });
        setImage(response.data.profilePic||'')
      } catch (error) {
        console.log("Error featichin the details",error)
      }
    }

    handleDetail()
  },[])
  useEffect(() => {
    if (showPopup) {
      gsap.fromTo(
        dialogRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [showPopup]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0]; 
    console.log(file);
    
    if (file) {
      const formData = new FormData();
      formData.append('file', file); 
      setLoading(true);
      console.log(formData);
  
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:3000/api/v1/user/updateProfilePic',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
          }
        );
  
        console.log(response.data);
        setImage(response.data.url); 
  
      } catch (error) {
        console.log('Failed to upload image', error);
      } finally {
        setLoading(false); // Ensure loading state is reset after the request
      }
    } else {
      console.log("File is required");
    }
  };
  

  const handleContactInfo = () => {
    setShowPopup(true)
  };
  const submitHandle= async()=>{
    setShowPopup(false)
    setIsLoading(true)
    try {
      response= await axios.post(
        "",
        {
          email,
          number
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    } catch (error) {
      setIsLoading(false)
      console.log("Error saving the contact info",error)
    }
  }

  return (
    <div className="p-6 lg:p-12 bg-slate-950 text-white flex flex-col lg:h-[93.1vh] gap-8 lg:gap-4">
      <h1 className="font-bold text-2xl lg:text-5xl mb-4 text-center">Your Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full lg:w-3/4 mx-auto">
        <div className="flex flex-col items-center gap-6 bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-lg w-full glass-effect">
          <div className="relative">
          {loading ? (
              <Loader size="lg" content="Uploading..." /> 
            ) : (
              image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="w-48 h-48 rounded-full object-cover"
                />
              ) : (
                <FaRegUserCircle className="w-48 h-48 text-slate-400" />
              )
            )}
            <div className="absolute bottom-2 right-2 flex items-center justify-center bg-blue-600 p-2 rounded-full">
              <FaCamera className="text-white w-6 h-6 cursor-pointer" />
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
                title="Change Profile Picture"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 w-full">
            <button onClick={()=>setShowUpdate(true)} className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600">
              Update Profile
            </button>
            <button className="w-full px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600">
              Delete Account
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-lg flex flex-col gap-6 w-full glass-effect">
          <div className="flex flex-col gap-4">
            <label className="text-lg font-semibold">First Name</label>
            <input
              type="text"
              value={user.firstName}
              readOnly
              className="p-2 bg-slate-800 text-slate-300 rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-lg font-semibold">Last Name</label>
            <input
              type="text"
              value={user.lastName}
              readOnly
              className="p-2 bg-slate-800 text-slate-300 rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-lg font-semibold">Username</label>
            <input
              type="text"
              value={user.username}
              readOnly
              className="p-2 bg-slate-800 text-slate-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full lg:w-3/4 mx-auto mt-8">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-lg glass-effect">
          <h2 className="text-xl font-bold mb-4">Contact Information</h2>

          {user.email || user.phone ? (
            <div className="flex flex-col gap-4">
              {user.email ? (
                <div className="flex flex-col gap-4">
                  <label className="text-lg font-semibold">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="p-2 bg-slate-800 text-slate-300 rounded-lg"
                  />
                </div>
              ) : null}

              {user.phone ? (
                <div className="flex flex-col gap-4 mt-4">
                  <label className="text-lg font-semibold">Phone</label>
                  <input
                    type="tel"
                    value={user.phone}
                    readOnly
                    className="p-2 bg-slate-800 text-slate-300 rounded-lg"
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg font-semibold mb-4">Contact information is missing</p>
              <button
                onClick={handleContactInfo}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
              >
                {isLoading ? <Loader content="Loading..." /> : "Add Contact Info"}
              </button>
            </div>
          )}
        </div>


        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-lg glass-effect">
          <h2 className="text-xl font-bold mb-4">Security Settings</h2>
          <button className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600">
            Change Password
          </button>
          <button className="w-full px-4 py-2 mt-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600">
            Enable Two-Factor Authentication (2FA)
          </button>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-500">
          <div ref={dialogRef} className="relative flex flex-col items-center gap-6 bg-white p-8 rounded-lg shadow-lg max-w-md w-full border-2 border-black">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowPopup(false)}
            >
              <AiOutlineClose size={24} />
            </button>

            <h2 className="text-2xl font-semibold text-slate-950 mb-4">
              Enter Your Email
            </h2>

            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-slate-950"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <h2 className="text-2xl font-semibold text-slate-950 mb-4">
              Enter Your Phone Number
            </h2>

            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-slate-950"
              placeholder="Enter Phone Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />


            <button
              className="font-semibold text-xl text-slate-200 bg-slate-950 hover:bg-slate-800 hover:text-white py-2 px-6 rounded-md transition-all duration-300 ease-in shadow-lg"
              onClick={submitHandle}

            >
              SAVE
            </button>
          </div>
        </div>
      )}

{showUpdate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Update Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-medium mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-500"
                  placeholder="Enter First Name"
                  
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-500"
                  placeholder="Enter Last Name"
                  
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-500"
                  placeholder="Enter Username"
                  
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-500"
                  placeholder="Enter Email"
                  
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-slate-500"
                  placeholder="Enter Phone Number"
                  
                />
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={()=>setShowUpdate(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Account;
