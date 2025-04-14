// components/JobCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-6 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <img
            src={job.companyAvatar || "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/logo_default.png"}
            alt={`${job.company} logo`}
            className="w-40 h-40 sm:w-40 sm:h-40 rounded-full border-2 border-green-600 dark:border-green-700 object-cover"
          />
        </div>

        {/* Job Info & Actions */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Job Info */}
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {job.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <BuildingOfficeIcon className="w-5 h-5 text-green-700" />
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <span className="font-medium">Công ty:</span> {job.company}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-green-700" />
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <span className="font-medium">Vị trí:</span> {job.location}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-green-700" />
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <span className="font-medium">Lương:</span> {job.salary}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-green-700" />
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <span className="font-medium">Loại công việc:</span> {job.type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-green-700" />
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <span className="font-medium">Ngày đăng:</span>{" "}
                  {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5 text-green-700" />
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <span className="font-medium">Hạn nộp:</span>{" "}
                  {new Date(job.closingDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-500 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-600 transition duration-200 font-semibold text-sm sm:text-base w-full sm:w-auto flex items-center gap-2"
            >
              <EyeIcon className="w-5 h-5 text-white" />
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;