import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../services/authService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Alert from "../components/ui/Alert";

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
          navigate("/reset-password", { state: { email } });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
          Quên Mật Khẩu
        </h2>
        {successMessage && <Alert type="success" message={successMessage} />}
        {error && <Alert type="error" message={error} />}
        <form onSubmit={handleForgotPassword}>
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            disabled={isLoading}
            required
          />
          <Button type="submit" isLoading={isLoading} className="w-full mt-4">
            Gửi OTP
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

export default ForgotPassword;