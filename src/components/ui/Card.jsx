import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`mx-auto max-w-4xl w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
