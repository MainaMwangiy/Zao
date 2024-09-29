import React, { useEffect, useState } from 'react';
import ChartComponent from '../Charts/Charts';
import { useSnackbar } from 'notistack';
import utils from '../utils';
import axios from 'axios';

const Analytics: React.FC = () => {
    const [data, setData] = useState([]);

    const { enqueueSnackbar } = useSnackbar();
    const fetchData = async () => {
        try {
            const url = `${utils.baseUrl}/api/expenses/analytics`;
            const response = await axios.post(url, {
                headers: { 'Content-Type': 'application/json' },
            });

            setData(response.data.data);
        } catch (error) {
            enqueueSnackbar("Expenses Loading Failed. Please try again.", { variant: "error" });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 dark:text-gray-200">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold dark:text-gray-100">Expenses Over Time</h3>
                    <ChartComponent
                        type="line"
                        data={data}
                        title="Expenses Over Time"
                        yLabel="Amount (KES)"
                        xLabel="Date"
                    />
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold dark:text-gray-100">Total Spent by User</h3>
                    <ChartComponent
                        type="pie"
                        data={data}
                        title="Total Spent by User"
                        yLabel="Amount"
                    />
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold dark:text-gray-100">Top 10 Highest Costs</h3>
                    <ChartComponent
                        type="bar"
                        data={data}
                        title="Top 10 Highest Costs"
                        yLabel="Amount (KES)"
                    />
                </div>
            </div>
        </div>
    );
};

export default Analytics;
