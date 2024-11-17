import React, { useEffect, useState } from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import FormField from "./fields";
import Modal from "./Modal";
import ConfirmationDialog from "../../hooks/ConfirmationDialog";
import { ModuleConfig } from "../../config/harvests/types";
import { useApi } from "../../hooks/Apis";
import { constants } from "../../utils/constants";

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
    acc[field.name] = initialValues[field.name] ?? "";
    return acc;
  }, { [`${config.title.toLowerCase()}id`]: initialValues[`${config.keyField.toLowerCase()}id`] ?? "" });
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

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
      const id = values[`${config?.title.toLowerCase()}id`];
      const endpoint = isUpdate ? config.apiEndpoints.update : config.apiEndpoints.create;
      const url = isUpdate && id ? `${endpoint.url}/${id}` : endpoint.url;
      const defaultPayload = endpoint.payload || {};
      const requestData = { ...defaultPayload, ...values };
      await apiRequest({ method: "POST", url, data: requestData });
      onClose();
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

  const formContent = (
    <FormikProvider value={formik}>
      <form onSubmit={(e) => e.preventDefault()}>
        {fieldsToShow.map((fieldConfig) => (
          <FormField key={fieldConfig.name} fieldConfig={fieldConfig} />
        ))}
        <div className="flex justify-end space-x-2 mt-4">
          <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md transition duration-300">Cancel</button>
          <button type="submit" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition duration-300">{isUpdate ? 'Update' : 'Submit'}</button>
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
