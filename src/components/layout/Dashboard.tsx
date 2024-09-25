import React, { useEffect, useState } from "react";
import Card from "../common/Card";
import utils from "../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import AddProjectModal from "../Projects/AddProjectModal";
import { useNavigate } from "react-router-dom";

interface ProjectsProps {
  name: string;
  location: string;
  size: string;
  status: string;
  projectplan: boolean;
  imagesurl: string;
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectsProps[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [showProjectseModal, setProjectshowModal] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState<string>('');
  const [totalHarvestEarnings, setTotalHarvestEarnings] = useState<string>('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const url = `${utils.baseUrl}/api/projects/list`;
      const response = await axios.post(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      const projects = response.data.data;
      setProjects(projects)
      // enqueueSnackbar("Users Loading successful!", { variant: "success" });
      localStorage.setItem('projects', JSON.stringify(projects));
    } catch (error) {
      enqueueSnackbar("User Loading Failed. Please try again.", { variant: "error" });
    }
  }
  const fetchTotalExpenses = async () => {
    try {
      const url = `${utils.baseUrl}/api/expenses/total`;
      const response = await axios.post(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      const projects = response.data.data[0].totalexpenses;
      setTotalExpenses(projects)
    } catch (error) {
      enqueueSnackbar("Total Expenses Loading Failed. Please try again.", { variant: "error" });
    }
  }

  const fetchTotalEarningsFromHarvest = async () => {
    try {
      const url = `${utils.baseUrl}/api/harvests/totalharvestearnings`;
      const response = await axios.post(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      const projects = response.data.data[0].totalharvests;
      setTotalHarvestEarnings(projects)
    } catch (error) {
      enqueueSnackbar("Total Expenses Loading Failed. Please try again.", { variant: "error" });
    }
  }

  useEffect(() => {
    fetchData();
    fetchTotalExpenses();
    fetchTotalEarningsFromHarvest();
  }, [showProjectseModal])

  const isProjects = projects.length > 0;
  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 mt-2">
        {/* Welcome Message */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">Welcome Root!</h2>

          <div className="flex justify-between items-center mb-4">
            {/* Total Expenses Section */}
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Total Expenses</p>
              <p className="text-red-500 text-2xl font-semibold">
                KES {Number(totalExpenses) || 0}
              </p>
            </div>

            {/* Total Earnings Section */}
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
              <p className="text-green-500 text-2xl font-semibold">
                KES {Number(totalHarvestEarnings) || 0}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">Project Status: Ongoing</p>

          <div className="flex items-center mt-4">
            <button className="bg-red-500 text-white px-4 py-2 mr-2 rounded">
              Withdraw To Mpesa
            </button>
            <button
              onClick={() => navigate('/transactions')}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              View Transactions
            </button>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">My Recent Projects</h2>
          {isProjects && <p className="text-sm text-gray-600 dark:text-gray-400">{projects.length} projects available</p>}
          {!isProjects && <p className="text-sm text-gray-600 dark:text-gray-400">No ongoing projects available</p>}
          <button className="mt-4 bg-pink-500 text-white px-4 py-2 rounded" onClick={() => setProjectshowModal(true)}>Add Project</button>
        </div>
      </div>

      {/* Market Section */}
      <div className="my-6">
        <h2 className="text-xl font-bold mb-4">Projects</h2>

        {/* Responsive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Dynamically load cards from projectsData */}
          {projects.map((item, index) => (
            <Card
              key={index}
              title={item.name}
              addedBy={'Maina'}
              location={item.location}
              size={item.size}
              status={item.status}
              projectPlanIncluded={item.projectplan}
            />
          ))}
        </div>
      </div>
      {showProjectseModal && (
        <AddProjectModal
          showProjectseModal={showProjectseModal}
          setProjectshowModal={setProjectshowModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
