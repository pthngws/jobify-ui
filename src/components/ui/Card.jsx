import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;