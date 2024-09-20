import React from "react";
import Card from "./common/Card";

const Dashboard: React.FC = () => {
  const projectsData = [
    {
      title: "Mashuru Capsicum Phase I",
      addedBy: "Maina",
      location: "Mashuru, Kenya",
      price: 1497,
      size: "3 acres",
      status: "Ongoing",
      projectPlanIncluded: true,
    },
    {
      title: "Nyeri French Beans",
      addedBy: "Dominic",
      location: "Nyeri, Kenya",
      price: 199,
      size: "5 acres",
      status: "Not Started",
      projectPlanIncluded: false,
    },
    {
      title: "Kiambu Cabbage Phase II",
      addedBy: "Maiko",
      location: "Kiambu, Kenya",
      price: 149,
      size: "6.25 acrea",
      status: "Not Started",
      projectPlanIncluded: false,
    },
    {
      title: "Tomato Phase I",
      addedBy: "Maiko",
      location: "Imaroro, Kenya",
      price: 149,
      size: "20 acrea",
      status: "Not Started",
      projectPlanIncluded: false,
    }
  ];

  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 mt-2">
        {/* Welcome Message */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Welcome Root!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">My Earnings</p>
          <p className="text-red-500 text-2xl font-semibold">KES 0.00</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Settlement Number NA</p>
          <div className="flex items-center mt-4">
            <button className="bg-red-500 text-white px-4 py-2 mr-2 rounded">Withdraw To Mpesa</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">View Transactions</button>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">My Recent Projects</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">No ongoing projects available</p>
          <button className="mt-4 bg-pink-500 text-white px-4 py-2 rounded">Add Project</button>
        </div>
      </div>

      {/* Market Section */}
      <div className="my-6">
        <h2 className="text-xl font-bold mb-4">Projects</h2>

        {/* Responsive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Dynamically load cards from projectsData */}
          {projectsData.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              addedBy={item.addedBy}
              location={item.location}
              price={item.price}
              size={item.size}
              status={item.status}
              projectPlanIncluded={item.projectPlanIncluded}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
