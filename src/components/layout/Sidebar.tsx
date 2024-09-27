import React from "react";
import { FaTachometerAlt, FaUsers, FaShoppingCart, FaSeedling } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from '../../assets/logo.svg';
interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen }) => {
  return (
    <aside
      className={`sidebar bg-white shadow-lg dark:bg-gray-900 text-gray-900 dark:text-gray-100 fixed inset-y-0 left-0 z-50 h-full transition-transform duration-300 transform ${isOpen || !isMobile ? "translate-x-0 w-64" : "-translate-x-full"}`} >
      <div className="flex flex-col items-center py-6">
        <img src={logo} alt="Zao Logo" className="h-20 w-auto mb-4" />
      </div>
      <nav className="mt-6">
        <ul>
          <li className="mb-4">
            <Link to="/dashboard" className="flex items-center text-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FaTachometerAlt className="mr-3" />
              Home
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/users" className="flex items-center text-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FaUsers className="mr-3" />
              Users
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/expenses" className="flex items-center text-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FaShoppingCart className="mr-3" />
              Expenses
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/harvests" className="flex items-center text-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FaSeedling className="mr-3" />
              Harvests
            </Link>
          </li>

          {/* <li className="mb-4">
            <Link to="/reports" className="flex items-center text-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FaFileAlt className="mr-3" />
              Reports
            </Link>
          </li> */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
