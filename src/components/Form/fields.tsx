import React from "react";
import { FieldConfig } from "../../config/expenses/types";
import { useField } from "formik";

interface FormFieldProps {
  fieldConfig: FieldConfig;
}

const FormField: React.FC<FormFieldProps> = ({ fieldConfig }) => {
  const [field, meta, helpers] = useField(fieldConfig.name);

  const renderField = () => {
    const inputBaseClass = "w-full px-3 py-2 border rounded text-gray-900 dark:text-white";
    switch (fieldConfig.type) {
      case "text":
      case "number":
      case "textarea":
        return (
          <input
            {...field}
            type={fieldConfig.type}
            className={`${inputBaseClass} bg-white dark:bg-gray-800`}
            placeholder={fieldConfig.label}
          />
        );
      case "select":
        return (
          <select {...field} className={`${inputBaseClass} bg-white dark:bg-gray-800`}>
            <option value="">Select {fieldConfig.label}</option>
            {fieldConfig.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="m-4">
      <label className="text-gray-900 dark:text-white">{fieldConfig.label}</label>
      {renderField()}
      {meta.touched && meta.error && <div className="text-red-500">{meta.error}</div>}
    </div>
  );
};

export default FormField;
