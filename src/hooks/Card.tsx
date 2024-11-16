import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import { FaEye, FaEyeSlash, FaEllipsisV, FaEllipsisH } from "react-icons/fa";

interface CardProps {
  id: string;
  title: string;
  addedBy: string;
  location: string;
  size: string;
  status: string;
  projectPlanIncluded: boolean;
  costProjectEstimation: string;
  imagesurl: string;
  name?: string;
  projectname?: string;
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
  projectPlanIncluded,
  costProjectEstimation,
  imagesurl,
  name,
  projectname,
}) => {
  const navigate = useNavigate();

  const gallery = localStorage.getItem("gallery");
  const images: BlobItem[] = gallery ? JSON.parse(gallery) : [];
  const [isExpensesVisible, setIsExpensesVisible] = useState(false);
  const [isEarningsVisible, setIsEarningsVisible] = useState(false);

  const toggleExpensesVisibility = () =>
    setIsExpensesVisible(!isExpensesVisible);
  const toggleEarningsVisibility = () =>
    setIsEarningsVisible(!isEarningsVisible);

  const formatPlaceholder = (value: number) => {
    return "*".repeat(value.toString().length);
  };

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
        costProjectEstimation,
        imagesurl,
        name,
        projectname,
      },
    });
  };

  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null); // Reference for the button

  // Click outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuVisible(false);
      }
    };

    // Add when the menu is visible
    if (menuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuVisible]); // Only re-run the effect if menuVisible changes

  const toggleMenu = () => {
    setMenuVisible(prev => !prev);
  };

  const deleteProject = () => {
    // Logic to delete the project
    console.log("Delete Project", id);
  };

  const editProject = () => {
    // Navigate to edit page or handle editing logic here
    console.log("Edit Project", id);
  };

  const imageSrc = imagesurl
    ? imagesurl
    : "https://nsra83gx72pwujdb.public.blob.vercel-storage.com/blob-2LLFFCrEiYgZ7ha8hV7zXIhbm5spC3";
  return (
    <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md flex flex-col">
      {/* Image Section */}
      <div className="w-full mb-4">
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
      </div>

      {/* Details Section */}
      <div className="flex flex-col md:flex-row">
        {/* Left Side Content */}
        <div className="md:flex-1">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Added by: {addedBy}, {location}
            </p>
            <p>Size {size} acres</p>
            <p
              className={`font-bold ${
                status === "active" ? "text-green-500" : "text-red-500"
              }`}
            >
              {status}
            </p>
            <p>
              Project plan included:{" "}
              <span
                className={
                  projectPlanIncluded ? "text-green-500" : "text-red-500"
                }
              >
                {projectPlanIncluded ? "Yes" : "No"}
              </span>
            </p>
            <button
              onClick={handleOpenTracker}
              className="bg-green-500 text-white px-4 py-2 rounded focus:outline-none mt-2"
            >
              Open Tracker
            </button>
          </div>
        </div>

        {/* Right Side Vertical Menu */}
        <div className=" md:ml-auto md:mt-0 mt-4 flex flex-col items-start">
          {/* Vertical Three-Dot Icon */}
       
          <div className="md:mt-0 mt-4 flex flex-col items-start ">
            <div className="flex justify-start" ref={buttonRef}>
              <FaEllipsisH
                onClick={toggleMenu}
                className="text-gray-600 dark:text-gray-400 text-2xl cursor-pointer"
              />
              {menuVisible && (
                <div
                  ref={menuRef}
                  className="bg-white shadow-lg rounded-lg mt-5 absolute top-auto"
                >
                  <button
                    onClick={editProject}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Edit
                  </button>
                  <button
                    onClick={deleteProject}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Total Expenses Section */}
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-400">Total Expenses</p>
            <div className="flex items-center">
              <p className="text-red-500 text-2xl font-semibold mr-2 font-mono">
                {isExpensesVisible ? `KES ${0}` : formatPlaceholder(0)}
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

          {/* Total Earnings Section */}
          <div className="mb-4 justify-end">
            <p className="text-gray-600 dark:text-gray-400">Total Earnings</p>
            <div className="flex items-center">
              <p className="text-green-500 text-2xl font-semibold mr-2 font-mono">
                {isEarningsVisible ? `KES ${0}` : formatPlaceholder(0)}
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
