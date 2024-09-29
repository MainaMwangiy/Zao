import React, { useEffect, useState } from "react";
import UserRow from "./UserRow";
import AddUserModal from "../common/Modal";
import utils from "../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import Loader from "../common/Loader";

interface UsersProps {
  name: string;
  email: string;
  location: string;
  status: string;
  role: string | number;
}

const Users: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState<UsersProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const url = `${utils.baseUrl}/api/auth/list`;
      const response = await axios.post(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      const user = response.data.data;
      const updatedUsers = utils.updateData(user);
      setUsers(updatedUsers);
      localStorage.setItem('user', JSON.stringify(updatedUsers));
    } catch (error) {
      enqueueSnackbar("User Loading Failed. Please try again.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, [showModal]);

  return (
    <div className="container mx-auto px-2 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between w-full mb-4 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-semibold w-full md:w-auto text-center md:text-left">All Users</h1>
        <div className="flex flex-col md:flex-row items-center w-full md:w-auto md:space-x-4 space-y-4 md:space-y-0">
          <button
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-lg w-full md:w-auto shadow-md"
            onClick={() => setShowModal(true)}
          >
            Add User
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 transition text-black px-6 py-2 rounded-lg w-full md:w-auto shadow-md"
          >
            Export
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search for users"
          className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="px-4 py-2 text-left text-sm font-semibold">NAME</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">LOCATION</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">STATUS</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">ROLE</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <UserRow
                  key={index}
                  name={user.name}
                  email={user.email}
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
      )}
    </div>
  );
};

export default Users;
