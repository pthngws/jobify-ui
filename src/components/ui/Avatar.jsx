import React from 'react';

const Avatar = ({ src, alt, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-64 h-64', // New size to match your example
  };

  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover border-4 border-green-400 dark:border-green-700 ${sizeClasses[size]} ${className}`}
      />
    </div>
  );
};

export default Avatar;