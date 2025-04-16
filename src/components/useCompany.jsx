import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCompany, getCompanyById, updateCompany, deleteCompany } from '../services/companyService';

const useCompany = () => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState({
    name: '',
    description: '',
    location: '',
    website: '',
    avatarUrl: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser.role !== 'recruit') {
          setError('Chỉ nhà tuyển dụng được phép quản lý công ty!');
          return;
        }

        setIsLoading(true);
        if (parsedUser.company) {
          getCompanyById(parsedUser.company)
            .then((response) => {
              const companyData = response.data.data;
              setCompany({
                name: companyData.name || '',
                description: companyData.description || '',
                location: companyData.location || '',
                website: companyData.website || '',
                avatarUrl: companyData.avatarUrl || '',
              });
            })
            .catch((err) => {
              if (err.response?.status === 404) {
                setIsCreating(true);
              } else {
                setError('Không thể tải thông tin công ty!');
              }
            })
            .finally(() => setIsLoading(false));
        } else {
          setIsCreating(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Lỗi phân tích user từ localStorage:', err);
        localStorage.clear();
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const validateInputs = () => {
    if (!company.name.trim()) {
      setError('Tên công ty là bắt buộc!');
      return false;
    }
    if (!company.location.trim()) {
      setError('Địa điểm là bắt buộc!');
      return false;
    }
    if (company.website && !/^https?:\/\/.+/.test(company.website)) {
      setError('Website không hợp lệ! Vui lòng bắt đầu bằng http:// hoặc https://');
      return false;
    }
    return true;
  };

  const handleSave = async (avatarFile) => {
    setError('');
    setSuccessMessage('');

    if (!validateInputs()) return false;

    const formData = new FormData();
    formData.append('name', company.name.trim());
    formData.append('description', company.description.trim());
    formData.append('location', company.location.trim());
    formData.append('website', company.website.trim());
    if (avatarFile) formData.append('avatar', avatarFile);

    setIsLoading(true);
    try {
      let response;
      if (isCreating) {
        response = await createCompany(formData);
      } else {
        response = await updateCompany(user.company, formData);
      }
      const updatedCompany = response.data.data;
      setCompany({
        name: updatedCompany.name || '',
        description: updatedCompany.description || '',
        location: updatedCompany.location || '',
        website: updatedCompany.website || '',
        avatarUrl: updatedCompany.avatarUrl || '',
      });
      setUser((prev) => ({ ...prev, company: updatedCompany._id }));
      localStorage.setItem('user', JSON.stringify({ ...user, company: updatedCompany._id }));
      setIsEditing(false);
      setIsCreating(false);
      setSuccessMessage(isCreating ? 'Tạo công ty thành công!' : 'Cập nhật công ty thành công!');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu thông tin công ty thất bại!');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa công ty này?')) return false;

    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    try {
      await deleteCompany(user.company);
      setCompany({
        name: '',
        description: '',
        location: '',
        website: '',
        avatarUrl: '',
      });
      setUser((prev) => ({ ...prev, company: null }));
      localStorage.setItem('user', JSON.stringify({ ...user, company: null }));
      setIsCreating(true);
      setIsEditing(false);
      setSuccessMessage('Xóa công ty thành công!');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Xóa công ty thất bại!');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccessMessage('');
    if (!isCreating) {
      setIsLoading(true);
      getCompanyById(user.company)
        .then((response) => {
          const companyData = response.data.data;
          setCompany({
            name: companyData.name || '',
            description: companyData.description || '',
            location: companyData.location || '',
            website: companyData.website || '',
            avatarUrl: companyData.avatarUrl || '',
          });
        })
        .catch(() => {
          setError('Không thể tải lại thông tin công ty!');
        })
        .finally(() => setIsLoading(false));
    } else {
      setCompany({
        name: '',
        description: '',
        location: '',
        website: '',
        avatarUrl: '',
      });
    }
  };

  return {
    user,
    company,
    setCompany,
    isEditing,
    setIsEditing,
    isCreating,
    error,
    successMessage,
    isLoading,
    handleSave,
    handleDelete,
    handleCancel,
  };
};

export default useCompany;