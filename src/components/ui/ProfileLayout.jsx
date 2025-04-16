

import React from 'react';

const ProfileLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
