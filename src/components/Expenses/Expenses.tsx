import React, { useEffect, useState } from "react";
import ExpenseRow from "./ExpenseRow";
import utils from "../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import AddExpenseModal from "./AddExpenseModal";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import Loader from "../common/Loader";

interface ExpensesProps {
  expensesid: string;
  name: string;
  amount: string;
  status: string;
  notes: string;
  paidby: string;
  clientusername: string;
  createdon: string;
  key: string;
}

const Expenses: React.FC = () => {
  const [showExpenseModal, setExpenseShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpensesProps | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const [expenses, setExpenses] = useState<ExpensesProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const totalexpenses = localStorage.getItem('totalexpenses');

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const values = {
        page: currentPage,
        pageSize: itemsPerPage
      }
      const url = `${utils.baseUrl}/api/expenses/list`;
      const response = await axios.post(url, { values }, {
        headers: { 'Content-Type': 'application/json' },
      });

      setExpenses(response.data.data);
      setTotalItems(response.data.totalItems);
      localStorage.setItem('expenses', JSON.stringify(response?.data.data));
    } catch (error) {
      enqueueSnackbar("Expenses Loading Failed. Please try again.", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [showExpenseModal, currentPage]);

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
    setDeleteExpenseId(expenseId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteExpense = async () => {
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
    <div className="container mx-auto px-2 py-6">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center w-full md:w-auto md:space-x-4 space-y-4 md:space-y-0 mb-4">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-lg shadow-md w-full md:w-auto">
              <p className="font-semibold text-lg mr-2">Total Expenses:</p>
              <p className="font-bold text-xl text-red-600 dark:text-red-400">KES {totalexpenses} </p>
            </div>

            <button
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-lg w-full md:w-auto shadow-md"
              onClick={() => {
                setSelectedExpense(null);
                setExpenseShowModal(true);
              }}
            >
              Add Expense
            </button>

            <button
              className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-2 rounded-lg w-full md:w-auto shadow-md"
              onClick={handleImportExpenses}
            >
              Import Expenses
            </button>

            <button
              className="bg-gray-300 hover:bg-gray-400 transition text-black px-6 py-2 rounded-lg w-full md:w-auto shadow-md"
            >
              Export
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search for expenses"
              className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="px-4 py-2 text-left text-sm font-semibold min-w-[200px]">NAME</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">AMOUNT</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">PAIDBY</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">STATUS</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold min-w-[250px]">NOTES</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold min-w-[150px]">CREATED ON</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <ExpenseRow
                    key={expense.expensesid}
                    expensesid={expense.expensesid}
                    name={expense.name}
                    amount={expense.amount}
                    status={expense.status}
                    notes={expense.notes}
                    paidby={expense.clientusername}
                    createdon={expense.createdon}
                    onEdit={() => handleEditExpense(expense)}
                    onDelete={() => handleDeleteExpense(expense.expensesid)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handlePageChange('prev')}
                className={`px-4 py-2 rounded bg-gray-200 text-gray-800 ${currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-300'}`}
                disabled={currentPage === 1}
              >
                &lt; Previous
              </button>
              <span className="text-gray-600 font-medium">
                Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
              </span>
            </div>
            <div>
              <button
                onClick={() => handlePageChange('next')}
                className={`px-4 py-2 rounded bg-gray-200 text-gray-800 ${currentPage === Math.ceil(totalItems / itemsPerPage) ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-300'}`}
                disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
              >
                Next &gt;
              </button>
            </div>
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
        </>
      )}
    </div>
  )
};


export default Expenses;
