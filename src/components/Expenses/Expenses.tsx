import React, { useEffect, useState, useCallback } from "react";
import ExpenseRow from "./ExpenseRow";
import utils from "../../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import AddExpenseModal from "./AddExpenseModal";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import Loader from "../../hooks/Loader";
import { AiOutlineDownload, AiOutlinePlus, AiOutlineUpload } from "react-icons/ai";
import _ from 'lodash';
import { ExpensesProps } from "../../types";

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
  const [searchTerm, setSearchTerm] = useState<string>("");

  const totalexpenses = localStorage.getItem('totalexpenses');
  const clientorganizationid = localStorage.getItem('clientorganizationid') || "";

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };
  const params = {
    page: currentPage,
    pageSize: itemsPerPage,
    searchTerm: searchTerm.trim(),
    clientorganizationid
  };

  const fetchData = useCallback(_.debounce(async (searchTerm: string) => {
    try {
      setIsLoading(true);
      const values = params;
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
  }, 1000), [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchData(searchTerm);
  }, [showExpenseModal, currentPage, searchTerm, fetchData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    fetchData(e.target.value);
  };

  const handleExportExpenses = async () => {
    try {
      const url = `${utils.baseUrl}/api/expenses/list`;
      const reqParams = {
        ...params,
        isExport: true,
      };
      const response = await axios.post(url, { values: reqParams }, {
        responseType: 'blob'
      });
      const currentDate = new Date().toISOString().split('T')[0];
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `Expenses${currentDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      enqueueSnackbar("Failed to export expenses. Please try again.", { variant: "error" });
      console.error('Error exporting expenses:', error);
    }
  };

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
      const clientorganizationid = localStorage.getItem('clientorganizationid');
      try {
        const url = `${utils.baseUrl}/api/expenses/delete/${deleteExpenseId}`;
        await axios.post(url, {
          expensesid: deleteExpenseId,
          clientorganizationid: clientorganizationid
        }, {
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
          <div className="flex flex-row items-center w-full space-x-2 mb-4">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-1 rounded-lg shadow-md">
              <p className="font-semibold text-base mr-2">Total Expenses:</p>
              <p className="font-bold text-lg text-red-600 dark:text-red-400">KES {totalexpenses}</p>
            </div>

            <button
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-2 rounded-lg shadow-md flex items-center"
              onClick={() => {
                setSelectedExpense(null);
                setExpenseShowModal(true);
              }}
            >
              <AiOutlinePlus className="text-lg md:mr-1" />
              <span className="hidden md:inline text-sm">Add Expense</span>
            </button>

            <button
              className="bg-green-600 hover:bg-green-700 transition text-white px-3 py-2 rounded-lg shadow-md flex items-center"
              onClick={handleImportExpenses}
            >
              <AiOutlineUpload className="text-lg md:mr-1" />
              <span className="hidden md:inline text-sm">Import Expenses</span>
            </button>

            <button
              className="bg-gray-300 hover:bg-gray-400 transition text-black px-3 py-2 rounded-lg shadow-md flex items-center"
              onClick={handleExportExpenses}
            >
              <AiOutlineDownload className="text-lg md:mr-1" />
              <span className="hidden md:inline text-sm">Export</span>
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search for expenses"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="px-4 py-2 text-left text-sm font-semibold min-w-[200px]">NAME</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">AMOUNT</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">PAID BY</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">STATUS</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold min-w-[250px]">NOTES</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold min-w-[150px]">CREATED ON</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold min-w-[150px]">MODIFIED ON</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">CREATED BY</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">MODIFIED BY</th>
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
                    modifiedon={expense.modifiedon}
                    createdbyusername={expense.createdbyusername}
                    modifiedbyusername={expense.modifiedbyusername}
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
            </div>
            <span className="text-gray-600 font-medium">
              Page {`${currentPage} - ${Math.ceil(totalItems / itemsPerPage)}`} of {totalItems}
            </span>
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
