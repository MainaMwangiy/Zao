import React from "react";
import { useNavigate } from "react-router-dom";

interface CardProps {
  id: string;
  title: string;
  addedBy: string;
  location: string;
  size: string;
  status: string;
  projectPlanIncluded: boolean;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  addedBy,
  location,
  size,
  status,
  projectPlanIncluded
}) => {
  const navigate = useNavigate();

  const handleOpenTracker = () => {
    navigate(`/projects/${id}`, {
      state: {
        id,
        title,
        addedBy,
        location,
        size,
        status,
        projectPlanIncluded,
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
      <img src="https://pbs.twimg.com/media/FxpaknVWAAISdeU.jpg" alt="Project" className="w-full rounded-lg mb-4" />
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">Added by: {addedBy}, {location}</p>
      <p>Size {size} acres</p>
      <p className="text-green-500 font-bold">{status}</p>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Project plan included:{" "}
        {projectPlanIncluded ? <span className="text-green-500">Yes</span> : <span className="text-red-500">No</span>}
      </p>
      <button
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleOpenTracker}
      >
        Open Tracker
      </button>
    </div>
  );
};

export default Card;
