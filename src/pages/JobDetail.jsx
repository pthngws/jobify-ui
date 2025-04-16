import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById } from "../services/jobService";
import { createApplication } from "../services/applicationService";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Alert from "../components/ui/Alert";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const fetchJobAndUser = async () => {
      try {
        // Lấy thông tin user
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Lấy thông tin job
        const response = await getJobById(id);
        if (response.data.success) {
          setJob(response.data.data);
        } else {
          setAlert({
            show: true,
            message: "Không tìm thấy công việc",
            type: "error",
          });
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setAlert({
          show: true,
          message: "Đã có lỗi xảy ra khi tải thông tin công việc",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndUser();
  }, [id]);

  const handleApply = async () => {
    setAlert({ show: false, message: "", type: "success" });

    if (!user) {
      setAlert({
        show: true,
        message: "Vui lòng đăng nhập để ứng tuyển!",
        type: "error",
      });
      setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
      return;
    }

    if (user.role !== "candidate") {
      setAlert({
        show: true,
        message: "Chỉ ứng viên được phép ứng tuyển!",
        type: "error",
      });
      setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
      return;
    }

    try {
      const response = await createApplication({
        job: id,
        applicant: user._id,
      });

      if (response.data.success) {
        setAlert({
          show: true,
          message: "Ứng tuyển thành công!",
          type: "success",
        });
        setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
      } else {
        setAlert({
          show: true,
          message: "Không thể ứng tuyển! Vui lòng thử lại.",
          type: "error",
        });
      }
    } catch (err) {
      setAlert({
        show: true,
        message: "Bạn đã ứng tuyển công việc này rồi!",
        type: "error",
      });
      setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
    }
  };

  const isJobActive = job && job.status === "active" && new Date(job.closingDate) >= new Date();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          {/* Thông báo */}
          {alert.show && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert({ show: false, message: "", type: "success" })}
            />
          )}

          {/* Header: Logo & Title */}
          {job && (
            <>
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
                    {(job.salary.min / 1000000).toFixed(1)} -{" "}
                    {(job.salary.max / 1000000).toFixed(1)} triệu {job.salary.currency}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-green-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Loại công việc:</span>{" "}
                    {job.jobType === "full-time"
                      ? "Toàn thời gian"
                      : job.jobType === "part-time"
                      ? "Bán thời gian"
                      : job.jobType === "remote"
                      ? "Làm việc từ xa"
                      : job.jobType === "contract"
                      ? "Hợp đồng"
                      : "Thực tập"}
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
              <div className="mt-8 flex justify-end gap-4">
                {user?.role === "candidate" && isJobActive && (
                  <button
                    onClick={handleApply}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500 transition duration-200"
                  >
                    Ứng tuyển
                  </button>
                )}
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
                >
                  Quay lại
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobDetail;