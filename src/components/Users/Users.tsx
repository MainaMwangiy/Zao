import React, { useState } from "react";
import UserRow from "./UserRow"; // Import the reusable UserRow component
import AddUserModal from "../common/Modal";

// Define the type for each user
interface UsersProps {
  name: string;
  email: string;
  farmerOrBuyer: string;
  location: string;
  status: "Active" | "Inactive"; // Enforce strict typing for status
  role: "Superadmin" | "Admin" | "User";
}

const Users: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const usersData: UsersProps[] = [
    { name: "Neil Sims", email: "neil.sims@domain.com", farmerOrBuyer: "Farmer", location: "Kenya", status: "Active", role: "Superadmin" },
    { name: "Roberta Casas", email: "roberta.casas@domain.com", farmerOrBuyer: "Buyer", location: "Spain", status: "Active", role: "Admin" },
    { name: "Michael Gough", email: "michael.gough@domain.com", farmerOrBuyer: "Farmer", location: "United Kingdom", status: "Inactive", role: "User" },
    { name: "Bonnie Green", email: "bonnie.green@domain.com", farmerOrBuyer: "Farmer", location: "United States", status: "Active", role: "User" },
    { name: "Jese Leos", email: "jese.leos@domain.com", farmerOrBuyer: "Buyer", location: "Kenya", status: "Inactive", role: "Admin" },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-semibold">All Users</h1>
      <div className="flex items-center space-x-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowModal(true)} >Add User</button>
        <button className="bg-gray-200 text-black px-4 py-2 rounded">Export</button>
      </div>
    </div>
  
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Search for users"
        className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
      />
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-collapse">
        <thead>
          <tr className="border-b dark:border-gray-700">
            <th className="px-4 py-2 text-left text-sm font-semibold">NAME</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">FARMER/BUYER</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">LOCATION</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">STATUS</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">ROLE</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {usersData.map((user, index) => (
            <UserRow
              key={index}
              name={user.name}
              email={user.email}
              farmerOrBuyer={user.farmerOrBuyer}
              location={user.location}
              status={user.status}
              role={user.role}
            />
          ))}
        </tbody>
      </table> 
      {showModal && (
        <AddUserModal
          showModal={showModal}
          setShowModal={setShowModal} 
        />
      )}
    </div>
  </div>
  
  );
};

export default Users;
