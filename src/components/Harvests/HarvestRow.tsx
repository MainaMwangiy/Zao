import React from "react";

interface HarvestRowProps {
    bags: number;
    amountsold: number;
    notes: string;
}

const HarvestRow: React.FC<HarvestRowProps> = ({ bags, amountsold, notes }) => {
    return (
        <tr className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
            <td className="px-4 py-4">
                <p className="font-semibold text-gray-900 dark:text-white">{bags} Bags</p>
            </td>
            <td className="px-4 py-4">
                <p>Ksh {amountsold}</p>
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

export default HarvestRow;
