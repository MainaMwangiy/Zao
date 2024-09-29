import React, { useEffect, useState } from "react";
import ExpenseRow from "./ExpenseRow";
import utils from "../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import AddExpenseModal from "./AddExpenseModal";

interface ExpensesProps {
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


  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">All Expenses</h1>
        <div className="flex items-center space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setExpenseShowModal(true)}>Add Expense</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleImportExpenses()}  >   Import Expenses  </button>
          <button className="bg-gray-200 text-black px-4 py-2 rounded">Export</button>
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
            {expenses && expenses.map((expense, index) => (
              <ExpenseRow
                key={index}
                name={expense.name}
                amount={expense.amount}
                status={expense.status}
                notes={expense.notes}
                paidby={expense.clientusername}
                createdon={expense.createdon}
              />
            ))}
          </tbody>

        </table>
        {showExpenseModal && (
          <AddExpenseModal
            showExpenseModal={showExpenseModal}
            setExpenseShowModal={setExpenseShowModal}
          />
        )}
      </div>
    </div>
  );
};

export default Expenses;
