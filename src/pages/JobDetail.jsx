// pages/JobDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById } from "../services/jobService";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await getJobById(id);
        if (response.data.success) {
          setJob(response.data.data);
        } else {
          setError("Không tìm thấy công việc");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Đã có lỗi xảy ra khi tải thông tin công việc");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          {/* Header: Logo & Title */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-shrink-0">
              <img
                src={
                  job.company.avatarUrl ||
                  "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/logo_default.png"
                }
                alt={`${job.company.name} logo`}
                className="w-24 h-24 rounded-full border-2 border-green-600 dark:border-green-400 object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {job.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Công ty:</span> {job.company.name}
              </p>
            </div>
          </div>

          {/* Job Info */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-green-400" />
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Địa điểm:</span> {job.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Mức lương:</span>{" "}
                {(job.salary.min / 1000000).toFixed(1)} - {(job.salary.max / 1000000).toFixed(1)} triệu {job.salary.currency}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-green-400" />
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Loại công việc:</span>{" "}
                {job.jobType === "full-time" ? "Toàn thời gian" : "Bán thời gian"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-green-400" />
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Ngày đăng:</span>{" "}
                {new Date(job.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-green-400" />
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Hạn nộp:</span>{" "}
                {new Date(job.closingDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BuildingOfficeIcon className="w-5 h-5 text-green-400" />
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Cấp độ:</span> {job.experienceLevel}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-green-400" />
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Giờ làm việc:</span> {job.workHours}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BuildingOfficeIcon className="w-5 h-5 text-green-400" />
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Danh mục:</span> {job.category}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BuildingOfficeIcon className="w-5 h-5 text-green-400" />
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">Trạng thái:</span>{" "}
                {job.status === "active" ? "Đang tuyển" : "Đã đóng"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 text-left">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Mô tả công việc
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="mt-8 text-left">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Yêu cầu
            </h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="mt-8 text-left">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Phúc lợi
            </h2>
            {job.benefits.length > 0 ? (
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                {job.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Không có thông tin phúc lợi.</p>
            )}
          </div>

          {/* Company Info */}
          <div className="mt-8 text-left">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Về công ty
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Mô tả:</span> {job.company.description}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Website:</span>{" "}
              <a
                href={job.company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                {job.company.website}
              </a>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Địa điểm:</span> {job.company.location}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
            >
              Quay lại
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetail;
