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
} from "@heroicons/react/24/outline";

const JobCard = ({ job, userRole, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-6 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <img
            src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/logo_default.png" // Giảm kích thước logo để tiết kiệm không gian
            alt={`${job.company} logo`}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-green-600 dark:border-green-400 object-cover"
          />
        </div>

        {/* Job Info & Actions */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Job Info */}
          <div className="flex-1">
            <h3
              onClick={() => navigate(`/job/${job.id}`)}
              className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 cursor-pointer"
            >
              {job.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <BuildingOfficeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <span className="font-medium">Công ty:</span> {job.company}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <span className="font-medium">Vị trí:</span> {job.location}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <span className="font-medium">Lương:</span> {job.salary}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <span className="font-medium">Loại công việc:</span> {job.type}
                </p>
              </div>
              {/* Thông tin bổ sung */}
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <span className="font-medium">Ngày đăng:</span>{" "}
                  {job.postedDate || "01/04/2025"} {/* Giả lập ngày đăng */}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  <span className="font-medium">Hạn nộp:</span>{" "}
                  {job.deadline || "15/04/2025"} {/* Giả lập hạn nộp */}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => navigate(`/job/${job.id}`)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-800 transition duration-200 font-semibold text-sm sm:text-base w-full sm:w-auto"
            >
              Xem chi tiết
            </button>
            {userRole === "applicant" ? (
              <button
                onClick={() => navigate(`/job/${job.id}`)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition duration-200 font-semibold text-sm sm:text-base w-full sm:w-auto"
              >
                Ứng tuyển
              </button>
            ) : (
              <>
                <button
                  onClick={() => onEdit(job.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition duration-200 font-semibold text-sm sm:text-base w-full sm:w-auto"
                >
                  Sửa
                </button>
                <button
                  onClick={() => onDelete(job.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 transition duration-200 font-semibold text-sm sm:text-base w-full sm:w-auto"
                >
                  Xóa
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;