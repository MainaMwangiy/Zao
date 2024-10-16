import React, { useEffect, useState } from "react";
import utils from "../../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import TransactionRow from "./TransactionRow";
import AddTransactionModal from "./AddTransactionModal";
import { AiOutlineDownload, AiOutlinePlus, AiOutlineUpload } from "react-icons/ai";
import Loader from "../../hooks/Loader";

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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const clientorganizationid = localStorage.getItem('clientorganizationid') || "";

    const fetchData = async () => {
        try {
            const values = {
                clientorganizationid
            };
            setIsLoading(true);
            const url = `${utils.baseUrl}/api/transactions/list`;
            const response = await axios.post(url, { values }, {
                headers: { 'Content-Type': 'application/json' },
            });
            const transactionData = response.data.data;
            setTransactions(transactionData);
            localStorage.setItem('transactions', JSON.stringify(transactionData));
        } catch (error) {
            enqueueSnackbar("Transactions Loading Failed. Please try again.", { variant: "error" });
        } finally {
            setIsLoading(false);
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
        <div className="container mx-auto px-2 py-6">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="flex flex-row items-center justify-between w-full mb-4 space-x-2">
                        <h1 className="text-2xl font-semibold w-full md:w-auto text-center md:text-left">All Transactions</h1>
                        <div className="flex flex-row items-center w-full md:w-auto space-x-2">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-2 rounded-lg shadow-md flex items-center"
                                onClick={() => setTransactionShowModal(true)}
                            >
                                <AiOutlinePlus className="text-lg md:mr-1" />
                                <span className="hidden md:inline text-sm">Add Transaction</span>
                            </button>
                            <button
                                className="bg-green-600 hover:bg-green-700 transition text-white px-3 py-2 rounded-lg shadow-md flex items-center"
                                onClick={handleImportTransactions}
                            >
                                <AiOutlineUpload className="text-lg md:mr-1" />
                                <span className="hidden md:inline text-sm">Import Transactions</span>
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 transition text-black px-3 py-2 rounded-lg shadow-md flex items-center"
                            >
                                <AiOutlineDownload className="text-lg md:mr-1" />
                                <span className="hidden md:inline text-sm">Export</span>
                            </button>
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
                                    <th className="px-4 py-2 text-left text-sm font-semiboldmin-w-[200px]">NAME</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">AMOUNT</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold">PAIDBY</th>
                                    <th className="px-4 py-2 text-left text-sm font-semiboldmin-w-[250px]">NOTES</th>
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
                </>
            )}
        </div>
    );
};

export default Transactions;
