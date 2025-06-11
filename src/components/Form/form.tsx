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
import { useSnackbar } from "notistack";

interface GenericFormProps {
  config: ModuleConfig;
  onClose: () => void;
  isOpen: boolean;
  initialValues?: Record<string, any>;
}
type Mode = 'edit' | 'add' | null;

const Form: React.FC<GenericFormProps & { mode: Mode, [key: string]: any }> = ({ config, onClose, isOpen, initialValues = {}, mode, ...rest }) => {
  const isUpdate = mode === 'edit';
  const limitCreate = config?.limit && !isUpdate;
  const { apiRequest } = useApi();
  const keyField = utils.getKeyField(config);
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
  }, { [`${keyField.toLowerCase()}id`]: initialValues[`${keyField.toLowerCase()}id`] ?? "" });
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const { setSubmissionState } = useSubmissionContext();
  const { enqueueSnackbar } = useSnackbar();
  const clientorganizationid = localStorage.getItem("clientorganizationid") || "";
  const clientorganizations = localStorage.getItem("clientorganizations") || "";
  let allOrganizations: any[] = [];
  if (clientorganizations && clientorganizations.trim() !== '') {
    try {
      allOrganizations = JSON.parse(clientorganizations);
    } catch (e) {
      enqueueSnackbar("Failed to parse clientorganizations:", { variant: "error" });
    }
  }

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
      const id = staticValues[`${keyField.toLowerCase()}id`];
      const endpoint = isUpdate ? config.apiEndpoints.update : config.apiEndpoints.create;
      const url = isUpdate && id ? `${endpoint.url}/${id}` : endpoint.url;
      const defaultPayload = endpoint.payload || {};
      let getOrganization;
      for (const item of allOrganizations) {
        const keyFieldLower = keyField.toLowerCase();
        const dynamicKeyId = `${keyFieldLower}id`;
        if (!isUpdate) {
          getOrganization = item;
          break;
        }
        if (item[dynamicKeyId] === staticValues[dynamicKeyId]) {
          getOrganization = item;
          break;
        }
      }
      const skipMandatory = config?.skipKeyField;
      const cnd = !skipMandatory || isUpdate;
      const filterOrganizations = ((utils.isSuperAdmin && getOrganization?.clientorganizationid !== undefined)) ? getOrganization.clientorganizationid : clientorganizationid;
      const mandatoryParams = !isUpdate ? { clientorganizationid: filterOrganizations } : { clientorganizationid: clientorganizationid };
      const isProject = keyField.toLowerCase() === "project";
      const additionalParams = endpoint?.payload?.hideProject ? {} : { projectid: isProject ? id : rest?.id };
      const requestData = { ...defaultPayload, ...staticValues, ...additionalParams, ...(cnd ? mandatoryParams : {}) };
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
    if (limitCreate) {
      enqueueSnackbar("You cannot add new project. Please contact support", { variant: "error" });
      onClose();
      return;
    }
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
      <form onSubmit={e => e.preventDefault()} className="space-y-6">
        {fieldsToShow
          .filter(fieldConfig => fieldConfig?.isSuperAdmin !== false)
          .map(fieldConfig => (
            <FormField key={fieldConfig.name} fieldConfig={fieldConfig} />
          ))}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
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
