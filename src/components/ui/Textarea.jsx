import React from 'react';

const Textarea = ({
  id,
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  ...rest // <-- gom các prop như name, placeholder, minLength
}) => {
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
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 transition-colors duration-300 text-base ${className}`}
        {...rest} // <-- truyền phần còn lại ở đây
      />
    </div>
  );
};


export default Textarea;
