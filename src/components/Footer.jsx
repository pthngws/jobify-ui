// components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          © 2025 Jobify. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="#"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            Về chúng tôi
          </a>
          <a
            href="#"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            Liên hệ
          </a>
          <a
            href="#"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            Chính sách bảo mật
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;