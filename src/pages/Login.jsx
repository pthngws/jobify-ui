import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import useGoogleLogin from '../components/useGoogleLogin';
import validateLoginInputs from '../components/validateInputs';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useGoogleLogin(setError, setSuccessMessage, setIsGoogleLoading);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validateLoginInputs(email, password, setError)) return;

    setIsLoading(true);
    try {
      const { data: { success, message, data } } = await login({ email, password });
      if (success) {
        setSuccessMessage(message || 'Đăng nhập thành công!');
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.accessToken);
        setTimeout(() => navigate('/home'), 500);
      } else {
        setError(message || 'Đăng nhập thất bại!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setError('');
    window.location.href = 'http://localhost:8080/api/auth/google';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
          Đăng Nhập
        </h2>
        {successMessage && <Alert type="success" message={successMessage} />}
        {error && <Alert type="error" message={error} />}
        <form onSubmit={handleLogin}>
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
          <div className="mb-4 text-right">
            <a href="/forgot-password" className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium">
              Quên mật khẩu?
            </a>
          </div>
          <div className="space-y-3">
            <Button type="submit" isLoading={isLoading} className="w-full">
              Đăng Nhập
            </Button>
            <Button
              variant="secondary"
              onClick={handleGoogleLogin}
              isLoading={isGoogleLoading}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.57-2.77c-1.02.68-2.33 1.09-3.71 1.09-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.39 7.69 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.69 1 4.01 3.61 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Đăng nhập bằng Google
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Chưa có tài khoản?{' '}
          <a href="/register" className="text-green-600 dark:text-green-400 hover:underline font-medium">
            Đăng ký ngay
          </a>
        </p>
      </Card>
    </div>
  );
};

export default Login;