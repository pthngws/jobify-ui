import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Xử lý redirect từ Google login
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const accessToken = query.get("accessToken");
    const refreshToken = query.get("refreshToken");
    const user = query.get("user");
    const error = query.get("error");

    if (error) {
      setError(decodeURIComponent(error));
      setIsGoogleLoading(false);
      return;
    }

    if (accessToken && refreshToken && user) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(user));
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(parsedUser));
        setSuccessMessage("Đăng nhập bằng Google thành công!");
        setTimeout(() => {
          navigate("/home");
        }, 500);
      } catch (error) {
        setError(error);
        setIsGoogleLoading(false);
      }
    }
  }, [location, navigate]);

  // Kiểm tra input email và password
  const validateInputs = () => {
    if (!email || !password) {
      setError("Vui lòng điền đầy đủ email và mật khẩu");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
      return false;
    }
    return true;
  };

  // Xử lý đăng nhập bằng email/password
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const response = await login({ email, password });
      const { success, message, data } = response.data;

      if (success) {
        setSuccessMessage(message || "Đăng nhập thành công!");
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.accessToken);

        setTimeout(() => {
          navigate("/home");
        }, 500);
      } else {
        setError(message || "Đăng nhập thất bại!");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Đăng nhập thất bại! Kiểm tra lại email và mật khẩu."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý nút đăng nhập Google
  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setError("");
    window.location.href = "http://localhost:8080/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-4xl font-extrabold text-center text-green-600 dark:text-green-400 mb-8">
          Đăng Nhập
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
        <form onSubmit={handleLogin}>
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
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>
        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 font-semibold text-lg flex items-center justify-center gap-3 shadow-sm"
            disabled={isGoogleLoading || isLoading}
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.57-2.77c-1.02.68-2.33 1.09-3.71 1.09-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.39 7.69 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.69 1 4.01 3.61 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isGoogleLoading ? "Đang xử lý..." : "Đăng nhập bằng Google"}
          </button>
        </div>
        <p className="mt-6 text-center text-base text-gray-600 dark:text-gray-400">
          Chưa có tài khoản?{" "}
          <a
            href="/register"
            className="text-green-600 dark:text-green-400 hover:underline font-medium"
          >
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;