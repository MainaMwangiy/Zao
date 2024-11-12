import React, { useEffect, useState } from "react";
import { ModuleConfig } from "../../config/harvests/types";
import { useApi } from "../../hooks/Apis";
import ActionMenu from "../../hooks/ActionMenu";

interface GenericTableProps {
  config: ModuleConfig;
  onEdit: (item: any) => void;
  params?: Record<string, any>;
}

const Table: React.FC<GenericTableProps & { showAddNew?: boolean }> = ({ config, onEdit, params, showAddNew = false }) => {
  const { apiRequest } = useApi();
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    const { url, payload = {} } = config.apiEndpoints.list;
    const tempPayload = { ...payload, ...params };
    const response = await apiRequest({ method: "POST", url: url, data: tempPayload });
    setData(response?.data || []);
  };

  const handleDelete = async (id: number) => {
    await apiRequest({ method: "POST", url: `${config.apiEndpoints.delete.url}/${id}` });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {config.fields.map((field) => (
              <th
                key={field.name}
                className="px-4 py-2 text-left text-sm font-semibold"
                style={{ minWidth: field.width || '150px' }}
              >
                {field.label}
              </th>
            ))}
            <th className="px-4 py-2 text-left text-sm font-semibold" style={{ minWidth: "80px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any) => (
            <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
              {config.fields.map((field) => (
                <td key={field.name} className="px-4 py-2 text-sm">
                  {field.render ? field.render(item[field.name]) : item[field.name]}
                </td>
              ))}

              <td className="px-4 py-2 text-sm">
                <ActionMenu onEdit={() => onEdit(item)} onDelete={() => handleDelete(item.expensesid || 0)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
