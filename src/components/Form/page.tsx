import React, { useState } from "react";
import Form from "./form";
import Table from "./table";
import Modal from "./Modal";

import { ModuleConfig, DataItem } from "../../types";
import { AiOutlineDownload, AiOutlinePlus, AiOutlineUpload } from "react-icons/ai";

interface ModulePageProps {
  config: ModuleConfig;
  showAddNew?: boolean;
}

const ModulePage: React.FC<ModulePageProps> = ({ config, showAddNew = false }) => {
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const handleEdit = (item: DataItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  const mode = selectedItem ? "edit" : "add";
  return (
    <div>
      {config.showTitle && <h1>{config.title}</h1>}
      <div className="flex flex-row items-center w-full space-x-2 mb-4">
        {config.showTotal && <>
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-1 rounded-lg shadow-md">
            <p className="font-semibold text-base mr-2">{`Total ${config.title}: `}</p>
            <p className="font-bold text-lg text-red-600 dark:text-red-400">KES {0}</p>
          </div>
        </>}
        {showAddNew && (
          <button
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-2 rounded-lg shadow-md flex items-center"
            onClick={() => {
              setSelectedItem(null);
              setIsFormOpen(true);
            }}>
            <AiOutlinePlus className="text-lg md:mr-1" />
            <span className="hidden md:inline text-sm">Add New</span>
          </button>
        )}
        {config.isImport && <>
          <button
            className="bg-green-600 hover:bg-green-700 transition text-white px-3 py-2 rounded-lg shadow-md flex items-center"
          // onClick={handleImportExpenses}
          >
            <AiOutlineUpload className="text-lg md:mr-1" />
            <span className="hidden md:inline text-sm">Import {config.title}</span>
          </button>
        </>}

        {config.isExport && <>
          <button
            className="bg-gray-300 hover:bg-gray-400 transition text-black px-3 py-2 rounded-lg shadow-md flex items-center"
          // onClick={handleExportExpenses}
          >
            <AiOutlineDownload className="text-lg md:mr-1" />
            <span className="hidden md:inline text-sm">Export {config.title}</span>
          </button>
        </>}
      </div>
      <Modal isOpen={isFormOpen} onClose={handleClose} title={selectedItem ? "Edit Item" : "Add Item"}>
        <Form
          config={config}
          onClose={handleClose}
          isOpen={isFormOpen}
          initialValues={selectedItem || {}}
          mode={mode}
        />
      </Modal>
      <Table config={config} onEdit={handleEdit} />
    </div>
  );
};

export default ModulePage;
