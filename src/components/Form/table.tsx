import React, { useEffect, useState } from "react";
import { ModuleConfig } from "../../config/harvests/types";
import { useApi } from "../../hooks/Apis";
import ActionMenu from "../../hooks/ActionMenu";
import ConfirmationDialog from "../../hooks/ConfirmationDialog";

interface GenericTableProps {
  config: ModuleConfig;
  onEdit: (item: any) => void;
  params?: Record<string, any>;
}

const Table: React.FC<GenericTableProps & { showAddNew?: boolean }> = ({ config, onEdit, params, showAddNew = false }) => {
  const key = `${config?.keyField.toLowerCase()}id`;
  const { apiRequest } = useApi();
  const [data, setData] = useState<any[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchData = async () => {
    const { url, payload = {} } = config.apiEndpoints.list;
    const tempPayload = { ...payload, ...params, page: currentPage, pageSize: itemsPerPage };
    const response = await apiRequest({ method: "POST", url: url, data: tempPayload });
    setData(response?.data || []);
    setTotalItems(response?.totalItems || 0);
  };

  const confirmDeleteExpense = async () => {
    if (deleteId !== null) {
      const data = {
        ...config.apiEndpoints.delete.payload,
        [key]: deleteId,
      };
      await apiRequest({ method: "POST", url: `${config.apiEndpoints.delete.url}/${deleteId}`, data: data });
      fetchData();
      setShowDeleteDialog(false);
      setDeleteId(null);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };


  useEffect(() => {
    fetchData();
  }, [config, currentPage]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {config.fields.map((field) => (
                <th
                  key={field.name}
                  className="px-4 py-2 text-left text-sm font-semibold"
                  style={{ minWidth: field.width || "150px" }}
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
                  <ActionMenu onEdit={() => onEdit(item)} onDelete={() => handleDeleteClick(item[key] || 0)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showDeleteDialog && (
          <ConfirmationDialog
            open={showDeleteDialog}
            title="Confirm Deletion"
            content="Are you sure you want to delete this expense?"
            onCancel={() => setShowDeleteDialog(false)}
            onConfirm={confirmDeleteExpense}
            confirmDiscard="Delete"
          />
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange('prev')}
          className={`px-4 py-2 rounded bg-gray-200 text-gray-800 ${currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-300'}`}
          disabled={currentPage === 1}
        >
          &lt; Previous
        </button>
        <span className="text-gray-600 font-medium">
          Page {`${currentPage} - ${Math.ceil(totalItems / itemsPerPage)}`} of {totalItems}
        </span>
        <button
          onClick={() => handlePageChange('next')}
          className={`px-4 py-2 rounded bg-gray-200 text-gray-800 ${currentPage === Math.ceil(totalItems / itemsPerPage) ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-300'}`}
          disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
        >
          Next &gt;
        </button>
      </div>
    </>
  );
};

export default Table;
