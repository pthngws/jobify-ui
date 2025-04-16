import React from 'react';

   const Calendar = ({ value, onChange, disabled = false, className = '', ...props }) => {
     return (
       <input
         type="date"
         value={value}
         onChange={onChange}
         disabled={disabled}
         className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 transition-colors duration-300 text-base ${className}`}
         {...props}
       />
     );
   };

   export default Calendar;