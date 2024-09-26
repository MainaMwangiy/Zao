import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSnackbar } from "notistack";
import utils from "../utils";

const initialValues = {
    name: "",
    amount: "",
    status: "",
    notes: "",
    clientuserid: "",
    recipientuserid: ""
};

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    amount: Yup.number().typeError("Amount must be a number").required("Amount is required"),
    status: Yup.string().required("Status is required"),
    notes: Yup.string(),
    recipientuserid: Yup.string().required("Recipient is required")
});

interface AddTransactionModalProps {
    showTransactionModal: boolean;
    setTransactionShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
interface User {
    clientuserid: number;
    name: string;
    email: string;
    location: string;
    status: string;
    role: string;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ showTransactionModal, setTransactionShowModal }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [users, setUsers] = useState<User[]>([]);

    const fetchData = async () => {
        try {
            const url = `${utils.baseUrl}/api/auth/list-strict`;
            const response = await axios.get(url);
            const user = response.data.data;
            setUsers(user);
        } catch (error) {
            enqueueSnackbar("User loading failed. Please try again.", { variant: "error" });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const clientuserid = localStorage.getItem('clientuserid') || "";
                values.clientuserid = clientuserid;
                if (!clientuserid) {
                    enqueueSnackbar("Client user ID is missing.", { variant: "error" });
                    return;
                }

                const url = `/api/transactions/create`;
                await axios.post(url, { values }, {
                    headers: { "Content-Type": "application/json" },
                });
                enqueueSnackbar("Transaction added successfully!", { variant: "success" });
                setTransactionShowModal(false);
            } catch (error) {
                enqueueSnackbar("Transaction creation failed. Please try again.", { variant: "error" });
            }
        },
    });

    return (
        <div>
            {/* Button to open the modal */}
            <button
                onClick={() => setTransactionShowModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300"
            >
                Add Transaction
            </button>

            {/* Modal */}
            {showTransactionModal && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add New Transaction</h2>

                        {/* Form */}
                        <form onSubmit={formik.handleSubmit}>
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <div className="text-red-500 text-sm">{formik.errors.name}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Amount</label>
                                    <input
                                        name="amount"
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        value={formik.values.amount}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.amount && formik.errors.amount && (
                                        <div className="text-red-500 text-sm">{formik.errors.amount}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Recipient</label>
                                    <select
                                        name="recipientuserid"
                                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        value={formik.values.recipientuserid}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">Select recipient</option>
                                        {users.map((user) => (
                                            <option key={user.clientuserid} value={user.clientuserid}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.recipientuserid && formik.errors.recipientuserid && (
                                        <div className="text-red-500 text-sm">{formik.errors.recipientuserid}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Notes</label>
                                    <textarea
                                        name="notes"
                                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        value={formik.values.notes}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.notes && formik.errors.notes && (
                                        <div className="text-red-500 text-sm">{formik.errors.notes}</div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-4 px-4 py-2 border rounded-md dark:text-gray-300 dark:border-gray-600"
                                    onClick={() => setTransactionShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
                                >
                                    Add Transaction
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddTransactionModal;
