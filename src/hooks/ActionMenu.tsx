import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMore, AiOutlineEllipsis } from "react-icons/ai";
import { Pencil, Trash2 } from "lucide-react";
import utils from "../utils";
import { ModuleConfig } from "../types";

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  hideActionMenu?: boolean;
  config?: ModuleConfig;
  useNormalActions?: boolean;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onEdit, onDelete, hideActionMenu, config, useNormalActions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const customActions = useNormalActions || false;
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const customActionsDiv = () => {
    return (
      <div className="flex items-center space-x-2">
        {!(hideActionMenu || config?.hideActionMenu) && (
          <button
            onClick={onEdit}
            className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200"
            title="Edit"
          >
            <Pencil className="h-5 w-5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300" />
          </button>
        )}
        <button
          onClick={onDelete}
          className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-200"
          title="Delete"
        >
          <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300" />
        </button>
      </div>
    )
  }
  const normalActionsDiv = () => {
    return (
      <div ref={menuRef} className="relative inline-block text-left">
        <button
          onClick={toggleMenu}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
        >
          <div className="flex justify-end items-center">
            {
              !utils.isMobile ? (
                <AiOutlineEllipsis className="text-gray-600 dark:text-gray-300" size={20} />
              ) : (
                <AiOutlineMore className="text-gray-600 dark:text-gray-300" size={20} />
              )
            }
          </div>
        </button>
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-24 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                     shadow-lg rounded-lg z-10"
          >

            {(hideActionMenu || config?.hideActionMenu) &&
              <button
                onClick={() => {
                  onEdit();
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Edit
              </button>
            }
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    )
  }
  return (
    <React.Fragment>
      {customActions ? normalActionsDiv() : customActionsDiv()}
    </React.Fragment>
  );
};

export default ActionMenu;