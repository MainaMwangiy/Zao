import React from "react";

interface UserRowProps {
  name: string;
  email: string;
  location: string;
  status: string;
  role: string | number;
}

const UserRow: React.FC<UserRowProps> = ({ name, email, location, status, role }) => {
  return (
    <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <td className="px-4 py-4">
        <div className="flex items-center">
          <input type="checkbox" className="mr-3" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <p>{location}</p>
      </td>
      <td className="px-4 py-4">
        <span
          className={`px-2 py-1 rounded-full text-xs ${status.toLowerCase() === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
        >
          {status}
        </span>
      </td>
      <td className="px-4 py-4">
        <p>{role}</p>
      </td>
      <td className="px-4 py-4 flex space-x-2">
        <button className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
        <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
      </td>
    </tr>
  );
};

export default UserRow;
