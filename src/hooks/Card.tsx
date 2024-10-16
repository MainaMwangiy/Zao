import React from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";

interface CardProps {
  id: string;
  title: string;
  addedBy: string;
  location: string;
  size: string;
  status: string;
  projectPlanIncluded: boolean;
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
  status,
  projectPlanIncluded
}) => {
  const navigate = useNavigate();

  const gallery = localStorage.getItem("gallery");
  const images: BlobItem[] = gallery ? JSON.parse(gallery) : [];
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
      {images.length > 0 ? (
        <Carousel images={images} />
      ) : (
        <img
          src="https://nsra83gx72pwujdb.public.blob.vercel-storage.com/blob-2LLFFCrEiYgZ7ha8hV7zXIhbm5spC3"
          alt="Project"
          className="w-full rounded-lg mb-4"
          onClick={handleOpenTracker}
        />
      )}
      <h3 className="mt-2 text-lg font-semibold" onClick={handleOpenTracker}>{title}</h3>
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
