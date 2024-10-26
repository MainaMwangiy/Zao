import React, { useEffect, useState } from "react";
import UserRow from "./UserRow";
import AddUserModal from "../../hooks/Modal";
import utils from "../../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import Loader from "../../hooks/Loader";
import { AiOutlineDownload, AiOutlinePlus } from "react-icons/ai";
import { UsersProps } from "../../types";
import ConfirmationDialog from "../../hooks/ConfirmationDialog";

const Users: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState<UsersProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const clientorganizationid = localStorage.getItem('clientorganizationid') || "";
  const clientusers = localStorage.getItem('clientuser') || '';
  const roles = JSON.parse(clientusers);
  const [clientUsers, setClientUsers] = useState<UsersProps[]>([]);
  const [selectedClientUser, setSelectedClientUser] = useState<UsersProps | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const values = {
        clientorganizationid: clientorganizationid,
        roleid: roles?.roleid
      }
      setIsLoading(true);
      const url = `${utils.baseUrl}/api/auth/list`;
      const response = await axios.post(url, { values }, {
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

  const handleEditClientUser = (clientUser: UsersProps) => {
    setSelectedClientUser(clientUser);
    setShowModal(true);
  };

  const handleDeleteClientUser = (userId: string | number | undefined) => {
    if (userId === undefined) {
      console.error("Attempted to delete a user without a valid user ID.");
      return;
    }
    setDeleteUserId(userId.toString());
    setShowDeleteDialog(true);
  };


  const confirmDeleteClientUser = async () => {
    if (deleteUserId) {
      const clientorganizationid = localStorage.getItem('clientorganizationid');
      try {
        const url = `${utils.baseUrl}/api/auth/delete/${deleteUserId}`;
        await axios.post(url, {
          clientuserid: deleteUserId,
          clientorganizationid: clientorganizationid
        }, {
          headers: { 'Content-Type': 'application/json' },
        });
        enqueueSnackbar("User deleted successfully.", { variant: "success" });
        setClientUsers(clientUsers.filter(user => user.clientuserid !== deleteUserId));
      } catch (error) {
        enqueueSnackbar("Failed to delete user. Please try again.", { variant: "error" });
      } finally {
        setShowDeleteDialog(false);
        setDeleteUserId(null);
      }
    }
  };


  return (
    <div className="container mx-auto px-2 py-6">
      <div className="flex flex-row items-center w-full space-x-2 mb-4">
        <h1 className="text-2xl font-semibold w-full md:w-auto text-center md:text-left">All Users</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-2 rounded-lg shadow-md flex items-center"
          onClick={() => setShowModal(true)}
        >
          <AiOutlinePlus className="text-lg md:mr-1" />
          <span className="hidden md:inline text-sm">Add User</span>
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 transition text-black px-3 py-2 rounded-lg shadow-md flex items-center"
        >
          <AiOutlineDownload className="text-lg md:mr-1" />
          <span className="hidden md:inline text-sm">Export</span>
        </button>
      </div>

      <div className="relative mb-4 w-full">
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
                  clientuserid={user.clientuserid}
                  onEdit={() => handleEditClientUser(user)}
                  onDelete={() => handleDeleteClientUser(user.clientuserid)}
                />
              ))}
            </tbody>
          </table>
          {showModal && (
            <AddUserModal
              showModal={showModal}
              setShowModal={setShowModal}
              user={selectedClientUser}
            />
          )}
          {showDeleteDialog && (
            <ConfirmationDialog
              open={showDeleteDialog}
              title="Confirm Deletion"
              content="Are you sure you want to delete this expense?"
              onCancel={() => setShowDeleteDialog(false)}
              onConfirm={confirmDeleteClientUser}
              confirmDiscard={"Delete"}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
