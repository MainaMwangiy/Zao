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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">All Expenses</h1>
        <div className="flex items-center space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setExpenseShowModal(true)}>Add Expense</button>
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
              <th className="px-4 py-2 text-left text-sm font-semibold">STATUS</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">NOTES</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <ExpenseRow
                key={index}
                name={expense.name}
                amount={expense.amount}
                status={expense.status}
                notes={expense.notes}
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
