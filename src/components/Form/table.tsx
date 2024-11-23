import React, { useEffect, useState } from "react";
import { ModuleConfig } from "../../config/harvests/types";
import { useApi } from "../../hooks/Apis";
import ActionMenu from "../../hooks/ActionMenu";
import ConfirmationDialog from "../../hooks/ConfirmationDialog";
import Pagination from "./pagination";
import Loader from "../../hooks/Loader";
import { useSubmissionContext } from "./context";
import SearchInput from "../../hooks/SearchInput";
import { useDebounce } from "use-debounce";

interface GenericTableProps {
  config: ModuleConfig;
  onEdit: (item: any) => void;
  params?: Record<string, any>;
  id?: number;
}

const Table: React.FC<GenericTableProps & { showAddNew?: boolean }> = ({ config, onEdit, params, showAddNew = false, ...rest }) => {
  const key = `${config?.keyField.toLowerCase()}id`;
  const { apiRequest } = useApi();
  const [data, setData] = useState<any[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const { submissionState } = useSubmissionContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);

  const fetchData = async () => {
    setLoading(true);
    const { url, payload = {} } = config.apiEndpoints.list;
    const additionalParams = payload.hideProject ? {} : { projectid: rest?.id };
    const tempPayload = {
      ...payload,
      ...params,
      page: currentPage,
      pageSize: itemsPerPage,
      searchTerm: debouncedSearchTerm,
      ...additionalParams
    };
    const response = await apiRequest({ method: "POST", url: url, data: tempPayload });
    setData(response?.data || []);
    setTotalItems(response?.totalItems || 0);
    setLoading(false);
  };

  const confirmDeleteExpense = async () => {
    setLoading(true);
    if (deleteId !== null) {
      const data = {
        ...config.apiEndpoints.delete.payload,
        [key]: deleteId,
      };
      await apiRequest({ method: "POST", url: `${config.apiEndpoints.delete.url}/${deleteId}`, data: data });
      fetchData();
      setShowDeleteDialog(false);
      setDeleteId(null);
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    fetchData();
  }, [config, currentPage, submissionState, debouncedSearchTerm]);

  return (
    <>
      <div className="overflow-x-auto">
        {config?.addSearch && <SearchInput placeholder="Search for expenses" searchTerm={debouncedSearchTerm} setSearchTerm={setSearchTerm} />}
        {loading ? <Loader /> :
          <table className="min-w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {config.fields.filter(field => !field?.hide).map((field) => (
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
                  {config.fields.filter(field => !field?.hide).map((field) => (
                    <td
                      key={field.name}
                      className={`px-4 py-2 text-sm ${field.getCustomClass ? field.getCustomClass(item) : ''}`}
                    >
                      {field.convertValue ? field.convertValue(item[field.name]) : (field.render ? field.render(item[field.name], item) : item[field.name])}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-sm">
                    <ActionMenu onEdit={() => onEdit(item)} onDelete={() => handleDeleteClick(item[key] || 0)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
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
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default Table;
