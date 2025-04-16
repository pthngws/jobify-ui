import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import {
  getJobsByCompany,
  updateJob,
  deleteJob,
} from "../services/jobService";
import {
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Alert from "../components/ui/Alert";

const JobList = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser.role !== "recruit") {
          setAlert({
            show: true,
            message: "Chỉ nhà tuyển dụng được phép xem danh sách công việc!",
            type: "error",
          });
          setIsLoading(false);
          return;
        }

        if (!parsedUser.company) {
          setAlert({
            show: true,
            message: "Thông tin công ty không hợp lệ! Vui lòng cập nhật hồ sơ công ty.",
            type: "error",
          });
          setIsLoading(false);
          return;
        }

        const fetchJobs = async () => {
          try {
            const response = await getJobsByCompany(parsedUser.company);
            if (response.data.success) {
              setJobs(response.data.data);
            } else {
              setAlert({
                show: true,
                message: "Không tìm thấy công việc nào!",
                type: "error",
              });
            }
          } catch (err) {
            setAlert({
              show: true,
              message: err.response?.data?.message || "Lỗi khi tải danh sách công việc!",
              type: "error",
            });
          } finally {
            setIsLoading(false);
          }
        };

        fetchJobs();
      } catch (err) {
        console.error("Lỗi phân tích user từ localStorage:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "closed" : "active";
    setAlert({ show: false, message: "", type: "success" });

    try {
      const response = await updateJob(jobId, { status: newStatus });
      if (response.data.success) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, status: newStatus } : job
          )
        );
        setAlert({
          show: true,
          message: `Cập nhật trạng thái thành công! Công việc giờ là ${
            newStatus === "active" ? "Đang tuyển" : "Đã đóng"
          }.`,
          type: "success",
        });
        setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
      } else {
        setAlert({
          show: true,
          message: "Không thể cập nhật trạng thái!",
          type: "error",
        });
      }
    } catch (err) {
      setAlert({
        show: true,
        message: err.response?.data?.message || "Lỗi khi cập nhật trạng thái công việc!",
        type: "error",
      });
    }
  };

  const handleDelete = async (jobId, jobTitle) => {
    if (!window.confirm(`Bạn có chắc muốn xóa công việc "${jobTitle}" không?`)) {
      return;
    }

    setAlert({ show: false, message: "", type: "success" });

    try {
      const response = await deleteJob(jobId);
      if (response.data.success) {
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        setAlert({
          show: true,
          message: "Xóa công việc thành công!",
          type: "success",
        });
        setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
      } else {
        setAlert({
          show: true,
          message: "Không thể xóa công việc!",
          type: "error",
        });
      }
    } catch (err) {
      setAlert({
        show: true,
        message: err.response?.data?.message || "Lỗi khi xóa công việc!",
        type: "error",
      });
    }
  };

  const handleEdit = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  const handleViewApplications = (jobId) => {
    navigate(`/job/${jobId}/applications`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              Danh Sách Công Việc Đã Đăng
            </h1>

            {alert.show && (
              <Alert
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ show: false, message: "", type: "success" })}
              />
            )}

            {jobs.length === 0 ? (
              <div className="text-center text-gray-600 dark:text-gray-400">
                Bạn chưa đăng công việc nào.{" "}
                <button
                  onClick={() => navigate("/post-job")}
                  className="text-green-500 hover:underline"
                >
                  Đăng công việc mới
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wide">
                      <th className="py-3 px-4 text-left">Tiêu đề</th>
                      <th className="py-3 px-4 text-left">Công ty</th>
                      <th className="py-3 px-4 text-left">Địa điểm</th>
                      <th className="py-3 px-4 text-left">Lương</th>
                      <th className="py-3 px-4 text-left">Loại</th>
                      <th className="py-3 px-4 text-left">Trạng thái</th>
                      <th className="py-3 px-4 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr
                        key={job._id}
                        className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                          {job.title}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {job.company?.name || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          <MapPinIcon className="w-4 h-4 inline mr-1 text-green-400" />
                          {job.location}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          <CurrencyDollarIcon className="w-4 h-4 inline mr-1 text-green-400" />
                          {(job.salary.min / 1000000).toFixed(1)} -{" "}
                          {(job.salary.max / 1000000).toFixed(1)} triệu{" "}
                          {job.salary.currency}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          <ClockIcon className="w-4 h-4 inline mr-1 text-green-400" />
                          {jobTypes.find((type) => type.value === job.jobType)?.label ||
                            job.jobType}
                        </td>
                        <td className="py-3 px-4">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={job.status === "active"}
                              onChange={() => handleToggleStatus(job._id, job.status)}
                              className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                              {job.status === "active" ? "Đang tuyển" : "Đã đóng"}
                            </span>
                          </label>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(job._id)}
                              className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(job._id, job.title)}
                              className="p-2 text-red-500 hover:text-red-600 transition-colors"
                              title="Xóa"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleViewApplications(job._id)}
                              className="p-2 text-green-500 hover:text-green-600 transition-colors"
                              title="Xem danh sách ứng viên"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

const jobTypes = [
  { value: "full-time", label: "Toàn thời gian" },
  { value: "part-time", label: "Bán thời gian" },
  { value: "remote", label: "Làm việc từ xa" },
  { value: "contract", label: "Hợp đồng" },
  { value: "internship", label: "Thực tập" },
];

export default JobList;