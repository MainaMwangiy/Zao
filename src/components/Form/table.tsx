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
import dayjs from "dayjs";
import utils from "../../utils";

interface GenericTableProps {
  config: ModuleConfig;
  onEdit: (item: any) => void;
  params?: Record<string, any>;
  id?: number;
  hideActionMenu?: boolean;
  refreshCount?: number;
}

const Table: React.FC<GenericTableProps> = ({ config, onEdit, params, hideActionMenu, refreshCount, ...rest }) => {
  const key = utils.getKeyField(config);
  const keyField = `${key}id`;
  let localKey = `${key}s`;
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
  const clientorganizationid = localStorage.getItem('clientorganizationid') || "";
  const updateLocal = config?.updateLocal;
  const fetchData = async () => {
    setLoading(true);
    const { url = '', payload = {} } = config.apiEndpoints.list || {};
    const additionalParams = payload.hideProject ? {} : { projectid: rest?.id };
    const mandatoryParams = { clientorganizationid: clientorganizationid };
    const tempPayload = {
      ...payload,
      ...params,
      page: currentPage,
      pageSize: itemsPerPage,
      searchTerm: debouncedSearchTerm,
      ...additionalParams,
      ...mandatoryParams
    };
    const response = await apiRequest({ method: "POST", url: url, data: tempPayload });
    setData(response?.data || []);
    setTotalItems(response?.totalItems || 0);
    if (updateLocal) {
      localStorage.setItem(localKey, JSON.stringify(response?.data))
    }
    setLoading(false);
  };

  const confirmDeleteExpense = async () => {
    setLoading(true);
    const { payload } = config.apiEndpoints.delete;
    const mandatoryParams = { clientorganizationid: clientorganizationid };
    const tempParams = { ...payload, ...mandatoryParams }
    if (deleteId !== null) {
      const data = {
        ...tempParams,
        [keyField]: deleteId,
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
  }, [config, currentPage, submissionState, debouncedSearchTerm, refreshCount]);

  const renderCellContent = (field: any, item: any) => {
    if (field.type === 'date' && item[field.name]) {
      return dayjs(item[field.name]).format(utils.dateFormat);
    } else if (field.type === "json" && item[field.name]) {
      return (
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify(item[field.name], null, 2)}
        </pre>
      );
    } else if (field.convertValue) {
      return field.convertValue(item[field.name]);
    } else if (field.render) {
      return field.render(item[field.name], item);
    } else {
      return item[field.name];
    }
  };

  return (
    <div className="space-y-4">
      {config?.addSearch && (
        <SearchInput
          placeholder="Search for expenses"
          searchTerm={debouncedSearchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
      {/* <div className="overflow-x-auto "> */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        {loading ? (<Loader />) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {config.fields.filter(field => !field?.hide).map((field) => (
                  <th
                    key={field.name}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                    style={{ minWidth: field.width || "150px" }}
                  >
                    {field.label}
                  </th>
                ))}
                <th
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                  style={{ minWidth: "80px" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((item: any) => (
                <tr key={item.id || item[keyField]} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {config.fields.filter(field => !field?.hide).map((field) => (
                    <td
                      key={field.name}
                      className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${field.getCustomClass ? field.getCustomClass(item) : ''}`}
                    >
                      {renderCellContent(field, item)}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-sm">
                    <ActionMenu
                      onEdit={() => onEdit(item)}
                      onDelete={() => handleDeleteClick(item[keyField] || 0)}
                      config={config}
                      hideActionMenu={hideActionMenu}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
    </div>
  );
};

export default Table;
