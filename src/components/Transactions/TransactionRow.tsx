import React from "react";
import { TransactionRowProps } from "../../types";


const TransactionRow: React.FC<TransactionRowProps> = ({ name, amount, notes, paidby }) => {
    return (
        <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <td className="px-4 py-4 w-48">
                <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
            </td>
            <td className="px-4 py-4">
                <p>Ksh {amount}</p>
            </td>
            <td className="px-4 py-4">
                <p>{paidby}</p>
            </td>
            <td className="px-4 py-4">
                <p>{notes}</p>
            </td>
            <td className="px-4 py-4 flex space-x-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </td>
        </tr>
    );
};

export default TransactionRow;
