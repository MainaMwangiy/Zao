import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { ModuleConfig } from "../types";

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  hideActionMenu?: boolean;
  config?: ModuleConfig;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onEdit, onDelete, hideActionMenu, config }) => {
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
  );
};

export default ActionMenu;