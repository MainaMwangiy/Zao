import React, { useEffect, useState } from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import FormField from "./fields";
import Modal from "./Modal";
import ConfirmationDialog from "../../hooks/ConfirmationDialog";
import { ModuleConfig } from "../../config/harvests/types";
import { useApi } from "../../hooks/Apis";
import { constants } from "../../utils/constants";
import { useSubmissionContext } from "./context";
import utils from "../../utils";

interface GenericFormProps {
  config: ModuleConfig;
  onClose: () => void;
  isOpen: boolean;
  initialValues?: Record<string, any>;
}

const Form: React.FC<GenericFormProps & { mode: 'edit' | 'add', [key: string]: any }> = ({ config, onClose, isOpen, initialValues = {}, mode, ...rest }) => {
  const isUpdate = mode === 'edit';
  const { apiRequest } = useApi();
  const fieldsToShow = config.fields.filter(field => field.form !== false);
  const defaultInitialValues = fieldsToShow.reduce<Record<string, any>>((acc, field) => {
    const fieldValue = initialValues[field.name];
    if (field?.isRole) {
      const tempFieldValue = utils.getRoles(fieldValue) || 'user';
      const val = tempFieldValue.toLowerCase();
      acc[field.name] = val ?? "";
    } else {
      acc[field.name] = typeof fieldValue === "object" && fieldValue !== null ? JSON.stringify(fieldValue) : fieldValue ?? "";
    }
    return acc;
  }, { [`${config.keyField.toLowerCase()}id`]: initialValues[`${config.keyField.toLowerCase()}id`] ?? "" });
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const { setSubmissionState } = useSubmissionContext();
  const clientorganizationid = localStorage.getItem("clientorganizationid") || "";
  const clientorganizations = localStorage.getItem("clientorganizations") || "";
  const allOrganizations = JSON.parse(clientorganizations) || [];

  const validationSchema = Yup.object(
    fieldsToShow.reduce<Record<string, any>>((schema, field) => {
      if (field.required) {
        schema[field.name] = Yup.string().required(`${field.label} is required`);
      }
      return schema;
    }, {})
  );
  const formik = useFormik({
    initialValues: defaultInitialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const staticValues = { ...values };
      config.fields.forEach(field => {
        if (field?.passKeyField && values[field.name]) {
          staticValues[field.name] = utils.getRolesId(values[field.name]);
        }
      });
      const id = staticValues[`${config?.keyField.toLowerCase()}id`];
      const endpoint = isUpdate ? config.apiEndpoints.update : config.apiEndpoints.create;
      const url = isUpdate && id ? `${endpoint.url}/${id}` : endpoint.url;
      const defaultPayload = endpoint.payload || {};
      let getOrganization;
      for (const item of allOrganizations) {
        if (item.name.includes(staticValues?.clientorganization || staticValues?.name)) {
          getOrganization = item;
        }
      }
      const filterOrganizations = utils.isSuperAdmin ? getOrganization?.clientorganizationid : clientorganizationid;
      const mandatoryParams = { clientorganizationid: filterOrganizations };
      const additionalParams = endpoint?.payload?.hideProject ? {} : { projectid: rest?.id };
      const requestData = { ...defaultPayload, ...staticValues, ...additionalParams, ...mandatoryParams };
      await apiRequest({ method: "POST", url, data: requestData });
      setSubmissionState(true);
      onClose();
      rest.onDataUpdated();
    },
  });

  useEffect(() => {
    formik.setValues(formik.initialValues);
  }, [initialValues]);

  const { dirty } = formik;
  const handleSubmit = () => {
    if (dirty) {
      setShowConfirmationDialog(true);
    } else {
      formik.submitForm();
    }
  };
  const onConfirmSubmit = () => {
    setShowConfirmationDialog(false);
    formik.submitForm();
  };

  const onCancel = () => {
    if (dirty) {
      setShowCancelConfirmation(true);
    } else {
      onClose();
    }
  };

  const confirmCancel = () => {
    onClose();
    setShowCancelConfirmation(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setSubmissionState(false);
    }
  }, [isOpen, setSubmissionState]);


  const formContent = (
    <FormikProvider value={formik}>
      <form onSubmit={e => e.preventDefault()}>
        {fieldsToShow
          .filter(fieldConfig => fieldConfig?.isSuperAdmin !== false)
          .map(fieldConfig => (
            <FormField key={fieldConfig.name} fieldConfig={fieldConfig} />
          ))}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition duration-300"
          >
            {isUpdate ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </FormikProvider>
  );
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isUpdate ? `Edit ${config.title}` : `Add ${config.title}`} {...rest}>
      {formContent}
      {(showConfirmationDialog || showCancelConfirmation) && (
        <ConfirmationDialog
          open={showConfirmationDialog || showCancelConfirmation}
          title={showConfirmationDialog ? "Confirm Submission" : "Unsaved Changes"}
          content={showConfirmationDialog ? constants.FORM_SUBMIT : constants.FORM_DISCARD}
          onCancel={() => {
            if (showConfirmationDialog) {
              setShowConfirmationDialog(false);
            } else {
              setShowCancelConfirmation(false);
            }
          }}
          onConfirm={showConfirmationDialog ? onConfirmSubmit : confirmCancel}
          confirmDiscard={showConfirmationDialog ? "Submit" : "Discard"}
        />
      )}
    </Modal>
  );
};

export default Form;
