import React from "react";
import dayjs from "dayjs";
import { ExpenseRowProps } from "../../types";

const ExpenseRow: React.FC<ExpenseRowProps> = ({
    name,
    amount,
    status,
    notes,
    paidby,
    createdon,
    modifiedon,
    createdbyusername,
    modifiedbyusername,
    onEdit,
    onDelete,
}) => {
    return (
        <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <td className="px-4 py-4">
                <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
            </td>
            <td className="px-4 py-4">
                <p>Ksh {amount}</p>
            </td>
            <td className="px-4 py-4">
                <p>{paidby}</p>
            </td>
            <td className="px-4 py-4">
                <span
                    className={`px-2 py-1 rounded-full text-xs ${status?.toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"
                        }`}
                >
                    {status}
                </span>
            </td>
            <td className="px-4 py-4">
                <p>{notes}</p>
            </td>
            <td className="px-4 py-4">
                <p>{dayjs(createdon).format('DD-MMM-YYYY')}</p>
            </td>
            <td className="px-4 py-4">
                <p>{dayjs(modifiedon).format('DD-MMM-YYYY')}</p>
            </td>
            <td className="px-4 py-4">
                <p>{createdbyusername}</p>
            </td>
            <td className="px-4 py-4">
                <p>{modifiedbyusername}</p>
            </td>
            <td className="px-4 py-4 flex space-x-2">
                <button onClick={onEdit} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={onDelete} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </td>
        </tr>
    );
};

export default ExpenseRow;
