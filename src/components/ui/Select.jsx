import React from 'react';

const Select = ({
  id,
  label,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  className = '',
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-base font-semibold text-gray-700 dark:text-gray-200 mb-2 text-left"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 transition-colors duration-300 text-base ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;