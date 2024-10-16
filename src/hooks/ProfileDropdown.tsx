import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
}

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const getStoredUser = (): User | null => {
    const storedUser = localStorage.getItem('clientuser');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    setLoggedUser(getStoredUser());
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  const clearCookies = () => {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  };

  const LogOut = () => {
    clearCookies();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menu = document.querySelector(".menu");
      if (menu && !menu.contains(e.target as Node)) {
        closeMenu();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="menu relative bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <FaUserCircle className="text-gray-500 cursor-pointer" size={32} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
          {/* User Info Section */}
          <div className="flex items-center px-2 py-2 border-b border-gray-200">
            <FaUserCircle className="text-gray-500 flex-shrink-0" size={30} />
            <div className="ml-3 flex-grow">
              <p className="text-gray-800 font-semibold truncate">{loggedUser?.name || "Guest"}</p>
              <p className="text-sm text-gray-500 truncate">{loggedUser?.email || "No email available"}</p>
            </div>
          </div>

          {/* Profile Link */}
          <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
            Profile
          </Link>
          {/* My Bills Link */}
          <Link to="/my-bills" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
            My Bills
          </Link>
          {/* Logout Button */}
          <button
            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            onClick={LogOut}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
