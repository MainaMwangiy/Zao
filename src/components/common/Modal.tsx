import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

// Define the initial values for Formik form
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  farmerOrBuyer: "",
  location: "",
  status: "",
  role: "",
};

// Define the validation schema using Yup
const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  farmerOrBuyer: Yup.string().required("Farmer/Buyer selection is required"),
  location: Yup.string().required("Location is required"),
  status: Yup.string().required("Status is required"),
  role: Yup.string().required("Role is required"),
});

interface AddUserModalProps {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  }

  const AddUserModal: React.FC<AddUserModalProps> = ({ showModal, setShowModal }) => {

  // Using useFormik hook for managing the form state and validation
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log("Form values: ", values); // Log the form data
      setShowModal(false); // Close the modal on form submission
    },
  });

  return (
<div>
  {/* Button to open the modal */}
  <button
    onClick={() => setShowModal(true)}
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300"
  >
    Add User
  </button>

  {/* Modal */}
  {showModal && (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add New User</h2>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">First Name</label>
              <input
                name="firstName"
                type="text"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="text-red-500 text-sm">{formik.errors.firstName}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Last Name</label>
              <input
                name="lastName"
                type="text"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="text-red-500 text-sm">{formik.errors.lastName}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Email</label>
              <input
                name="email"
                type="email"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Phone Number</label>
              <input
                name="phoneNumber"
                type="text"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <div className="text-red-500 text-sm">{formik.errors.phoneNumber}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Farmer/Buyer</label>
              <select
                name="farmerOrBuyer"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formik.values.farmerOrBuyer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select</option>
                <option value="Farmer">Farmer</option>
                <option value="Buyer">Buyer</option>
              </select>
              {formik.touched.farmerOrBuyer && formik.errors.farmerOrBuyer && (
                <div className="text-red-500 text-sm">{formik.errors.farmerOrBuyer}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Location</label>
              <input
                name="location"
                type="text"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.location && formik.errors.location && (
                <div className="text-red-500 text-sm">{formik.errors.location}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Status</label>
              <select
                name="status"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {formik.touched.status && formik.errors.status && (
                <div className="text-red-500 text-sm">{formik.errors.status}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Role</label>
              <select
                name="role"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select</option>
                <option value="Superadmin">Superadmin</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <div className="text-red-500 text-sm">{formik.errors.role}</div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="mr-4 px-4 py-2 border rounded-md dark:text-gray-300 dark:border-gray-600"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={()=> formik.handleSubmit()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>

  );
};

export default AddUserModal;
