import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { completeRegistration } from "../services/authService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Alert from "../components/ui/Alert";

const VerifyOTP = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialEmail = decodeURIComponent(queryParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email || !otp) {
      setError("Vui lòng điền đầy đủ thông tin");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
      return false;
    }
    if (otp.length !== 6) {
      setError("OTP phải có 6 chữ số");
      return false;
    }
    return true;
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const response = await completeRegistration({ email, otp });
      const { success, message } = response.data;

      if (success) {
        setSuccessMessage(message || "Xác thực OTP thành công!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data.error || "Xác thực OTP thất bại!");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Xác thực OTP thất bại! Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
          Xác Thực OTP
        </h2>
        {successMessage && <Alert type="success" message={successMessage} />}
        {error && <Alert type="error" message={error} />}
        <form onSubmit={handleVerifyOTP}>
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            disabled={isLoading || initialEmail}
            required
          />
          <Input
            id="otp"
            label="Mã OTP"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.trim())}
            disabled={isLoading}
            required
            maxLength={6}
          />
          <Button type="submit" isLoading={isLoading} className="w-full mt-4">
            Xác Thực
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Không nhận được OTP?{" "}
          <a
            href="#"
            className="text-green-600 dark:text-green-400 hover:underline font-medium"
            onClick={() => alert("Chức năng gửi lại OTP đang phát triển")}
          >
            Gửi lại OTP
          </a>
        </p>
      </Card>
    </div>
  );
};

export default VerifyOTP;