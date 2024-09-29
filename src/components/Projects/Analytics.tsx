import React from 'react';

const Analytics: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 dark:text-gray-200">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-100 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold dark:text-gray-100">Project Expenditure vs Estimates</h3>
                    {/* Use chart library here, for example react-chartjs-2 */}
                </div>
                <div className="bg-green-100 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold dark:text-gray-100">Cost by Phase of Construction</h3>
                    {/* Add chart component */}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
