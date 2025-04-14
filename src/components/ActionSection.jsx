// components/ActionSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ActionSection = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      {user.role === "candidate" ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Tìm việc làm
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Khám phá hàng ngàn cơ hội việc làm phù hợp với kỹ năng và sở thích của bạn.
          </p>
          <button
            onClick={() => navigate("/jobs")} // Giả định có route /jobs
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition duration-200 font-semibold"
          >
            Tìm việc ngay
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Đăng tin tuyển dụng
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Tìm kiếm ứng viên phù hợp cho công ty của bạn bằng cách đăng tin tuyển dụng.
          </p>
          <button
            onClick={() => navigate("/post-job")} // Giả định có route /post-job
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition duration-200 font-semibold"
          >
            Đăng tin ngay
          </button>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Quản lý tài khoản
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Cập nhật thông tin cá nhân, xem lịch sử ứng tuyển hoặc tin tuyển dụng.
        </p>
        <button
          onClick={() => navigate("/profile")} // Giả định có route /profile
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition duration-200 font-semibold"
        >
          Xem hồ sơ
        </button>
      </div>
    </div>
  );
};

export default ActionSection;