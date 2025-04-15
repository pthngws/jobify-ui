import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  isLoading = false,
  onClick,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full py-3 rounded-lg font-semibold text-lg transition duration-300';
  const variantClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800',
    secondary: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700',
  };
  const disabledClasses = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      {...props}
    >
      {isLoading ? 'Đang xử lý...' : children}
    </button>
  );
};

export default Button;