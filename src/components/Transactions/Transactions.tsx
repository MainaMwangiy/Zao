import React, { useEffect, useState } from "react";
import utils from "../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import TransactionRow from "./TransactionRow";
import AddTransactionModal from "./AddTransactionModal";

interface TransactionProps {
    name: string;
    amount: string;
    notes: string;
    clientusername: string;
}

const Transactions: React.FC = () => {
    const [showTransactionModal, setTransactionShowModal] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [transactions, setTransactions] = useState<TransactionProps[]>([]);

    const fetchData = async () => {
        try {
            const url = `${utils.baseUrl}/api/transactions/list`;
            const response = await axios.post(url, {
                headers: { 'Content-Type': 'application/json' },
            });
            const transactionData = response.data.data;
            setTransactions(transactionData);
            localStorage.setItem('transactions', JSON.stringify(transactionData));
        } catch (error) {
            enqueueSnackbar("Transactions Loading Failed. Please try again.", { variant: "error" });
        }
    };

    useEffect(() => {
        fetchData();
    }, [showTransactionModal]);

    const uploadTransactionFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const url = `${utils.baseUrl}/api/import-transactions`;
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const analyzedData: TransactionProps[] = response.data;
                setTransactions(analyzedData);
            } else {
                alert('Error importing transactions');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload transactions');
        }
    };

    const handleImportTransactions = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv, .xlsx';

        fileInput.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files ? target.files[0] : null;
            if (file) {
                uploadTransactionFile(file);
            }
        };
        fileInput.click();
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">All Transactions</h1>
                <div className="flex items-center space-x-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setTransactionShowModal(true)}>
                        Add Transaction
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleImportTransactions}>
                        Import Transactions
                    </button>
                    <button className="bg-gray-200 text-black px-4 py-2 rounded">Export</button>
                </div>
            </div>

            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search for transactions"
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
                            <th className="px-4 py-2 text-left text-sm font-semibold">NOTES</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions &&
                            transactions.map((transaction, index) => (
                                <TransactionRow
                                    key={index}
                                    name={transaction.name}
                                    amount={transaction.amount}
                                    notes={transaction.notes}
                                    paidby={transaction.clientusername}
                                />
                            ))}
                    </tbody>
                </table>
                {showTransactionModal && (
                    <AddTransactionModal
                        showTransactionModal={showTransactionModal}
                        setTransactionShowModal={setTransactionShowModal}
                    />
                )}
            </div>
        </div>
    );
};

export default Transactions;
