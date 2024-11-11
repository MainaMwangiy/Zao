import React, { useState } from "react";
import Form from "./form";
import Table from "./table";
import Modal from "./Modal";
import { expensesConfig } from "../../config/expenses/config";

const ModulePage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedItem(null);
  };

  return (
    <div>
      <h1>{expensesConfig.title}</h1>
      <button onClick={() => setIsFormOpen(true)}>Add New</button>
      <Modal isOpen={isFormOpen} onClose={handleClose} title="Manage Expense">
        <Form
          config={expensesConfig}
          onClose={handleClose}
          isOpen={isFormOpen}
          initialValues={selectedItem || {}}
        />
      </Modal>
      <Table config={expensesConfig} onEdit={handleEdit} />
    </div>
  );
};

export default ModulePage;
