import React from 'react';
import { SummaryProps } from '../../types';

const Summary: React.FC<SummaryProps> = ({ projectData }) => {
    const totalexpenses = localStorage.getItem('totalexpenses');
    const estimatedCosts = Number(projectData.costprojectestimation || 0);
    const overdueValues = Number(totalexpenses) - estimatedCosts;
    const percentageIncrease = overdueValues / Number(totalexpenses) * 100;
    const imageSrc = projectData?.imagesurl ? projectData?.imagesurl : "https://nsra83gx72pwujdb.public.blob.vercel-storage.com/blob-2LLFFCrEiYgZ7ha8hV7zXIhbm5spC3";
    return (
        <div className="dark:bg-gray-800 dark:text-gray-200 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-1">
                    <div className="h-64 relative">
                        <img src={imageSrc} alt="Project" className="w-full h-full object-cover rounded-lg mb-4" />
                    </div>
                    <div className="dark:bg-gray-800 dark:text-gray-200 p-4 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-2">{projectData.projectname}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Location: {projectData.location}</p>
                        <p className="mt-2">Size: {projectData.size} acres</p>
                        <p className="text-green-500 font-bold mt-2">Status: {projectData.status}</p>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Project plan included:{" "}
                            {projectData.projectPlanIncluded ? (
                                <span className="text-green-500">Yes</span>
                            ) : (
                                <span className="text-red-500">No</span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-4">Key Cost Categories</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="border-b dark:border-gray-700">
                                        <th className="py-2 px-4 min-w-[150px]">Category</th>
                                        <th className="py-2 px-4 min-w-[150px]">Estimated</th>
                                        <th className="py-2 px-4 min-w-[150px]">Actual</th>
                                        <th className="py-2 px-4 min-w-[200px]">Costs Variance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-2 px-4">Costs</td>
                                        <td className="py-2 px-4">KES {estimatedCosts}</td>
                                        <td className="py-2 px-4">KES {totalexpenses}</td>
                                        <td className="py-2 px-4">KES {overdueValues} ({percentageIncrease.toFixed(2)}%)</td>
                                    </tr>
                                    {/* Add more rows as needed */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Summary;
