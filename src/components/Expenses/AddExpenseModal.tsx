import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import utils from "../utils";
import axios from "axios";
import { useSnackbar } from "notistack";

interface AddExpenseModalProps {
    showExpenseModal: boolean;
    setExpenseShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    expense?: ExpenseProps | null;
}

interface ExpenseProps {
    name: string;
    amount: string;
    status: string;
    notes: string;
    expensesid: string;
    clientuserid: string;
    clientusername: string;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
    showExpenseModal,
    setExpenseShowModal,
    expense,
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const clientUsers = utils.getClientUsersList();

    // Define the initial values for Formik form
    const initialValues: ExpenseProps = {
        name: expense?.name || "",
        amount: expense?.amount || "",
        status: expense?.status || "",
        notes: expense?.notes || "",
        expensesid: expense?.expensesid || "",
        clientuserid: expense?.clientuserid || "",
        clientusername: expense?.clientusername || ""
    };

    // Define the validation schema using Yup
    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        amount: Yup.number().typeError("Amount must be a number").required("Amount is required"),
        status: Yup.string().required("Status is required"),
        notes: Yup.string(),
        clientuserid: Yup.string().required("Client User is required"),
    });

    const formik = useFormik<ExpenseProps>({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const clientuserid = localStorage.getItem('clientuserid') || "";
                values.clientuserid = clientuserid;
                if (!clientuserid) {
                    enqueueSnackbar("Client user ID is missing.", { variant: "error" });
                    return;
                }
                const url = expense
                    ? `${utils.baseUrl}/api/expenses/update/${expense.expensesid}`
                    : `${utils.baseUrl}/api/expenses/create`;
                await axios.post(url, { values }, {
                    headers: { 'Content-Type': 'application/json' },
                });
                enqueueSnackbar(
                    expense ? "Expense updated successfully!" : "Expense added successfully!",
                    { variant: "success" }
                );
                setExpenseShowModal(false);
            } catch (error) {
                enqueueSnackbar("Expense operation failed. Please try again.", { variant: "error" });
            }
        },
    });
    console.log("alues", formik.values)
    return (
        <div>
            {/* Modal */}
            {showExpenseModal && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                            {expense ? "Edit Expense" : "Add New Expense"}
                        </h2>

                        {/* Form */}
                        <form onSubmit={formik.handleSubmit}>
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                        Name
                                    </label>
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
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                        Amount
                                    </label>
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
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        value={formik.values.status}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">Select</option>
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                    </select>
                                    {formik.touched.status && formik.errors.status && (
                                        <div className="text-red-500 text-sm">{formik.errors.status}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                        Paid By
                                    </label>
                                    <select
                                        name="clientuserid"
                                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        value={formik.values.clientusername}
                                        onChange={(e) => {
                                            const selectedUserId = e.target.value;
                                            const selectedUser = clientUsers.find(
                                                (user) => user.lookupid === selectedUserId
                                            );
                                            console.log("selectedUserId", selectedUserId)
                                            console.log("selectedUser", selectedUser)
                                            formik.setFieldValue("clientusername", selectedUserId);
                                            formik.setFieldValue("clientuserid", localStorage.getItem('clientuserid') || "");
                                        }}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="">Select Paid By</option>
                                        {clientUsers.map((user) => (
                                            <option key={user.lookupid} value={user.displayValue}>
                                                {user.displayValue}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.clientuserid && formik.errors.clientuserid && (
                                        <div className="text-red-500 text-sm">{formik.errors.clientuserid}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                        Notes
                                    </label>
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
                                    onClick={() => setExpenseShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
                                >
                                    {expense ? "Update Expense" : "Add Expense"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddExpenseModal;
