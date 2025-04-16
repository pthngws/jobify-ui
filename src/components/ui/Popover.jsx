import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const Popover = ({ isOpen, onClose, children, className = '' }) => {
  if (!isOpen) return null;

  // Animation for fade-in and scale
  const fadeInScaleAnimation = `
    @keyframes fadeInScale {
      0% { opacity: 0; transform: scale(0.95); }
      100% { opacity: 1; transform: scale(1); }
    }
    .animate-fade-in-scale {
      animation: fadeInScale 0.2s ease-out;
    }
  `;

  return (
    <>
      {/* Inject animation styles */}
      <style>{fadeInScaleAnimation}</style>
      <div
        className={`absolute top-0 right-0 bg-white/95 dark:bg-gray-800/95 rounded-xl shadow-xl border border-gray-300 dark:border-gray-600 p-4 z-10 transition-all duration-200 hover:shadow-2xl animate-fade-in-scale ${className}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-150"
            aria-label="Close popover"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
          {/* Content */}
          <div className="pr-6 text-gray-800 dark:text-gray-100">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Popover;