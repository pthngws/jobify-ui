import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createJob, getJobById, updateJob } from '../services/jobService';

const usePostJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [job, setJob] = useState({
    title: '',
    description: '',
    requirements: [''],
    location: '',
    salary: { min: '', max: '', currency: 'VND' },
    jobType: 'full-time',
    experienceLevel: 'fresher',
    category: 'Other',
    status: 'active',
    benefits: [''],
    workHours: '9 AM - 5 PM',
    closingDate: '',
  });
  const [isEditing, setIsEditing] = useState(!!id);
  const [isCreating, setIsCreating] = useState(!id);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser.role !== 'recruit') {
          setError('Chỉ nhà tuyển dụng được phép đăng công việc!');
          return;
        }

        if (id) {
          setIsLoading(true);
          getJobById(id)
            .then((response) => {
              if (response.data.success) {
                const jobData = response.data.data;
                setJob({
                  title: jobData.title || '',
                  description: jobData.description || '',
                  requirements: jobData.requirements?.length ? jobData.requirements : [''],
                  location: jobData.location || '',
                  salary: {
                    min: jobData.salary?.min ? jobData.salary.min / 1000000 : '',
                    max: jobData.salary?.max ? jobData.salary.max / 1000000 : '',
                    currency: jobData.salary?.currency || 'VND',
                  },
                  jobType: jobData.jobType || 'full-time',
                  experienceLevel: jobData.experienceLevel || 'fresher',
                  category: jobData.category || 'Other',
                  status: jobData.status || 'active',
                  benefits: jobData.benefits?.length ? jobData.benefits : [''],
                  workHours: jobData.workHours || '9 AM - 5 PM',
                  closingDate: jobData.closingDate
                    ? new Date(jobData.closingDate).toISOString().split('T')[0]
                    : '',
                });
              } else {
                setError('Không tìm thấy công việc!');
              }
            })
            .catch(() => {
              setError('Không thể tải thông tin công việc!');
            })
            .finally(() => setIsLoading(false));
        }
      } catch (err) {
        console.error('Lỗi phân tích user từ localStorage:', err);
        localStorage.clear();
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('salary.')) {
      const field = name.split('.')[1];
      setJob((prev) => ({
        ...prev,
        salary: { ...prev.salary, [field]: value },
      }));
    } else {
      setJob((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setJob((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field) => {
    setJob((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field, index) => {
    setJob((prev) => {
      const newArray = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: newArray.length ? newArray : [''] };
    });
  };

  const validateInputs = () => {
    if (!job.title.trim()) {
      setError('Tiêu đề công việc là bắt buộc!');
      return false;
    }
    if (job.title.length > 100) {
      setError('Tiêu đề không được vượt quá 100 ký tự!');
      return false;
    }
    if (!job.description.trim()) {
      setError('Mô tả công việc là bắt buộc!');
      return false;
    }
    if (job.description.length < 10) {
      setError('Mô tả phải có ít nhất 10 ký tự!');
      return false;
    }
    if (!job.location.trim()) {
      setError('Địa điểm là bắt buộc!');
      return false;
    }
    if (job.location.length > 100) {
      setError('Địa điểm không được vượt quá 100 ký tự!');
      return false;
    }
    if (!job.salary.min || !job.salary.max) {
      setError('Mức lương tối thiểu và tối đa là bắt buộc!');
      return false;
    }
    if (isNaN(job.salary.min) || isNaN(job.salary.max) || Number(job.salary.min) > Number(job.salary.max)) {
      setError('Mức lương không hợp lệ! Tối thiểu phải nhỏ hơn hoặc bằng tối đa.');
      return false;
    }
    if (Number(job.salary.min) < 0 || Number(job.salary.max) < 0) {
      setError('Mức lương không được âm!');
      return false;
    }
    if (!job.jobType) {
      setError('Loại hình công việc là bắt buộc!');
      return false;
    }
    if (!job.closingDate) {
      setError('Hạn nộp là bắt buộc!');
      return false;
    }
    if (new Date(job.closingDate) <= new Date()) {
      setError('Hạn nộp phải là ngày trong tương lai!');
      return false;
    }
    if (job.requirements.some((req) => !req.trim())) {
      setError('Yêu cầu phải là các chuỗi không rỗng!');
      return false;
    }
    if (job.benefits.some((ben) => !ben.trim())) {
      setError('Phúc lợi phải là các chuỗi không rỗng!');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setError('');
    setSuccessMessage('');

    if (!validateInputs()) return;

    const jobData = {
      title: job.title.trim(),
      description: job.description.trim(),
      requirements: job.requirements.filter((req) => req.trim()).map((req) => req.trim()),
      location: job.location.trim(),
      salary: {
        min: Number(job.salary.min) * 1000000,
        max: Number(job.salary.max) * 1000000,
        currency: job.salary.currency,
      },
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      category: job.category,
      status: job.status,
      benefits: job.benefits.filter((ben) => ben.trim()).map((ben) => ben.trim()),
      workHours: job.workHours.trim(),
      closingDate: new Date(job.closingDate).toISOString(),
    };

    setIsLoading(true);
    try {
      let response;
      if (isCreating) {
        response = await createJob(jobData);
      } else {
        response = await updateJob(id, jobData);
      }
      const updatedJob = response.data.data;
      setJob({
        title: updatedJob.title || '',
        description: updatedJob.description || '',
        requirements: updatedJob.requirements?.length ? updatedJob.requirements : [''],
        location: updatedJob.location || '',
        salary: {
          min: updatedJob.salary?.min ? updatedJob.salary.min / 1000000 : '',
          max: updatedJob.salary?.max ? updatedJob.salary.max / 1000000 : '',
          currency: updatedJob.salary?.currency || 'VND',
        },
        jobType: updatedJob.jobType || 'full-time',
        experienceLevel: updatedJob.experienceLevel || 'fresher',
        category: updatedJob.category || 'Other',
        status: updatedJob.status || 'active',
        benefits: updatedJob.benefits?.length ? updatedJob.benefits : [''],
        workHours: updatedJob.workHours || '9 AM - 5 PM',
        closingDate: updatedJob.closingDate
          ? new Date(updatedJob.closingDate).toISOString().split('T')[0]
          : '',
      });
      setIsEditing(false);
      setIsCreating(false);
      setSuccessMessage(isCreating ? 'Đăng công việc thành công!' : 'Cập nhật công việc thành công!');
      setTimeout(() => navigate('/jobs'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu công việc thất bại!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError('');
    setSuccessMessage('');
    if (isCreating) {
      navigate('/jobs');
    } else {
      setIsEditing(false);
      setIsLoading(true);
      getJobById(id)
        .then((response) => {
          if (response.data.success) {
            const jobData = response.data.data;
            setJob({
              title: jobData.title || '',
              description: jobData.description || '',
              requirements: jobData.requirements?.length ? jobData.requirements : [''],
              location: jobData.location || '',
              salary: {
                min: jobData.salary?.min ? jobData.salary.min / 1000000 : '',
                max: jobData.salary?.max ? jobData.salary.max / 1000000 : '',
                currency: jobData.salary?.currency || 'VND',
              },
              jobType: jobData.jobType || 'full-time',
              experienceLevel: jobData.experienceLevel || 'fresher',
              category: jobData.category || 'Other',
              status: jobData.status || 'active',
              benefits: jobData.benefits?.length ? jobData.benefits : [''],
              workHours: jobData.workHours || '9 AM - 5 PM',
              closingDate: jobData.closingDate
                ? new Date(jobData.closingDate).toISOString().split('T')[0]
                : '',
            });
          }
        })
        .catch(() => {
          setError('Không thể tải lại thông tin công việc!');
        })
        .finally(() => setIsLoading(false));
    }
  };

  return {
    user,
    job,
    setJob,
    isEditing,
    setIsEditing,
    isCreating,
    setIsCreating,
    error,
    successMessage,
    isLoading,
    handleInputChange,
    handleArrayChange,
    addArrayItem,
    removeArrayItem,
    handleSave,
    handleCancel,
  };
};

export default usePostJob;