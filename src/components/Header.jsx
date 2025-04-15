import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDownIcon, BuildingOfficeIcon, BriefcaseIcon } from "@heroicons/react/24/solid";
import { useFilter } from "../contexts/FilterContext";

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { filter, updateFilter } = useFilter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateFilter({ [name]: value });
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <h1
            className="text-2xl font-bold text-green-600 dark:text-green-400 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            Jobify
          </h1>
        </div>

        {/* Search Bar & Filters */}
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              name="keyword"
              value={filter.keyword}
              onChange={handleFilterChange}
              placeholder="Tìm kiếm công việc, công ty..."
              className="w-full sm:w-64 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 transition-colors duration-200"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              name="location"
              value={filter.location}
              onChange={handleFilterChange}
              className="w-full sm:w-48 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 transition-colors duration-200"
            >
              <option value="">Tất cả vị trí</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
            </select>
            <select
              name="type"
              value={filter.type}
              onChange={handleFilterChange}
              className="w-full sm:w-40 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 transition-colors duration-200"
            >
              <option value="">Tất cả loại</option>
              <option value="Toàn thời gian">Toàn thời gian</option>
              <option value="Bán thời gian">Bán thời gian</option>
            </select>
          </div>
        </div>

        {/* User Info & Dropdown */}
        {user ? (
          <div className="relative">
            <div
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-2 py-1 transition-colors duration-200"
              onClick={toggleDropdown}
            >
              {/* Avatar */}
              <img
                src={user.avatarUrl || "https://via.placeholder.com/40"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-green-500 dark:border-green-400"
              />
              {/* User Name */}
              <span className="text-gray-700 dark:text-gray-200 font-semibold text-sm">
                {user.email || "Người dùng"}
              </span>
              {/* Dropdown Arrow */}
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-10 transform origin-top-right transition-all duration-200 ease-out scale-95 opacity-0 animate-[dropdown_0.2s_ease-out_forwards]">
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
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
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-150"
                      >
                        <BuildingOfficeIcon className="w-4 h-4" />
                        Công ty
                      </Link>
                      <Link
                        to="/my-jobs"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-150"
                      >
                        <BriefcaseIcon className="w-4 h-4" />
                        Công việc của công ty
                      </Link>
                    </>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsDropdownOpen(false);
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
          <div className="flex gap-4">
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>

      {/* Animation Keyframes */}
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