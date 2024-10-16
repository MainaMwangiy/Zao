import React, { useEffect, useState } from 'react';
import ChartComponent from '../Charts/Charts';
import { useSnackbar } from 'notistack';
import utils from '../../utils';
import axios from 'axios';

interface DataItem {
    name: string;
    amount: number;
    createdon: string;
    clientusername: string;
}
interface HarvestDataItem {
    bags: string;
    createdon: string;
    clientusername: string;
    amountsold: string;
}

const Analytics: React.FC = () => {
    const [data, setData] = useState<DataItem[]>([]);
    const [harvestData, setHarvestData] = useState<HarvestDataItem[]>([]);
    const clientorganizationid = localStorage.getItem('clientorganizationid') || "";

    const { enqueueSnackbar } = useSnackbar();
    const fetchData = async () => {
        try {
            const values = {
                clientorganizationid: clientorganizationid
            };
            const url = `${utils.baseUrl}/api/expenses/analytics`;
            const response = await axios.post(url, { values }, {
                headers: { 'Content-Type': 'application/json' },
            });

            setData(response.data.data);
        } catch (error) {
            enqueueSnackbar("Expenses Loading Failed. Please try again.", { variant: "error" });
        }
    };

    const fetchHarvestsData = async () => {
        try {
            const values = {
                clientorganizationid: clientorganizationid
            };
            const url = `${utils.baseUrl}/api/harvests/analytics`;
            const response = await axios.post(url, { values }, {
                headers: { 'Content-Type': 'application/json' },
            });
            setHarvestData(response.data.data);
        } catch (error) {
            enqueueSnackbar("Harvests Loading Failed. Please try again.", { variant: "error" });
        }
    };

    useEffect(() => {
        fetchData();
        fetchHarvestsData();
    }, []);

    const transformedHarvestData = harvestData.map((item) => ({
        name: item.clientusername,
        amount: Number(item.amountsold),
        createdon: item.createdon,
        clientusername: item.clientusername,
    }));

    return (
        <div className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 dark:text-gray-200">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartComponent
                    type="line"
                    data={data}
                    title="Expenses Over Time"
                    yLabel="Amount (KES)"
                    xLabel="Date"
                />
                <ChartComponent
                    type="pie"
                    data={data}
                    title="Total Spent by User"
                    yLabel="Amount"
                />
                <ChartComponent
                    type="bar"
                    data={data}
                    title="Top 10 Highest Costs"
                    yLabel="Amount (KES)"
                />
                <ChartComponent
                    type="line"
                    data={transformedHarvestData}
                    title="Earnings Over Time"
                    yLabel="Amount (KES)"
                    xLabel="Date"
                />
            </div>
        </div>
    );
};

export default Analytics;
