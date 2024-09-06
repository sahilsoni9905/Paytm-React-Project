import React from 'react';
import Sidebar from '../component/AllPage/Sidebar';
import SearchBar from '../component/AllPage/SearchBar';
import { Outlet } from 'react-router-dom';

function User() {
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="lg:flex items-start justify-start hidden ">
        <Sidebar />
      </div>
      <div className="w-full flex flex-col">
        <div className="flex items-center justify-between  shadow-md bg-white">
          <div className="lg:hidden">
            <Sidebar />
          </div>
          <SearchBar />
        </div>
        <Outlet/>
      </div>
    </div>
  );
}

export default User;
