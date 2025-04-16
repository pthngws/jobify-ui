import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import { getAllApplicationsByJobId, updateApplicationStatus } from "../services/applicationService";
import { EyeIcon } from "@heroicons/react/24/outline";
import Alert from "../components/ui/Alert";

const ApplicationList = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
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
            message: "Chỉ nhà tuyển dụng được phép xem danh sách ứng viên!",
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

        const fetchApplications = async () => {
          try {
            const response = await getAllApplicationsByJobId(jobId);
            if (response.data.success) {
              setApplications(response.data.data);
            } else {
              setAlert({
                show: true,
                message: "Không tìm thấy ứng viên nào!",
                type: "error",
              });
            }
          } catch (err) {
            setAlert({
              show: true,
              message: err.message || "Lỗi khi tải danh sách ứng viên!",
              type: "error",
            });
          } finally {
            setIsLoading(false);
          }
        };

        fetchApplications();
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
  }, [navigate, jobId]);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    setAlert({ show: false, message: "", type: "success" });

    try {
      const response = await updateApplicationStatus(applicationId, { status: newStatus });
      if (response.data.success) {
        setApplications((prevApps) =>
          prevApps.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
        setAlert({
          show: true,
          message: `Cập nhật trạng thái thành công! Ứng viên giờ là ${statusLabels[newStatus]}.`,
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
        message: err.message || "Lỗi khi cập nhật trạng thái ứng viên!",
        type: "error",
      });
    }
  };

  const handleViewResume = (resumeUrl) => {
    navigate("/view-resume", {
      state: { resumeUrl },
    });
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
              Danh Sách Ứng Viên Ứng Tuyển
            </h1>

            {alert.show && (
              <Alert
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ show: false, message: "", type: "success" })}
              />
            )}

            {applications.length === 0 ? (
              <div className="text-center text-gray-600 dark:text-gray-400">
                Chưa có ứng viên nào ứng tuyển cho công việc này.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wide">
                      <th className="py-3 px-4 text-left">Tên ứng viên</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Ngày ứng tuyển</th>
                      <th className="py-3 px-4 text-left">Trạng thái</th>
                      <th className="py-3 px-4 text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr
                        key={app._id}
                        className={`border-t border-gray-200 dark:border-gray-700 transition-colors ${
                          app.status === "rejected"
                            ? "bg-red-50 dark:bg-red-900/30"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                          {app.applicant?.fullName || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {app.applicant?.email || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                            className="px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          >
                            <option value="pending">Đang chờ</option>
                            <option value="accepted">Đã chấp nhận</option>
                            <option value="rejected">Đã từ chối</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleViewResume(app.applicant?.resumeUrl)}
                            className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                            title="Xem CV"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
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

const statusLabels = {
  pending: "Đang chờ",
  accepted: "Đã chấp nhận",
  rejected: "Đã từ chối",
};

export default ApplicationList;