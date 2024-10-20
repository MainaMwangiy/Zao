import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSnackbar } from "notistack";
import utils from "../../utils";
import { AddTransactionModalProps, User } from "../../types";
import ConfirmationDialog from "../../hooks/ConfirmationDialog";

const initialValues = {
    name: "",
    amount: "",
    notes: "",
    clientuserid: "",
    recipientuserid: "",
    clientorganizationid: ""
};

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    amount: Yup.number().typeError("Amount must be a number").required("Amount is required"),
    notes: Yup.string(),
    recipientuserid: Yup.string().required("Recipient is required")
});

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ showTransactionModal, setTransactionShowModal }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [users, setUsers] = useState<User[]>([]);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
    const clientOrganizationId = localStorage.getItem('clientorganizationid') || "";
    const clientusers = localStorage.getItem('clientuser') || '';
    const roles = JSON.parse(clientusers);

    const fetchData = async () => {
        try {
            const values = {
                clientorganizationid: clientOrganizationId,
                roleid: roles?.roleid
            }
            const url = `${utils.baseUrl}/api/auth/list-strict`;
            const response = await axios.post(url, { values }, {
                headers: { 'Content-Type': 'application/json' },
            });
            const users = response.data.data;
            localStorage.setItem('users', users)
            setUsers(users);
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
                values.clientorganizationid = clientOrganizationId;
                if (!clientuserid) {
                    enqueueSnackbar("Client user ID is missing.", { variant: "error" });
                    return;
                }

                const url = `${utils.baseUrl}/api/transactions/create`;
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

    const handleRecipientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRecipient = e.target.value;
        const clientuserid = localStorage.getItem('clientuserid') || "";
        formik.setFieldValue("recipientuserid", selectedRecipient);
        formik.setFieldValue("clientuserid", clientuserid);
    };

    const handleSubmit = () => {
        if (formik.dirty) {
            setShowConfirmationDialog(true);
        } else {
            formik.submitForm();
        }
    };

    const onConfirm = () => {
        setShowConfirmationDialog(false);
        formik.submitForm();
    };

    const onCancel = () => {
        if (formik.dirty) {
            setShowCancelConfirmation(true);
        } else {
            setTransactionShowModal(false);
        }
    };

    const confirmCancel = () => {
        setTransactionShowModal(false);
        setShowCancelConfirmation(false);
    };
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
                        <form >
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
                                        type="number"
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
                                        onChange={handleRecipientChange}
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
                                    onClick={onCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
                                    onClick={handleSubmit}
                                >
                                    Add Transaction
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <ConfirmationDialog
                open={showConfirmationDialog || showCancelConfirmation}
                title={showConfirmationDialog ? "Confirm Submission" : "Unsaved Changes"}
                content={showConfirmationDialog ? "Are you sure you want to submit these details?" : "You have unsaved changes. Are you sure you want to discard them?"}
                onCancel={() => showConfirmationDialog ? setShowConfirmationDialog(false) : setShowCancelConfirmation(false)}
                onConfirm={showConfirmationDialog ? onConfirm : confirmCancel}
                confirmDiscard={showConfirmationDialog ? "Submit" : "Discard"}
            />
        </div>
    );
};

export default AddTransactionModal;
