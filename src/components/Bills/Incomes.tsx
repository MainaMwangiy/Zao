import React, { useEffect, useState } from 'react';
import utils from '../../utils';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { ClientConfig, Organization, Transaction } from '../../types';


const Incomes: React.FC = () => {
    const [investment, setInvestment] = useState(0);
    const [earnings, setEarnings] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [newTransaction, setNewTransaction] = useState<number | string>('');
    const [earningsPerUser, setEarningsPerUser] = useState(0);
    const { enqueueSnackbar } = useSnackbar();

    const usersString: string | null = localStorage.getItem('users');
    const clientuserid: string | null = localStorage.getItem('clientuserid');
    const clientorganizationid = localStorage.getItem('clientorganizationid') || "";

    const clientOrganizationsString = localStorage.getItem('clientorganizations');
    const Orgs: Organization[] = clientOrganizationsString ? JSON.parse(clientOrganizationsString) : [];
    const clientOrganizationIdString = localStorage.getItem('clientorganizationid') || "";
    const OrgId = clientOrganizationIdString ? parseInt(JSON.parse(clientOrganizationIdString)) : null;

    let clientConfig: ClientConfig = {};
    for (const org of Orgs) {
        if (org.clientorganizationid === OrgId) {
            clientConfig = org.appconfig;
        }
    }
    let users: any[] = [];
    if (usersString) {
        try {
            users = JSON.parse(usersString) as any[];
        } catch (error) {
            console.error('Error parsing users from localStorage', error);
        }
    }
    let clientusername: string = 'Unknown User';

    if (clientuserid) {
        const userIdAsNumber = Number(clientuserid);
        const loggedInUser: any | undefined = users.find(user => user.clientuserid === userIdAsNumber);
        if (loggedInUser?.name) {
            clientusername = loggedInUser.name || '';
        }
    }


    const handleAddTransaction = () => {
        const transactionValue = Number(newTransaction);
        if (!isNaN(transactionValue) && transactionValue > 0) {
            setTransactions([...transactions, { transactionid: Date.now(), amount: transactionValue, clientuserid: Number(clientuserid), notes: '', createdon: '', modifiedon: '', isdeleted: 0, name: '', recipientuserid: 0 }]);
            setInvestment((prevInvestment) => prevInvestment - transactionValue);
            setNewTransaction('');
        } else {
            alert('Please enter a valid transaction amount');
        }
    };
    const fetchTotalUserExpense = async () => {
        const values = {
            clientusername: clientusername,
            clientorganizationid: clientorganizationid
        }
        try {
            const url = `${utils.baseUrl}/api/expenses/total-expenses`;
            const response = await axios.post(url, values, {
                headers: { 'Content-Type': 'application/json' },
            });
            const investment = response.data.data[0].amount;
            setInvestment(investment)
        } catch (error) {
            enqueueSnackbar("Total Expenses Loading Failed. Please try again.", { variant: "error" });
        }
    }
    const fetchTotalUserEarnings = async () => {
        const values = {
            clientusername: clientusername,
            clientorganizationid: clientorganizationid
        }
        try {
            const url = `${utils.baseUrl}/api/harvests/totalharvestearnings`;
            const response = await axios.post(url, values, {
                headers: { 'Content-Type': 'application/json' },
            });
            const earnings = response.data.data[0].totalharvests;
            setEarnings(earnings)
        } catch (error) {
            enqueueSnackbar("Total Expenses Loading Failed. Please try again.", { variant: "error" });
        }
    }

    const fetchAllPaidTransactions = async () => {
        const values = {
            clientuserid: clientuserid,
            clientorganizationid: clientorganizationid
        }
        try {
            const url = `${utils.baseUrl}/api/transactions/allpaid`;
            const response = await axios.post(url, values, {
                headers: { 'Content-Type': 'application/json' },
            });
            const paidTotals = response.data.data;
            setTransactions(paidTotals)
        } catch (error) {
            enqueueSnackbar("Total Expenses Loading Failed. Please try again.", { variant: "error" });
        }
    }

    const fetchAllPaidTransactionsPerUser = async () => {
        const values = {
            clientuserid: clientuserid,
            clientorganizationid: clientorganizationid
        }
        try {
            const url = `${utils.baseUrl}/api/transactions/totalpaid`;
            const response = await axios.post(url, values, {
                headers: { 'Content-Type': 'application/json' },
            });
            const paidTotals = response.data.data[0].totalpaid;
            setEarningsPerUser(paidTotals)
        } catch (error) {
            enqueueSnackbar("Total Expenses Loading Failed. Please try again.", { variant: "error" });
        }
    }

    useEffect(() => {
        fetchTotalUserEarnings();
        fetchTotalUserExpense();
        fetchAllPaidTransactions();
        fetchAllPaidTransactionsPerUser();
    }, [])

    return (
        <div className="p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
            <div className="container mx-auto p-2">

                {/* Initial Investment Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
                    <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold">Total Expenses</h2>
                    <p className="text-red-500 text-3xl font-bold mt-2">
                        {/* KES {investment.toLocaleString()} */}
                        KES {investment}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This is your initial investment, and the remaining amount is being tracked.</p>
                </div>

                {/* Remaining Balance Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
                    <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold">Remaining Balances</h2>
                    <p className="text-blue-500 text-3xl font-bold mt-2">  {/* Changed color to blue */}
                        {/* KES {investment.toLocaleString()} */}
                        KES -{investment - earningsPerUser}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This is the remaining balance from  your initial investment, and the remaining amount is being tracked.</p>
                </div>

                {/* Earnings Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4">
                    <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold">Total Earnings</h2>
                    <p className="text-green-500 text-3xl font-bold mt-2">
                        {/* KES {earnings.toLocaleString()} */}
                        KES +{earningsPerUser}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">These are your individual earnings so far.</p>
                </div>

                {/* Transaction List */}
                {clientConfig?.showTransactions &&
                    < div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-gray-700 dark:text-gray-300 text-lg font-bold">Transactions</h2>
                        <ul className="mt-4 space-y-2">
                            {transactions.length > 0 ? (
                                transactions.map((transaction, index) => (
                                    <li key={index} className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <div className="text-left">
                                            <span className="block text-gray-600 dark:text-gray-300 font-bold">
                                                {transaction.name}
                                            </span>
                                            <span className="block text-gray-500 dark:text-gray-400 text-sm">
                                                Notes: {transaction.notes}
                                            </span>
                                        </div>
                                        <span className="text-gray-600 dark:text-gray-300">KES {transaction.amount}</span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No transactions added yet.</p>
                            )}
                        </ul>
                    </div>
                }
            </div>
        </div >
    );
};

export default Incomes;
