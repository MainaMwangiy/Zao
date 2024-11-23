import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ActionMenu from "./ActionMenu";
import utils from "../utils";
import axios from "axios";
import { useSnackbar } from "notistack";

interface CardProps {
  id: string;
  title: string;
  addedBy: string;
  location: string;
  size: string;
  projectstatus: string;
  projectPlanIncluded: string;
  costprojectestimation: string;
  imagesurl: string;
  name?: string;
  projectname?: string;
  onEdit: () => void;
  onDelete: () => void;
}

interface BlobItem {
  url: string;
  downloadUrl: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  addedBy,
  location,
  size,
  projectstatus,
  projectPlanIncluded,
  costprojectestimation,
  imagesurl,
  name,
  projectname,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const gallery = localStorage.getItem("gallery");
  const images: BlobItem[] = gallery ? JSON.parse(gallery) : [];
  const [isExpensesVisible, setIsExpensesVisible] = useState(false);
  const [isEarningsVisible, setIsEarningsVisible] = useState(false);
  const [expenses, setExpenses] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const clientorganizationid = localStorage.getItem('clientorganizationid') || "";

  const toggleExpensesVisibility = () =>
    setIsExpensesVisible(!isExpensesVisible);
  const toggleEarningsVisibility = () =>
    setIsEarningsVisible(!isEarningsVisible);

  const formatPlaceholder = (value: number | string | null | undefined) => {
    return value ? "*".repeat(value.toString().length) : "";
  };
  const fetchTotalExpenses = async () => {
    try {
      const values = {
        clientorganizationid: clientorganizationid,
        projectid: id
      }
      const url = `${utils.baseUrl}/api/expenses/total`;
      const response = await axios.post(url, values, {
        headers: { 'Content-Type': 'application/json' },
      });
      const projects = response.data.data[0].total;
      localStorage.setItem("totalexpenses", projects)
      setExpenses(projects)
    } catch (error) {
      enqueueSnackbar("Total Expenses Loading Failed. Please try again.", { variant: "error" });
    }
  }

  const fetchTotalEarningsFromHarvest = async () => {
    try {
      const values = {
        clientorganizationid: clientorganizationid,
        projectid: id
      }
      const url = `${utils.baseUrl}/api/harvests/totalharvestearnings`;
      const response = await axios.post(url, values, {
        headers: { 'Content-Type': 'application/json' },
      });
      const projects = response.data.data[0].total;
      setEarnings(projects)
    } catch (error) {
      enqueueSnackbar("Total Expenses Loading Failed. Please try again.", { variant: "error" });
    }
  }

  useEffect(() => {
    fetchTotalExpenses();
    fetchTotalEarningsFromHarvest();
  }, [])


  const handleOpenTracker = () => {
    navigate(`/projects/${id}`, {
      state: {
        id,
        title,
        addedBy,
        location,
        size,
        projectstatus,
        projectPlanIncluded,
        costprojectestimation,
        imagesurl,
        name,
        projectname
      },
    });
  };

  const imageSrc = imagesurl ? imagesurl : "https://nsra83gx72pwujdb.public.blob.vercel-storage.com/blob-2LLFFCrEiYgZ7ha8hV7zXIhbm5spC3";
  const isHavingProjectPlan = projectPlanIncluded === 'Yes';
  return (
    <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md flex flex-col">
      <div className="w-full mb-4">
        {images.length > 0 ? (
          <Carousel images={images} />
        ) : (
          <img
            src={imageSrc}
            alt="Project"
            className="w-full h-full object-cover rounded-lg mb-4"
            onClick={handleOpenTracker}
          />
        )}
      </div>
      <div className="flex">
        <div className="w-1/2 p-4">
          <div className="flex-1">
            <div>
              <h3 className="mt-2 text-lg font-semibold" onClick={handleOpenTracker}>{projectname}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Added by: {name}, {location}</p>
              <p>Size {size} acres</p>
              <p className="text-green-500 font-bold">{projectstatus}</p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Project plan included: <span className={isHavingProjectPlan ? "text-green-500" : "text-red-500"}>
                  {projectPlanIncluded}
                </span>
              </p>
              <button
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleOpenTracker}
              >
                Open Tracker
              </button>
            </div>
          </div>
        </div>
        <div className="w-1/2 p-4 flex flex-col">
          <div className="flex justify-end">
            <ActionMenu onEdit={onEdit} onDelete={() => onDelete()} />
          </div>
          <div className="mb-4 mt-4">
            <p className="text-gray-600 dark:text-gray-400">Total Expenses</p>
            <div className="flex items-center">
              <p className="text-red-500 text-2xl font-semibold mr-2 font-mono">
                {isExpensesVisible ? `KES ${expenses || 0}` : `KES ${formatPlaceholder(expenses || 0)}`}
              </p>
              <button
                onClick={toggleExpensesVisibility}
                className="focus:outline-none"
              >
                {isExpensesVisible ? (
                  <FaEyeSlash className="text-gray-600 dark:text-gray-400 text-xl" />
                ) : (
                  <FaEye className="text-gray-600 dark:text-gray-400 text-xl" />
                )}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400">Total Earnings</p>
            <div className="flex items-center">
              <p className="text-green-500 text-2xl font-semibold mr-2 font-mono">
                {isEarningsVisible ? `KES ${earnings || 0}` : `KES ${formatPlaceholder(earnings || 0)}`}
              </p>
              <button
                onClick={toggleEarningsVisibility}
                className="focus:outline-none"
              >
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
    </div>
  );
};

export default Card;
