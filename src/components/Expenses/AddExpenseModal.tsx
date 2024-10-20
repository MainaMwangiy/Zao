import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import utils from "../../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import { AddExpenseModalProps, ExpenseProps } from "../../types";
import ConfirmationDialog from "../../hooks/ConfirmationDialog";

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
    showExpenseModal,
    setExpenseShowModal,
    expense,
    projectid
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const clientOrganizationId = localStorage.getItem('clientorganizationid') || "";
    const user = localStorage.getItem('clientuser') || "{}";
    const clientuser = JSON.parse(user);
    const clientuserid = clientuser?.clientuserid;
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

    // Define the initial values for Formik form
    const initialValues: ExpenseProps = {
        expesesid: expense?.expesesid || "",
        name: expense?.name || "",
        amount: expense?.amount || "",
        status: expense?.status || "",
        notes: expense?.notes || "",
        expensesid: expense?.expensesid || "",
        clientuserid: expense?.clientuserid || "",
        clientusername: expense?.clientusername || "",
        clientorganizationid: expense?.clientorganizationid || ""
    };

    // Define the validation schema using Yup
    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        amount: Yup.number().typeError("Amount must be a number").required("Amount is required"),
        status: Yup.string().required("Status is required"),
        notes: Yup.string()
    });

    const formik = useFormik<ExpenseProps>({
        initialValues,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                let url = '';
                if (!clientuserid) {
                    enqueueSnackbar("Client user ID is missing.", { variant: "error" });
                    return;
                }
                if (expense) {
                    url = `${utils.baseUrl}/api/expenses/update/${expense.expensesid}`;
                    values.expesesid = expense.expensesid;
                } else {
                    url = `${utils.baseUrl}/api/expenses/create`;
                }

                const data = {
                    ...values,
                    clientorganizationid: clientOrganizationId,
                    createdbyuserid: clientuserid,
                    modifiedbyuserid: clientuserid,
                    clientuserid: clientuserid || "",
                    clientusername: clientuser?.name || "",
                    projectid: projectid

                };
                await axios.post(url, { values: data }, {
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
    const { dirty } = formik;


    const handleSubmit = () => {
        if (dirty) {
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
        if (dirty) {
            setShowCancelConfirmation(true);
        } else {
            setExpenseShowModal(false);
            setShowCancelConfirmation(false);
        }
    };

    const confirmCancel = () => {
        setExpenseShowModal(false);
        setShowCancelConfirmation(false);
    };

    return (
        <div>
            {showExpenseModal && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                            {expense ? "Edit Expense" : "Add New Expense"}
                        </h2>

                        <form>
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
                                    onClick={onCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
                                    onClick={handleSubmit}
                                >
                                    {expense ? "Update Expense" : "Add Expense"}
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
                confirmDiscard={showConfirmationDialog ? "Confirm" : "Discard"}
            />
        </div>
    );
};

export default AddExpenseModal;
