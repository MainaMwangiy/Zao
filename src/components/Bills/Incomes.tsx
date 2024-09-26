import React, { useEffect, useState } from 'react';
import utils from '../utils';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const Incomes: React.FC = () => {
    const [investment, setInvestment] = useState(0);
    const [earnings, setEarnings] = useState(0);
    const [transactions, setTransactions] = useState<number[]>([]);
    const [newTransaction, setNewTransaction] = useState<number | string>('');
    const { enqueueSnackbar } = useSnackbar();

    const handleAddTransaction = () => {
        const transactionValue = Number(newTransaction);
        if (!isNaN(transactionValue) && transactionValue > 0) {
            setTransactions([...transactions, transactionValue]);
            setInvestment((prevInvestment) => prevInvestment - transactionValue);
            setNewTransaction('');
        } else {
            alert('Please enter a valid transaction amount');
        }
    };
    const fetchTotalUserExpense = async () => {
        try {
            const url = `${utils.baseUrl}/api/expenses/total-expenses`;
            const response = await axios.post(url, { clientusername: 'Charles' }, {
                headers: { 'Content-Type': 'application/json' },
            });
            const investment = response.data.data[0].amount;
            setInvestment(investment)
        } catch (error) {
            enqueueSnackbar("Total Expenses Loading Failed. Please try again.", { variant: "error" });
        }
    }
    const fetchTotalUserEarnings = async () => {
        try {
            const url = `${utils.baseUrl}/api/harvests/totalharvestearnings`;
            const response = await axios.post(url, {
                headers: { 'Content-Type': 'application/json' },
            });
            const earnings = response.data.data[0].totalharvests;
            setEarnings(earnings)
        } catch (error) {
            enqueueSnackbar("Total Expenses Loading Failed. Please try again.", { variant: "error" });
        }
    }
    useEffect(() => {
        fetchTotalUserExpense();
        fetchTotalUserEarnings();
    }, [])

    return (
        <div className="p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
            <div className="container mx-auto p-4">

                {/* Initial Investment Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
                    <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold">Total Expenses</h2>
                    <p className="text-red-500 text-3xl font-bold mt-2">
                        {/* KES {investment.toLocaleString()} */}
                        KES {investment}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This is your initial investment, and the remaining amount is being tracked.</p>
                </div>

                {/* Earnings Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
                    <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold">Total Earnings</h2>
                    <p className="text-green-500 text-3xl font-bold mt-2">
                        {/* KES {earnings.toLocaleString()} */}
                        KES {earnings}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">These are your individual earnings so far.</p>
                </div>

                {/* Transaction List */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold">Transactions</h2>
                    <ul className="mt-4 space-y-2">
                        {transactions.length > 0 ? (
                            transactions.map((transaction, index) => (
                                <li key={index} className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-300">Transaction {index + 1}</span>
                                    <span className="text-gray-600 dark:text-gray-300">KES {transaction.toLocaleString()}</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No transactions added yet.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Incomes;
