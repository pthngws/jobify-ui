/** @type {import('tailwindcss').Config} */
export const darkMode = 'class';
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {
    keyframes: {
      'slide-in-right': {
        '0%': { opacity: 0, transform: 'translateX(100%)' },
        '100%': { opacity: 1, transform: 'translateX(0)' },
      },
      'slide-out-right': {
        '0%': { opacity: 1, transform: 'translateX(0)' },
        '100%': { opacity: 0, transform: 'translateX(100%)' },
      },
    },
    animation: {
      'slide-in-right': 'slide-in-right 0.4s ease-out',
      'slide-out-right': 'slide-out-right 0.4s ease-in',
    },
  },
};
