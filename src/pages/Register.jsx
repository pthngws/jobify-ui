import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Alert from "../components/ui/Alert";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
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
    if (!["candidate", "recruit"].includes(role)) {
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
        setSuccessMessage(message || "OTP đã được gửi đến email của bạn!");
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
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

  const roleOptions = [
    { value: "candidate", label: "Ứng viên" },
    { value: "recruit", label: "Nhà tuyển dụng" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
          Đăng Ký
        </h2>
        {successMessage && <Alert type="success" message={successMessage} />}
        {error && <Alert type="error" message={error} />}
        <form onSubmit={handleRegister}>
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            disabled={isLoading}
            required
          />
          <Input
            id="password"
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <Select
            id="role"
            label="Vai trò"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={roleOptions}
            disabled={isLoading}
          />
          <Button type="submit" isLoading={isLoading} className="w-full mt-4">
            Đăng Ký
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            className="text-green-600 dark:text-green-400 hover:underline font-medium"
          >
            Đăng nhập ngay
          </a>
        </p>
      </Card>
    </div>
  );
};

export default Register;