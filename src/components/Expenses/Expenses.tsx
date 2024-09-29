import React, { useEffect, useState } from "react";
import ExpenseRow from "./ExpenseRow";
import utils from "../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import AddExpenseModal from "./AddExpenseModal";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

interface ExpensesProps {
  expensesid: string;
  name: string;
  amount: string;
  status: string;
  notes: string;
  paidby: string;
  clientusername: string;
  createdon: string;
}

const Expenses: React.FC = () => {
  const [showExpenseModal, setExpenseShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpensesProps | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [expenses, setExpenses] = useState<ExpensesProps[]>([]);

  const fetchData = async () => {
    try {
      const url = `${utils.baseUrl}/api/expenses/list`;
      const response = await axios.post(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      const expenseData = response.data.data;
      setExpenses(expenseData);
      localStorage.setItem('expenses', JSON.stringify(expenseData));
    } catch (error) {
      enqueueSnackbar("Expenses Loading Failed. Please try again.", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchData();
  }, [showExpenseModal]);

  const uploadExpensesFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const url = `${utils.baseUrl}/api/import-expenses`;
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const analyzedData: ExpensesProps[] = response.data;
        setExpenses(analyzedData);
      } else {
        alert('Error importing expenses');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload expenses');
    }
  };

  const handleImportExpenses = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv, .xlsx';

    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files ? target.files[0] : null;
      if (file) {
        uploadExpensesFile(file);
      }
    };
    fileInput.click();
  };

  const handleEditExpense = (expense: ExpensesProps) => {
    setSelectedExpense(expense);
    setExpenseShowModal(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    console.log("expnsesid", expenseId)
    setDeleteExpenseId(expenseId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteExpense = async () => {
    console.log("deleteExpenseId", deleteExpenseId)
    if (deleteExpenseId) {
      try {
        const url = `${utils.baseUrl}/api/expenses/delete/${deleteExpenseId}`;
        await axios.post(url, { expensesid: deleteExpenseId }, {
          headers: { 'Content-Type': 'application/json' },
        });
        enqueueSnackbar("Expense deleted successfully.", { variant: "success" });
        setExpenses(expenses.filter(expense => expense.expensesid !== deleteExpenseId));
      } catch (error) {
        enqueueSnackbar("Failed to delete expense. Please try again.", { variant: "error" });
      } finally {
        setShowDeleteDialog(false);
        setDeleteExpenseId(null);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold mb-2 md:mb-0 w-full md:w-auto">All Expenses</h1>
        <div className="flex flex-col md:flex-row items-center w-full md:w-auto md:space-x-2 space-y-2 md:space-y-0">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
            onClick={() => {
              setSelectedExpense(null);
              setExpenseShowModal(true);
            }}
          >
            Add Expense
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded w-full md:w-auto"
            onClick={handleImportExpenses}
          >
            Import Expenses
          </button>
          <button
            className="bg-gray-200 text-black px-4 py-2 rounded w-full md:w-auto"
          >
            Export
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search for expenses"
          className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-collapse">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="px-4 py-2 text-left text-sm font-semibold">NAME</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">AMOUNT</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">PAIDBY</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">STATUS</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">NOTES</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">CREATED ON</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {expenses && expenses?.map((expense) => (
              <ExpenseRow
                key={expense.expensesid}
                {...expense}
                onEdit={() => handleEditExpense(expense)}
                onDelete={() => handleDeleteExpense(expense.expensesid)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {showExpenseModal && (
        <AddExpenseModal
          showExpenseModal={showExpenseModal}
          setExpenseShowModal={setExpenseShowModal}
          expense={selectedExpense}
        />
      )}

      {showDeleteDialog && (
        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>Are you sure you want to delete this expense?</DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onClick={confirmDeleteExpense} color="secondary">Delete</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Expenses;
