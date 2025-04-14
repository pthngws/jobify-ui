// components/WelcomeSection.jsx
import React from "react";

const WelcomeSection = ({ user }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl font-extrabold text-green-600 dark:text-green-400 mb-4">
        Chào mừng đến với Trang Tuyển Dụng!
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Xin chào, <span className="font-semibold">{user.email}</span>! Bạn đang đăng nhập với vai trò{" "}
        <span className="font-semibold capitalize">{user.role}</span>.
      </p>
    </div>
  );
};

export default WelcomeSection;