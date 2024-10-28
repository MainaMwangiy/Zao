import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import utils from "../../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import { ProjectProps } from "../../types";
import ConfirmationDialog from "../../hooks/ConfirmationDialog";

// Define the initial values for Formik form
const initialValues = {
  name: "",
  location: "",
  size: "",
  status: "",
  projectplan: "",
  clientorganizationid: "",
  costProjectEstimation: "",
  projectname: ""
};

// Define the validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  location: Yup.string().required("Location is required"),
  size: Yup.number()
    .typeError("Size must be a number")
    .required("Size is required"),
  status: Yup.string().required("Status is required"),
  projectplan: Yup.string().required("Project Plan is required"),
  costProjectEstimation: Yup.number()
    .typeError("Size must be a number")
    .required("Cost Project Estimation is required"),
});

interface AddProjectModalProps {
  showProjectseModal: boolean;
  setProjectshowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  showProjectseModal,
  setProjectshowModal,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const clientUser = localStorage.getItem("clientuser") || "{}"
  const userDetails = JSON.parse(clientUser)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  const formik = useFormik<ProjectProps>({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      try {
        const clientOrganizationId =
          localStorage.getItem("clientorganizationid") || "";
        const data = {
          ...values,
          clientorganizationid: clientOrganizationId,
          clientuserid: userDetails.clientuserid

        };
        const url = `${utils.baseUrl}/api/projects/create`;
        await axios.post(
          url,
          { values: data },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        enqueueSnackbar("Project added successfully!", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("Project creation failed. Please try again.", {
          variant: "error",
        });
      }
      setProjectshowModal(false);
    },
  });

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
              Add New Project
            </h2>

            {/* Form */}
            <form >
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
                    <div className="text-red-500 text-sm">
                      {formik.errors.name}
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
                    name="status"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.status}
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
                    name="costProjectEstimation"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    value={formik.values.costProjectEstimation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.size &&
                    formik.errors.costProjectEstimation && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.costProjectEstimation}
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
                  Add Project
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

export default AddProjectModal;
