import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon } from '@heroicons/react/outline';

const SidebarLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const links = [
    { path: "/", label: "จัดการข้อมูลพนักงาน" },
    { path: "/leave", label: "คำขอลา/หยุด" },
    { path: "/calendar", label: "ปฏิทินบริษัท" },
    { path: "/report", label: "รายงาน" },
    { path: "/contract", label: "สัญญาจ้าง" },
    { path: "/tax", label: "ภาษี" },
    { path: "/dashboard", label: "จัดการบัญชีผู้ใช้" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg h-screen fixed top-0 left-0 z-50 transition-transform duration-300
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-64`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">HR</span>
            </div>
            <span className="text-xl font-bold text-blue-500">HR Management</span>
          </div>
          <button className="lg:hidden p-2" onClick={toggleMenu}>
            <XIcon className="h-6 w-6 text-gray-600"/>
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          {links.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `px-4 py-2 rounded-lg font-medium hover:bg-blue-100 ${
                isActive ? 'bg-blue-200 text-blue-600' : 'text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ml-0 lg:ml-64 transition-all duration-300 relative`}>
        {/* Header logout */}
        <div className="fixed top-0 right-0 w-full lg:ml-64 bg-white shadow z-40 flex justify-end p-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-300 text-white font-semibold rounded-lg hover:bg-red-400"
          >
            ออกจากระบบ
          </button>
        </div>

        {/* Page content */}
        <div className="p-6 pt-20">
          <Outlet />
        </div>

        {/* Mobile toggle button */}
        <button
          className="lg:hidden fixed top-4 left-4 p-2 bg-gray-100 rounded-lg z-50"
          onClick={toggleMenu}
        >
          <MenuIcon className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default SidebarLayout;
