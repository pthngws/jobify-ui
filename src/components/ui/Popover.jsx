import React from 'react';

const Popover = ({ isOpen, onClose, children, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 z-10 ${className}`}
    >
      {children}
      <button
        onClick={onClose}
        className="text-green-600 dark:text-green-400 hover:underline mt-2"
      >
        Đóng
      </button>
    </div>
  );
};

export default Popover;