import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts, { Options } from 'highcharts';
import dayjs from 'dayjs';

interface ChartComponentProps {
    type: 'line' | 'bar' | 'pie';
    data: { name: string; amount: number; createdon: string; clientusername: string }[];
    title: string;
    yLabel: string;
    xLabel?: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ type, data, title, yLabel, xLabel }) => {
    const sortedData = type === 'bar'
        ? [...data].sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, 10)
        : data;

    const seriesData = sortedData.map((item) => ({
        name: item.name,
        y: Number(item.amount),
        category: dayjs(item.createdon).format('DD-MM-YYYY'),
    }));
    let labelFormat;
    if (type === 'pie') {
        labelFormat = {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}'
        }
    } else if (type === 'bar') {
        labelFormat = {
            enabled: true,
            format: '{point.y}'
        }
    }

    const options: Options = {
        chart: {
            type: type,
        },
        title: {
            text: title,
        },
        xAxis: {
            categories: sortedData.map((item) => dayjs(item.createdon).format('DD-MM-YYYY')),
            title: {
                text: xLabel,
            },
        },
        yAxis: {
            title: {
                text: yLabel,
            },
        },
        series: [
            {
                data:
                    type === 'pie'
                        ? sortedData.reduce((acc: any[], item) => {
                            const foundIndex = acc.findIndex(
                                (d) => d.name === item.clientusername
                            );
                            if (foundIndex !== -1) {
                                acc[foundIndex].y += Number(item.amount);
                            } else {
                                acc.push({
                                    name: item.clientusername,
                                    y: Number(item.amount),
                                });
                            }
                            return acc;
                        }, [])
                        : seriesData,
                type: type,
                dataLabels: labelFormat
            },
        ],
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y}'
                },
            },
            bar: {
                dataLabels: {
                    enabled: true,
                    format: '{point.y}'
                },
            },
        },
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 600,
                    },
                    chartOptions: {
                        legend: {
                            enabled: false,
                        },
                    },
                },
            ],
        },
        credits: {
            enabled: false
        }
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default ChartComponent;
