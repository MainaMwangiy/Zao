import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import utils from "../utils";
import axios from "axios";
import { useSnackbar } from "notistack";

const initialValues = {
    name: "",
    amount: "",
    status: "",
    notes: "",
    clientuserid: ""
};

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    amount: Yup.number().typeError("Amount must be a number").required("Amount is required"),
    status: Yup.string().required("Status is required"),
    notes: Yup.string(),
});

interface AddTransactionModalProps {
    showTransactionModal: boolean;
    setTransactionShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ showTransactionModal, setTransactionShowModal }) => {
    const { enqueueSnackbar } = useSnackbar();

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

                const url = `${utils.baseUrl}/api/transactions/create`;
                await axios.post(url, { values }, {
                    headers: { "Content-Type": "application/json" },
                });
                enqueueSnackbar("Transaction added successfully!", { variant: "success" });
            } catch (error) {
                enqueueSnackbar("Transaction creation failed. Please try again.", { variant: "error" });
            }
            setTransactionShowModal(false);
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
                            </div>

                            <div className="grid grid-cols-1 gap-4 mb-4">
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
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    {formik.touched.status && formik.errors.status && (
                                        <div className="text-red-500 text-sm">{formik.errors.status}</div>
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
