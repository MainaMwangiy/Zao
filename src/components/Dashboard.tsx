import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Dashboard: React.FC = () => {
  const options = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Sales this week',
    },
    xAxis: {
      categories: ["01 Feb", "02 Feb", "03 Feb", "04 Feb", "05 Feb", "06 Feb", "07 Feb"],
    },
    yAxis: {
      title: {
        text: 'Revenue',
      },
    },
    series: [
      {
        name: 'Revenue',
        data: [6200, 6400, 6100, 6500, 6300, 6000, 6400],
        color: 'blue',
      },
      {
        name: 'Revenue (previous period)',
        data: [6600, 6700, 6400, 6800, 6600, 6400, 6700],
        color: 'orange',
      },
    ],
    plotOptions: {
      line: {
        fillOpacity: 0.5,
      },
    },
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Sales this week</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Dashboard;
