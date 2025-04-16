import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/userService';

const useProfile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    role: '',
    avatarUrl: '',
    resumeUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoading(true);
        getProfile()
          .then((response) => {
            const userData = response.data.user;
            setProfile({
              fullName: userData.fullName || parsedUser.fullName || '',
              email: userData.email || parsedUser.email || '',
              role: userData.role || parsedUser.role || '',
              avatarUrl: userData.avatarUrl || parsedUser.avatarUrl || '',
              resumeUrl: userData.resumeUrl || parsedUser.resumeUrl || '',
            });
          })
          .catch((err) => {
            console.error('Lỗi lấy hồ sơ:', err);
            localStorage.clear();
            navigate('/login');
          })
          .finally(() => setIsLoading(false));
      } catch (err) {
        console.error('Lỗi phân tích user từ localStorage:', err);
        localStorage.clear();
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const updateProfileData = async (formData) => {
    setIsLoading(true);
    try {
      const response = await updateProfile(formData);
      const updatedUser = response.data.user || response.data;
      setProfile((prev) => ({
        fullName: updatedUser.fullName || prev.fullName,
        email: updatedUser.email || prev.email,
        role: updatedUser.role || prev.role,
        avatarUrl: updatedUser.avatarUrl || prev.avatarUrl,
        resumeUrl: updatedUser.resumeUrl || prev.resumeUrl,
      }));
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, message: 'Cập nhật hồ sơ thành công!' };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || 'Cập nhật hồ sơ thất bại!' };
    } finally {
      setIsLoading(false);
    }
  };

  return { user, profile, setProfile, isLoading, updateProfileData };
};

export default useProfile;