import React, { useState } from "react";
import { FieldConfig } from "../../config/harvests/types";
import { useField } from "formik";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface FormFieldProps {
  fieldConfig: FieldConfig;
}

const FormField: React.FC<FormFieldProps> = ({ fieldConfig }) => {
  const [field, meta, helpers] = useField(fieldConfig.name);
  const [showPassword, setShowPassword] = useState(false);

  const renderField = () => {
    const inputBaseClass = "w-full px-3 py-2 border rounded text-gray-900 dark:text-white";
    switch (fieldConfig.type) {
      case "text":
      case "number":
      case "string":
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
      case "password":
        return (
          <div className="relative">
            <input
              {...field}
              type={showPassword ? "text" : "password"}
              className={`${inputBaseClass} bg-white dark:bg-gray-800 pr-10`}
              placeholder={fieldConfig.label}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
        );
      case "date":
        return (
          <input
            {...field}
            type="date"
            className={`${inputBaseClass} bg-white dark:bg-gray-800`}
            placeholder={fieldConfig.label}
          />
        );
        case "json":
          return (
            <textarea
              {...field}
              className="w-full px-3 py-2 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              placeholder={`Enter ${fieldConfig.label} in JSON format`}
              rows={6}
              value={typeof field.value === "object" && field.value !== null ? JSON.stringify(field.value, null, 2) : field.value || ""}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  helpers.setValue(parsed);
                } catch {
                  helpers.setValue(e.target.value);
                }
              }}
          />          
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
