import React, { useRef, useState } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const FileInput = ({
  id,
  label,
  accept,
  onChange,
  disabled = false,
  className = '',
}) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : '');
    if (onChange) onChange(e);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-base font-semibold text-gray-700 dark:text-gray-200 mb-2 text-left"
        >
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          ref={fileInputRef}
          className="hidden"
        />
        <div
          className={`flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 transition-colors duration-300 truncate ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          } ${className}`}
          onClick={handleClick}
        >
          <CloudArrowUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span>{fileName || 'Choose a file...'}</span>
        </div>
      
      </div>
    </div>
  );
};

export default FileInput;