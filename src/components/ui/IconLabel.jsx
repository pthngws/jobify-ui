import React from 'react';

const IconLabel = ({ icon, label, htmlFor, className = '' }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`w-28 text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center ${className}`}
    >
      {icon}
      {label}
    </label>
  );
};

export default IconLabel;