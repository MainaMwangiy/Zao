import React, { useEffect, useState } from "react";
import Card from "../../hooks/Card";
import utils from "../../utils";
import axios from "axios";
import { useSnackbar } from "notistack";
import AddProjectModal from "../Projects/AddProjectModal";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ListResponse, Organization, ProjectsProps, ClientConfig } from "../../types";
import ConfirmationDialog from "../../hooks/ConfirmationDialog";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectsProps[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const [showProjectseModal, setProjectshowModal] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState<string>('');
  const [totalHarvestEarnings, setTotalHarvestEarnings] = useState<string>('');
  const clientuserString = localStorage.getItem('clientuser');
  const clientuser = clientuserString ? JSON.parse(clientuserString) : null;
  const [isExpensesVisible, setIsExpensesVisible] = useState<boolean>(false);
  const [isEarningsVisible, setIsEarningsVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const clientorganizationid = localStorage.getItem('clientorganizationid') || "";
  const clientusers = localStorage.getItem('clientuser') || '';
  const user = JSON.parse(clientusers);
  const clientOrganizationsString = localStorage.getItem('clientorganizations');
  const Orgs: Organization[] = clientOrganizationsString ? JSON.parse(clientOrganizationsString) : [];
  const clientOrganizationIdString = localStorage.getItem('clientorganizationid') || "";
  const OrgId = clientOrganizationIdString ? parseInt(JSON.parse(clientOrganizationIdString)) : null;
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState('');

  let clientConfig: ClientConfig = {};
  for (const org of Orgs) {
    if (org.clientorganizationid === OrgId) {
      clientConfig = org.appconfig;
    }
  }

  const toggleExpensesVisibility = () => {
    setIsExpensesVisible(!isExpensesVisible);
  };

  const toggleEarningsVisibility = () => {
    setIsEarningsVisible(!isEarningsVisible);
  };

  const formatPlaceholder = (value: number) => {
    return '*'.repeat(value.toString().length);
  };

  const fetchData = async () => {
    try {
      const values = {
        clientorganizationid: clientorganizationid
      }
      const url = `${utils.baseUrl}/api/projects/list`;
      const response = await axios.post(url, values, {
        headers: { 'Content-Type': 'application/json' },
      });
      const projects = response.data.data;
      setProjects(projects)
      localStorage.setItem('projects', JSON.stringify(projects));
    } catch (error) {
      enqueueSnackbar("User Loading Failed. Please try again.", { variant: "error" });
    }
  }
  const fetchTotalExpenses = async () => {
    try {
      const values = {
        clientorganizationid: clientorganizationid
      }
      const url = `${utils.baseUrl}/api/expenses/total`;
      const response = await axios.post(url, values, {
        headers: { 'Content-Type': 'application/json' },
      });
      const projects = response.data.data[0].total;
      localStorage.setItem("totalexpenses", projects)
      setTotalExpenses(projects)
    } catch (error) {
      enqueueSnackbar("Total Expenses Loading Failed. Please try again.", { variant: "error" });
    }
  }

  const fetchTotalEarningsFromHarvest = async () => {
    try {
      const values = {
        clientorganizationid: clientorganizationid
      }
      const url = `${utils.baseUrl}/api/harvests/totalharvestearnings`;
      const response = await axios.post(url, values, {
        headers: { 'Content-Type': 'application/json' },
      });
      const projects = response.data.data[0].total;
      setTotalHarvestEarnings(projects)
    } catch (error) {
      enqueueSnackbar("Total Expenses Loading Failed. Please try again.", { variant: "error" });
    }
  }
  const fetchUsersData = async () => {
    try {
      const values = {
        clientorganizationid: clientorganizationid,
        roleid: user?.roleid
      }
      const url = `${utils.baseUrl}/api/auth/list-strict`;
      const response = await axios.post(url, values, {
        headers: { 'Content-Type': 'application/json' }
      });
      const users = response.data.data;
      localStorage.setItem('users', JSON.stringify(users))
    } catch (error) {
      enqueueSnackbar("User loading failed. Please try again.", { variant: "error" });
    }
  };

  const fetchImages = async () => {
    try {
      const values = {
        clientConfig: clientConfig
      }
      const response = await axios.post<ListResponse>(`${utils.baseUrl}/api/upload/list`, values, {
        headers: { 'Content-Type': 'application/json' },
      });
      const result = response?.data?.data?.data || [];
      localStorage.setItem('gallery', JSON.stringify(result))
    } catch (error) {
      console.error('Error fetching images:', error);
      enqueueSnackbar("Image loading failed. Please try again.", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchData();
    fetchTotalExpenses();
    fetchTotalEarningsFromHarvest();
    fetchUsersData();
    fetchImages();
  }, [showProjectseModal])

  const handleDeleteProject = async () => {
    if (deleteProjectId) {
      try {
        const url = `${utils.baseUrl}/api/projects/delete/${deleteProjectId}`;
        await axios.post(url, {
          projectid: deleteProjectId,
          clientorganizationid: clientorganizationid
        }, {
          headers: { 'Content-Type': 'application/json' },
        });
        enqueueSnackbar("Project deleted successfully", { variant: "success" });
        setShowDeleteDialog(false);
        setDeleteProjectId(null);
        fetchData();
      } catch (error) {
        enqueueSnackbar("Failed to delete project", { variant: "error" });
      }
    }
  };

  const handleDeleteClick = (projectId: number) => {
    setDeleteProjectId(projectId);
    setShowDeleteDialog(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setProjectshowModal(true);
    setMode('edit');
  };
  const isProjects = projects.length > 0;
  return (
    <div className="p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 mt-2">
        {/* Welcome Message */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2"> Welcome {clientuser ? clientuser.name : 'Guest'}!</h2>

          <div className="flex justify-between items-center mb-4 space-x-8">
            {/* Total Expenses Section */}
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Total Expenses</p>
                <div className="flex items-center">
                  <p className="text-red-500 text-2xl font-semibold mr-2 font-mono">
                    {isExpensesVisible ? `KES ${Number(totalExpenses) || 0}` : `KES ${formatPlaceholder(Number(totalExpenses) || 0)}`}
                  </p>
                  <button onClick={toggleExpensesVisibility} className="focus:outline-none">
                    {isExpensesVisible ? (
                      <FaEyeSlash className="text-gray-600 dark:text-gray-400 text-xl" />
                    ) : (
                      <FaEye className="text-gray-600 dark:text-gray-400 text-xl" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Total Earnings Section */}
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
                <div className="flex items-center">
                  <p className="text-green-500 text-2xl font-semibold mr-2 font-mono">
                    {isEarningsVisible ? `KES ${Number(totalHarvestEarnings) || 0}` : `KES ${formatPlaceholder(Number(totalHarvestEarnings) || 0)}`}
                  </p>
                  <button onClick={toggleEarningsVisibility} className="focus:outline-none">
                    {isEarningsVisible ? (
                      <FaEyeSlash className="text-gray-600 dark:text-gray-400 text-xl" />
                    ) : (
                      <FaEye className="text-gray-600 dark:text-gray-400 text-xl" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">Project Status: Ongoing</p>

          <div className="flex items-center mt-4">
            {/* <button className="bg-red-500 text-white px-2 py-2 mr-2 rounded">
              Withdraw To Mpesa
            </button> */}
            {clientConfig?.showTransactions &&
              <button
                onClick={() => navigate('/transactions')}
                className="bg-blue-500 text-white px-2 py-2 rounded"
              >
                View Transactions
              </button>
            }
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-2">My Recent Projects</h2>
          {isProjects && <p className="text-sm text-gray-600 dark:text-gray-400">{projects.length} projects available</p>}
          {!isProjects && <p className="text-sm text-gray-600 dark:text-gray-400">No ongoing projects available</p>}
          <button className="mt-4 bg-pink-500 text-white px-2 py-2 rounded" onClick={() => setProjectshowModal(true)}>Add Project</button>
        </div>
      </div>

      {/* Market Section */}
      <div className="my-6">
        <h2 className="text-xl font-bold mb-4">Projects</h2>

        {/* Responsive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {/* Dynamically load cards from projectsData */}
          {projects.map((item, index) => (
            <Card
              key={index}
              id={item.projectid}
              title={item.name}
              addedBy={user?.name}
              location={item?.location}
              size={item.size}
              projectstatus={item.projectstatus}
              projectPlanIncluded={item.projectplan}
              costprojectestimation={item.costprojectestimation}
              imagesurl={item?.imagesurl}
              name={item?.name}
              projectname={item?.projectname}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDeleteClick(Number(item.projectid))}
            />
          ))}
        </div>
      </div>
      {showProjectseModal && (
        <AddProjectModal
          showProjectseModal={showProjectseModal}
          setProjectshowModal={setProjectshowModal}
          selectedItem={selectedItem}
          mode={mode}
        />
      )}
      {showDeleteDialog && (
        <ConfirmationDialog
          open={showDeleteDialog}
          title="Confirm Deletion"
          content="Are you sure you want to delete this project?"
          onCancel={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteProject}
          confirmDiscard="Delete"
        />
      )}
    </div>
  );
};

export default Dashboard;
