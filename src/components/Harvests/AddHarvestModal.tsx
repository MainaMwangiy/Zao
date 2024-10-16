import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import utils from "../../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import { AddHarvestModalProps, HarvestProps } from "../../types";

const AddHarvestModal: React.FC<AddHarvestModalProps> = ({
    showHarvestModal,
    setHarvestShowModal,
    harvest,
}) => {
    const { enqueueSnackbar } = useSnackbar();

    // Define the initial values for Formik form
    const initialValues: HarvestProps = {
        harvestid: harvest?.harvestid || "",
        bags: harvest?.bags || "",
        unitprice: harvest?.unitprice || "",
        amountsold: harvest?.amountsold || "",
        notes: harvest?.notes || "",
        createdbyusername: harvest?.createdbyusername || "",
        modifiedbyusername: harvest?.modifiedbyusername || "",
        createdon: harvest?.createdon || "",
        modifiedon: harvest?.modifiedon || "",
        createdbyuserid: harvest?.createdbyuserid || "",
        modifiedbyuserid: harvest?.modifiedbyuserid || "",
        clientorganizationid: harvest?.clientorganizationid || ""
    };


    // Define the validation schema using Yup
    const validationSchema = Yup.object({
        bags: Yup.number().typeError("Bags must be a number").required("Bags is required"),
        unitprice: Yup.number().typeError("Unit Price must be a number").required("Unit Price is required"),
        amountsold: Yup.number().typeError("Amount Sold must be a number").required("Amount Sold is required"),
        notes: Yup.string(),
    });

    const formik = useFormik<HarvestProps>({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const clientuserid = localStorage.getItem("clientuserid") || "";
                const clientOrganizationId = localStorage.getItem('clientorganizationid') || "";
                let url = "";

                if (!clientuserid) {
                    enqueueSnackbar("Client user ID is missing.", { variant: "error" });
                    return;
                }
                if (harvest) {
                    url = `${utils.baseUrl}/api/harvests/update/${harvest.harvestid}`;
                    values.harvestid = harvest.harvestid;
                } else {
                    url = `${utils.baseUrl}/api/harvests/create`;
                }
                values.createdbyuserid = clientuserid;
                values.modifiedbyuserid = clientuserid;
                values.clientorganizationid = clientOrganizationId;
                await axios.post(url, { values }, {
                    headers: { 'Content-Type': 'application/json' },
                });
                enqueueSnackbar(harvest ? "Harvest updated successfully!" : "Harvest added successfully!", { variant: "success" });
                setHarvestShowModal(false);
            } catch (error) {
                enqueueSnackbar(harvest ? "Harvest update failed. Please try again." : "Harvest creation failed. Please try again.", { variant: "error" });
            }
        },
    });

    return (
        <>
            {showHarvestModal && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                            {harvest ? "Edit Harvest" : "Add New Harvest"}
                        </h2>

                        <form onSubmit={formik.handleSubmit}>
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Bags</label>
                                    <input
                                        name="bags"
                                        type="number"
                                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        value={formik.values.bags}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.bags && formik.errors.bags && (
                                        <div className="text-red-500 text-sm">{formik.errors.bags}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Unit Price</label>
                                    <input
                                        name="unitprice"
                                        type="number"
                                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        value={formik.values.unitprice}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.unitprice && formik.errors.unitprice && (
                                        <div className="text-red-500 text-sm">{formik.errors.unitprice}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">Amount Sold</label>
                                    <input
                                        name="amountsold"
                                        type="number"
                                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                        value={formik.values.amountsold}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.amountsold && formik.errors.amountsold && (
                                        <div className="text-red-500 text-sm">{formik.errors.amountsold}</div>
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
                                    onClick={() => setHarvestShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300"
                                >
                                    {harvest ? "Update Harvest" : "Add Harvest"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddHarvestModal;
