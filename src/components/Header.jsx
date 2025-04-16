import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDownIcon, BuildingOfficeIcon, BriefcaseIcon, HomeIcon, MagnifyingGlassIcon, UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { to: "/home", icon: HomeIcon, label: "Trang chủ" },
    { to: "/jobs", icon: MagnifyingGlassIcon, label: "Công việc" },
    ...(user && user.role === "recruit"
      ? [
          { to: "/post-job", icon: BriefcaseIcon, label: "Tạo việc làm" },
        ]
      : []),
  ];

  return (
    <header className="fixed top-0 w-full bg-white dark:bg-gray-800 shadow-md px-4 lg:px-6 py-2.5 z-50">
      <nav className="max-w-screen-xl mx-auto flex flex-wrap justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link to="/home" className="flex items-center">
            <img
              src="icon.png"
              className="mr-3 h-6 sm:h-9"
              alt="Jobify Logo"
            />
            <span className="text-2xl font-bold text-green-600 dark:text-green-400 cursor-pointer">
              Jobify
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          type="button"
          className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="mobile-menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>

        {/* Navigation Links & User Actions */}
        <div
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } w-full lg:flex lg:w-auto lg:items-center lg:order-1`}
          id="mobile-menu"
        >
          <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 lg:items-center">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="block py-2 pr-4 pl-3 text-gray-700 hover:text-green-700 lg:hover:bg-transparent lg:border-0 lg:hover:text-green-700 lg:p-0 dark:text-gray-200 lg:dark:hover:text-green-400 dark:hover:bg-gray-700 dark:hover:text-green-400 lg:dark:hover:bg-transparent transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    {label}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center lg:order-2">
          {user ? (
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-2 py-1 transition-colors duration-200"
                onClick={toggleDropdown}
              >
                <img
                  src={user.avatarUrl || "https://via.placeholder.com/40"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border-2 border-green-500 dark:border-green-400"
                />
                <span className="text-gray-700 dark:text-gray-200 font-medium text-sm">
                  {user.email || "Người dùng"}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-10 animate-[dropdown_0.2s_ease-out_forwards]">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-500 dark:hover:text-green-400 rounded-t-xl transition-colors duration-150"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Trang cá nhân
                    </Link>
                    {user.role === "recruit" && (
                      <>
                        <Link
                          to="/company"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-150"
                        >
                          <BuildingOfficeIcon className="w-4 h-4" />
                          Công ty
                        </Link>
                        <Link
                          to="/my-jobs"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-150"
                        >
                          <BriefcaseIcon className="w-4 h-4" />
                          Danh sách công việc
                        </Link>
                      </>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 dark:hover:text-red-400 rounded-b-xl transition-colors duration-150"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-gray-800 dark:text-gray-200 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 transition-colors duration-200"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800 transition-colors duration-200"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </nav>
      <style>
        {`
          @keyframes dropdown {
            to { scale: 1; opacity: 1; }
          }
        `}
      </style>
    </header>
  );
};

export default Header;