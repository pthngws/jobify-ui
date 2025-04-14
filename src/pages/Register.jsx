import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("applicant");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email || !password || !role) {
      setError("Vui lòng điền đầy đủ thông tin");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
      return false;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    if (!["applicant", "employer"].includes(role)) {
      setError("Vai trò không hợp lệ");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const response = await register({ email, password, role });
      const { success, message } = response.data;

      if (success) {
        setSuccessMessage(message || "Đăng ký thành công!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data.error || "Đăng ký thất bại!");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Đăng ký thất bại! Kiểm tra lại thông tin."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-4xl font-extrabold text-center text-green-600 dark:text-green-400 mb-8">
          Đăng Ký
        </h2>
        {successMessage && (
          <div className="text-green-500 dark:text-green-400 text-center mb-6 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="text-red-500 dark:text-red-400 text-center mb-6 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleRegister}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-base font-semibold text-gray-700 dark:text-gray-200 mb-2 text-left"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 transition-colors duration-200 text-base"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-base font-semibold text-gray-700 dark:text-gray-200 mb-2 text-left"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 transition-colors duration-200 text-base"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="role"
              className="block text-base font-semibold text-gray-700 dark:text-gray-200 mb-2 text-left"
            >
              Vai trò
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100 transition-colors duration-200 text-base"
              disabled={isLoading}
            >
              <option value="applicant">Ứng viên</option>
              <option value="employer">Nhà tuyển dụng</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng ký..." : "Đăng Ký"}
          </button>
        </form>
        <p className="mt-6 text-center text-base text-gray-600 dark:text-gray-400">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            className="text-green-600 dark:text-green-400 hover:underline font-medium"
          >
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;