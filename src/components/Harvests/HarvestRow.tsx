import dayjs from "dayjs";
import React from "react";
import { HarvestRowProps } from "../../types";

const HarvestRow: React.FC<HarvestRowProps> = ({ harvest, onEdit }) => {
    return (
        <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <td className="px-4 py-4">
                <p className="font-semibold text-gray-900 dark:text-white">{harvest.bags} Bags</p>
            </td>
            <td className="px-4 py-4">
                <p>Ksh {harvest.unitprice}</p>
            </td>
            <td className="px-4 py-4">
                <p>Ksh {harvest.amountsold}</p>
            </td>
            <td className="px-4 py-4">
                <p>{harvest.notes}</p>
            </td>
            <td className="px-4 py-4">
                <p>{dayjs(harvest.createdon).format('DD-MMM-YYYY')}</p>
            </td>
            <td className="px-4 py-4">
                <p>{dayjs(harvest.modifiedon).format('DD-MMM-YYYY')}</p>
            </td>
            <td className="px-4 py-4">
                <p>{harvest.createdbyusername}</p>
            </td>
            <td className="px-4 py-4">
                <p>{harvest.modifiedbyusername}</p>
            </td>
            <td className="px-4 py-4 flex space-x-2">
                <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={onEdit}
                >
                    Edit
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </td>
        </tr>
    );
};

export default HarvestRow;
