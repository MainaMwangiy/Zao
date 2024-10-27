import React, { useEffect, useState } from "react";
import HarvestRow from "./HarvestRow";
import utils from "../../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import AddHarvestModal from "./AddHarvestModal";
import { AiOutlinePlus } from "react-icons/ai";
import Loader from "../../hooks/Loader";
import { HarvestProps, HarvestsProjectProps } from "../../types";
import ConfirmationDialog from "../../hooks/ConfirmationDialog";

const Harvests: React.FC<HarvestsProjectProps> = ({ projectData, isProject }) => {
    const [showHarvestModal, setHarvestShowModal] = useState(false);
    const [selectedHarvest, setSelectedHarvest] = useState<HarvestProps | null>(null);
    const { enqueueSnackbar } = useSnackbar();
    const [harvests, setHarvests] = useState<HarvestProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deleteHarvestId, setDeleteHarvestId] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const projectid = projectData?.id || 0;

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const clientorganizationid = localStorage.getItem('clientorganizationid') || "";
            const values = {
                clientorganizationid,
                projectid: isProject ? projectid : undefined
            };
            const url = `${utils.baseUrl}/api/harvests/list`;
            const response = await axios.post(url, { values }, {
                headers: { 'Content-Type': 'application/json' },
            });
            const harvestData = response.data.data;
            setHarvests(harvestData);
            localStorage.setItem('harvests', JSON.stringify(harvestData));
        } catch (error) {
            enqueueSnackbar("Harvests Loading Failed. Please try again.", { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [showHarvestModal]);

    const handleEditHarvest = (harvest: HarvestProps) => {
        setSelectedHarvest(harvest);
        setHarvestShowModal(true);
    };

    const handleDeleteHarvest = (harvestId: string) => {
        setDeleteHarvestId(harvestId);
        setShowDeleteDialog(true);
    };

    const confirmDeleteHarvest = async () => {
        if (deleteHarvestId) {
            const clientorganizationid = localStorage.getItem('clientorganizationid');
            try {
                const url = `${utils.baseUrl}/api/harvests/delete/${deleteHarvestId}`;
                await axios.post(url, {
                    harvestsid: deleteHarvestId,
                    clientorganizationid: clientorganizationid
                }, {
                    headers: { 'Content-Type': 'application/json' },
                });
                enqueueSnackbar("Harvest deleted successfully.", { variant: "success" });
                setHarvests(harvests.filter(harvest => harvest.harvestid !== deleteHarvestId));
            } catch (error) {
                enqueueSnackbar("Failed to delete harvest. Please try again.", { variant: "error" });
            } finally {
                setShowDeleteDialog(false);
                setDeleteHarvestId(null);
            }
        }
    };


    return (
        <div className="container mx-auto px-2 py-6">
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-semibold">All Harvests</h1>
                        {isProject &&
                            <button
                                className="bg-blue-500 hover:bg-blue-700 transition text-white px-4 py-2 rounded-lg shadow-md flex items-center"
                                onClick={() => {
                                    setSelectedHarvest(null);
                                    setHarvestShowModal(true);
                                }}
                            >
                                <AiOutlinePlus className="text-lg md:mr-1" />
                                <span className="hidden md:inline text-sm">Add Harvest</span>
                            </button>
                        }
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-collapse">
                            <thead>
                                <tr className="border-b dark:border-gray-700">
                                    <th className="px-4 py-2 text-left text-sm font-semibold min-w-[150px]">BAGS</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold min-w-[150px]">UNIT PRICE</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold min-w-[150px]">AMOUNT SOLD</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold min-w-[300px]">NOTES</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold min-w-[250px]">CREATED ON</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold min-w-[250px]">MODIFIED ON</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold min-w-[150px]">CREATED BY</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold min-w-[150px]">MODIFIED BY</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold min-w-[150px]">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {harvests && harvests.map((harvest) => (
                                    <HarvestRow
                                        key={harvest.harvestid}
                                        harvest={harvest}
                                        onEdit={() => handleEditHarvest(harvest)}
                                        onDelete={() => handleDeleteHarvest(harvest.harvestid)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {showHarvestModal && (
                        <AddHarvestModal
                            showHarvestModal={showHarvestModal}
                            setHarvestShowModal={setHarvestShowModal}
                            harvest={selectedHarvest}
                            projectid={projectid}
                        />
                    )}
                    {showDeleteDialog && (
                        <ConfirmationDialog
                            open={showDeleteDialog}
                            title="Confirm Deletion"
                            content="Are you sure you want to delete this Harvest?"
                            onCancel={() => setShowDeleteDialog(false)}
                            onConfirm={confirmDeleteHarvest}
                            confirmDiscard={"Delete"}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Harvests;
