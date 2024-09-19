import React from "react";
import { FaTachometerAlt, FaUsers, FaShoppingCart, FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isOpen }) => {
  return (
    <aside
      className={`sidebar bg-white shadow-lg dark:bg-gray-900 text-gray-900 dark:text-gray-100 fixed inset-y-0 left-0 z-50 h-full transition-transform duration-300 transform ${
        isOpen || !isMobile ? "translate-x-0 w-64" : "-translate-x-full"
      }`}
    >
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold">Zao</h2>
      </div>
      <nav className="mt-6">
        <ul>
          <li className="mb-4">
            <Link to="/" className="flex items-center text-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FaTachometerAlt className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/users" className="flex items-center text-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FaUsers className="mr-3" />
              Users
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/ecommerce" className="flex items-center text-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FaShoppingCart className="mr-3" />
              E-commerce
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/reports" className="flex items-center text-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FaFileAlt className="mr-3" />
              Reports
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
