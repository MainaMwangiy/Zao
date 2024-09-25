import React, { useEffect, useState } from "react";
import HarvestRow from "./HarvestRow";
import utils from "../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import AddHarvestModal from "./AddHarvestModal";

interface HarvestProps {
    bags: number;
    amountsold: number;
    notes: string;
}

const Harvests: React.FC = () => {
    const [showHarvestModal, setHarvestShowModal] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [harvests, setHarvests] = useState<HarvestProps[]>([]);

    const fetchData = async () => {
        try {
            const url = `${utils.baseUrl}/api/harvests/list`;
            const response = await axios.post(url, {
                headers: { 'Content-Type': 'application/json' },
            });
            const harvestData = response.data.data;
            setHarvests(harvestData);
            localStorage.setItem('harvests', JSON.stringify(harvestData));
        } catch (error) {
            enqueueSnackbar("Harvests Loading Failed. Please try again.", { variant: "error" });
        }
    };

    useEffect(() => {
        fetchData();
    }, [showHarvestModal]);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">All Harvests</h1>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setHarvestShowModal(true)}
                >
                    Add Harvest
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-collapse">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="px-4 py-2 text-left text-sm font-semibold">BAGS</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold">AMOUNT SOLD</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold">NOTES</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {harvests && harvests.map((harvest, index) => (
                            <HarvestRow
                                key={index}
                                bags={harvest.bags}
                                amountsold={harvest.amountsold}
                                notes={harvest.notes}
                            />
                        ))}
                    </tbody>
                </table>
                {showHarvestModal && (
                    <AddHarvestModal
                        showHarvestModal={showHarvestModal}
                        setHarvestShowModal={setHarvestShowModal}
                    />
                )}
            </div>
        </div>
    );
};

export default Harvests;
