import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email) {
      setError("Vui lòng nhập email");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
      return false;
    }
    return true;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const response = await forgetPassword({ email });
      const { success, message } = response.data;

      if (success) {
        setSuccessMessage(message || "OTP đã được gửi đến email của bạn!");
        setTimeout(() => {
          navigate("/reset-password", { state: { email } }); // Điều hướng đến trang reset password
        }, 2000);
      } else {
        setError(response.data.error || "Gửi OTP thất bại!");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Gửi OTP thất bại! Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-4xl font-extrabold text-center text-green-600 dark:text-green-400 mb-8">
          Quên Mật Khẩu
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
        <form onSubmit={handleForgotPassword}>
          <div className="mb-8">
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
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Đang gửi..." : "Gửi OTP"}
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

export default ForgotPassword;