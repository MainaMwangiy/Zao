import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps & { [key: string]: any }> = ({ isOpen, onClose, title, children, ...rest }) => {
  if (!isOpen) return null;
  let mainTitle = title || "";
  if (React.isValidElement(children) && children.props) {
    const { config, mode } = children.props;
    mainTitle = mode === 'edit' ? `Edit ${config?.keyField}` : `Add ${config?.keyField}`;
  }
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
        {mainTitle && (
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{mainTitle}</h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
