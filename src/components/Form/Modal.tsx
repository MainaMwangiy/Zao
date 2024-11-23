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
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-40 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full shadow-xl" {...rest}>
        {mainTitle && <div className="text-lg font-bold mb-4">{mainTitle}</div>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
