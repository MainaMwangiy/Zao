import React, { useEffect } from "react";
import { useFormik, FormikProvider } from "formik";
import * as Yup from "yup";
import FormField from "./fields";
import Modal from "./Modal";
import { ModuleConfig } from "../../config/expenses/types";
import { useApi } from "../../hooks/Apis";

interface GenericFormProps {
  config: ModuleConfig;
  onClose: () => void;
  isOpen: boolean;
  initialValues?: Record<string, any>;
}

const Form: React.FC<GenericFormProps> = ({ config, onClose, isOpen, initialValues = {} }) => {
  const { apiRequest } = useApi();
  const fieldsToShow = config.fields.filter(field => field.form !== false);
  const defaultInitialValues = fieldsToShow.reduce<Record<string, any>>((acc, field) => {
    acc[field.name] = initialValues[field.name] ?? "";
    return acc;
  }, {});
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
      const isUpdate = Boolean(initialValues.id);
      const endpoint = isUpdate ? config.apiEndpoints.update : config.apiEndpoints.create;
      const url = endpoint.url;
      const defaultPayload = endpoint.payload || {};
      const requestData = { ...defaultPayload, ...values };
      await apiRequest({ method: "POST", url, data: requestData });
      onClose();
    },
  });

  useEffect(() => {
    formik.setValues(formik.initialValues);
  }, [initialValues]);

  const formContent = (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        {fieldsToShow.map((fieldConfig) => (
          <FormField key={fieldConfig.name} fieldConfig={fieldConfig} />
        ))}
        <button type="submit">Submit</button>
      </form>
    </FormikProvider>
  );
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Form Modal">
      {formContent}
    </Modal>
  );
};

export default Form;
