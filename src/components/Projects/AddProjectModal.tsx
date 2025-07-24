import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import utils from "../../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import { ProjectProps } from "../../types";
import ConfirmationDialog from "../../hooks/ConfirmationDialog";
import { useDataRefresh } from "../../hooks/DataRefreshContext";

const validationSchema = Yup.object({
  projectname: Yup.string().required("Name is required"),
  location: Yup.string().required("Location is required"),
  size: Yup.number()
    .typeError("Size must be a number")
    .required("Size is required"),
  projectstatus: Yup.string().required("Project Status is required"),
  projectplan: Yup.string().required("Project Plan is required"),
  costprojectestimation: Yup.number()
    .typeError("Size must be a number")
    .required("Cost Project Estimation is required"),
});

interface AddProjectModalProps {
  showProjectseModal: boolean;
  setProjectshowModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: ProjectProps | null;
  mode: string;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  showProjectseModal,
  setProjectshowModal,
  selectedItem,
  mode,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { refreshData } = useDataRefresh();
  const clientUser = localStorage.getItem("clientuser") || "{}";
  const userDetails = JSON.parse(clientUser);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const isUpdate = mode === "edit";

  const initialValues = {
    name: selectedItem?.name || "",
    location: selectedItem?.location || "",
    size: selectedItem?.size || "",
    projectplan: selectedItem?.projectplan || "",
    clientorganizationid: selectedItem?.clientorganizationid || "",
    costprojectestimation: selectedItem?.costprojectestimation || "",
    projectname: selectedItem?.projectname || "",
    projectstatus: selectedItem?.projectstatus || "",
    projectid: selectedItem?.projectid || 0,
    earnings: selectedItem?.earnings || 0,
    expenses: selectedItem?.expenses || 0,
  };

  const formik = useFormik<ProjectProps>({
    initialValues: initialValues,
    validationSchema,
    onSubmit: async values => {
      try {
        let url = "";
        const clientOrganizationId =
          localStorage.getItem("clientorganizationid") || "";
        const data = {
          ...values,
          clientorganizationid: clientOrganizationId,
          clientuserid: userDetails.clientuserid,
        };
        if (isUpdate) {
          url = `${utils.baseUrl}/api/projects/update/${values.projectid}`;
        } else {
          url = `${utils.baseUrl}/api/projects/create`;
        }
        await axios.post(url, data, {
          headers: { "Content-Type": "application/json" },
        });
        enqueueSnackbar("Project added successfully!", { variant: "success" });
        formik.resetForm();
        refreshData();
        setProjectshowModal(false);
      } catch (error) {
        enqueueSnackbar("Project creation failed. Please try again.", {
          variant: "error",
        });
      }
    },
  });

  useEffect(() => {
    if (isUpdate) {
      formik.resetForm({ values: initialValues });
    }
  }, [selectedItem]);

  const handleSubmit = () => {
    if (formik.dirty) {
      setShowConfirmationDialog(true);
    } else {
      setShowConfirmationDialog(true);
      formik.handleSubmit();
    }
  };

  const onConfirm = () => {
    setShowConfirmationDialog(false);
    formik.handleSubmit();
  };

  const onCancel = () => {
    if (formik.dirty) {
      setShowCancelConfirmation(true);
    } else {
      setProjectshowModal(false);
    }
  };

  const confirmCancel = () => {
    setProjectshowModal(false);
    setShowCancelConfirmation(false);
  };

  return (
    <div>
      {/* Button to open the modal */}
      <button
        onClick={() => setProjectshowModal(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transition duration-300"
      >
        Add Project
      </button>

      {/* Modal */}
      {showProjectseModal && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 m-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {isUpdate ? "Update Project" : "Add New Project"}
            </h2>

            {/* Form */}
            <form>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Name
                  </label>
                  <input
                    name="projectname"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.projectname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.projectname && formik.errors.projectname && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.projectname}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Location
                  </label>
                  <input
                    name="location"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.location && formik.errors.location && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.location}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Size
                  </label>
                  <input
                    name="size"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.size}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.size && formik.errors.size && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.size}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Status
                  </label>
                  <select
                    name="projectstatus"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.projectstatus}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                  {formik.touched.projectstatus &&
                    formik.errors.projectstatus && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.projectstatus}
                      </div>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Project Cost Estimation in Shillings
                  </label>
                  <input
                    name="costprojectestimation"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.costprojectestimation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.costprojectestimation &&
                    formik.errors.costprojectestimation && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.costprojectestimation}
                      </div>
                    )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Project Plan
                  </label>
                  <select
                    name="projectplan"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.projectplan}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {formik.touched.projectplan && formik.errors.projectplan && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.projectplan}
                    </div>
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
                  {isUpdate ? "Update Project" : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmationDialog
        open={showConfirmationDialog || showCancelConfirmation}
        title={
          showConfirmationDialog ? "Confirm Submission" : "Unsaved Changes"
        }
        content={
          showConfirmationDialog
            ? "Are you sure you want to submit these details?"
            : "You have unsaved changes. Are you sure you want to discard them?"
        }
        onCancel={() =>
          showConfirmationDialog
            ? setShowConfirmationDialog(false)
            : setShowCancelConfirmation(false)
        }
        onConfirm={showConfirmationDialog ? onConfirm : confirmCancel}
        confirmDiscard={showConfirmationDialog ? "Submit" : "Discard"}
      />
    </div>
  );
};

export default AddProjectModal;
