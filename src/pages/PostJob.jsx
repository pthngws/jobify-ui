import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import {
  createJob,
  getJobById,
  updateJob,
} from "../services/jobService";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

const PostJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [job, setJob] = useState({
    title: "",
    description: "",
    requirements: [""],
    location: "",
    salary: { min: "", max: "", currency: "VND" },
    jobType: "full-time",
    experienceLevel: "fresher",
    category: "Other",
    status: "active",
    benefits: [""],
    workHours: "9 AM - 5 PM",
    closingDate: "",
  });
  const [isEditing, setIsEditing] = useState(!!id);
  const [isCreating, setIsCreating] = useState(!id);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const [isLoading, setIsLoading] = useState(false);

  // Danh sách giá trị cho selectbox, hiển thị tiếng Việt, khớp với JobSchema
  const jobTypes = [
    { value: "full-time", label: "Toàn thời gian" },
    { value: "part-time", label: "Bán thời gian" },
    { value: "remote", label: "Làm việc từ xa" },
    { value: "contract", label: "Hợp đồng" },
    { value: "internship", label: "Thực tập" },
  ];
  const statuses = [
    { value: "active", label: "Đang tuyển" },
    { value: "closed", label: "Đã đóng" },
    { value: "draft", label: "Bản nháp" },
  ];
  const categories = [
    { value: "IT", label: "Công nghệ thông tin" },
    { value: "Marketing", label: "Marketing" },
    { value: "Finance", label: "Tài chính" },
    { value: "Sales", label: "Bán hàng" },
    { value: "Engineering", label: "Kỹ thuật" },
    { value: "Design", label: "Thiết kế" },
    { value: "HR", label: "Nhân sự" },
    { value: "Other", label: "Khác" },
  ];
  const experienceLevels = [
    { value: "intern", label: "Thực tập sinh" },
    { value: "fresher", label: "Mới ra trường" },
    { value: "junior", label: "Junior" },
    { value: "mid-level", label: "Trung cấp" },
    { value: "senior", label: "Cao cấp" },
  ];
  const currencies = [
    { value: "VND", label: "VND" },
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser.role !== "recruit") {
          setAlert({
            show: true,
            message: "Chỉ nhà tuyển dụng được phép đăng công việc!",
            type: "error",
          });
          return;
        }

        if (id) {
          setIsLoading(true);
          getJobById(id)
            .then((response) => {
              if (response.data.success) {
                const jobData = response.data.data;
                setJob({
                  title: jobData.title || "",
                  description: jobData.description || "",
                  requirements: jobData.requirements?.length ? jobData.requirements : [""],
                  location: jobData.location || "",
                  salary: {
                    min: jobData.salary?.min ? jobData.salary.min / 1000000 : "",
                    max: jobData.salary?.max ? jobData.salary.max / 1000000 : "",
                    currency: jobData.salary?.currency || "VND",
                  },
                  jobType: jobData.jobType || "full-time",
                  experienceLevel: jobData.experienceLevel || "fresher",
                  category: jobData.category || "Other",
                  status: jobData.status || "active",
                  benefits: jobData.benefits?.length ? jobData.benefits : [""],
                  workHours: jobData.workHours || "9 AM - 5 PM",
                  closingDate: jobData.closingDate
                    ? new Date(jobData.closingDate).toISOString().split("T")[0]
                    : "",
                });
              } else {
                setAlert({
                  show: true,
                  message: "Không tìm thấy công việc!",
                  type: "error",
                });
              }
            })
            .catch((err) => {
              setAlert({
                show: true,
                message: "Không thể tải thông tin công việc!",
                type: "error",
              });
            })
            .finally(() => setIsLoading(false));
        }
      } catch (err) {
        console.error("Lỗi phân tích user từ localStorage:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("salary.")) {
      const field = name.split(".")[1];
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
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setJob((prev) => {
      const newArray = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: newArray.length ? newArray : [""] };
    });
  };

  const validateInputs = () => {
    if (!job.title.trim()) {
      setAlert({
        show: true,
        message: "Tiêu đề công việc là bắt buộc!",
        type: "error",
      });
      return false;
    }
    if (job.title.length > 100) {
      setAlert({
        show: true,
        message: "Tiêu đề không được vượt quá 100 ký tự!",
        type: "error",
      });
      return false;
    }
    if (!job.description.trim()) {
      setAlert({
        show: true,
        message: "Mô tả công việc là bắt buộc!",
        type: "error",
      });
      return false;
    }
    if (job.description.length < 10) {
      setAlert({
        show: true,
        message: "Mô tả phải có ít nhất 10 ký tự!",
        type: "error",
      });
      return false;
    }
    if (!job.location.trim()) {
      setAlert({
        show: true,
        message: "Địa điểm là bắt buộc!",
        type: "error",
      });
      return false;
    }
    if (job.location.length > 100) {
      setAlert({
        show: true,
        message: "Địa điểm không được vượt quá 100 ký tự!",
        type: "error",
      });
      return false;
    }
    if (!job.salary.min || !job.salary.max) {
      setAlert({
        show: true,
        message: "Mức lương tối thiểu và tối đa là bắt buộc!",
        type: "error",
      });
      return false;
    }
    if (isNaN(job.salary.min) || isNaN(job.salary.max) || Number(job.salary.min) > Number(job.salary.max)) {
      setAlert({
        show: true,
        message: "Mức lương không hợp lệ! Tối thiểu phải nhỏ hơn hoặc bằng tối đa.",
        type: "error",
      });
      return false;
    }
    if (Number(job.salary.min) < 0 || Number(job.salary.max) < 0) {
      setAlert({
        show: true,
        message: "Mức lương không được âm!",
        type: "error",
      });
      return false;
    }
    if (!job.jobType) {
      setAlert({
        show: true,
        message: "Loại hình công việc là bắt buộc!",
        type: "error",
      });
      return false;
    }
    if (!job.closingDate) {
      setAlert({
        show: true,
        message: "Hạn nộp là bắt buộc!",
        type: "error",
      });
      return false;
    }
    if (new Date(job.closingDate) <= new Date()) {
      setAlert({
        show: true,
        message: "Hạn nộp phải là ngày trong tương lai!",
        type: "error",
      });
      return false;
    }
    const validRequirements = job.requirements.every((req) => req.trim().length > 0);
    if (!validRequirements) {
      setAlert({
        show: true,
        message: "Yêu cầu phải là các chuỗi không rỗng!",
        type: "error",
      });
      return false;
    }
    const validBenefits = job.benefits.every((ben) => ben.trim().length > 0);
    if (!validBenefits) {
      setAlert({
        show: true,
        message: "Phúc lợi phải là các chuỗi không rỗng!",
        type: "error",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setAlert({ show: false, message: "", type: "success" });

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
        title: updatedJob.title || "",
        description: updatedJob.description || "",
        requirements: updatedJob.requirements?.length ? updatedJob.requirements : [""],
        location: updatedJob.location || "",
        salary: {
          min: updatedJob.salary?.min ? updatedJob.salary.min / 1000000 : "",
          max: updatedJob.salary?.max ? updatedJob.salary.max / 1000000 : "",
          currency: updatedJob.salary?.currency || "VND",
        },
        jobType: updatedJob.jobType || "full-time",
        experienceLevel: updatedJob.experienceLevel || "fresher",
        category: updatedJob.category || "Other",
        status: updatedJob.status || "active",
        benefits: updatedJob.benefits?.length ? updatedJob.benefits : [""],
        workHours: updatedJob.workHours || "9 AM - 5 PM",
        closingDate: updatedJob.closingDate
          ? new Date(updatedJob.closingDate).toISOString().split("T")[0]
          : "",
      });
      setIsEditing(false);
      setIsCreating(false);
      setAlert({
        show: true,
        message: isCreating ? "Đăng công việc thành công!" : "Cập nhật công việc thành công!",
        type: "success",
      });
      setTimeout(() => navigate("/jobs"), 2000);
    } catch (err) {
      setAlert({
        show: true,
        message: err.response?.data?.message || "Lưu công việc thất bại!",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setAlert({ show: false, message: "", type: "success" });
    if (isCreating) {
      navigate("/jobs");
    } else {
      setIsEditing(false);
      setIsLoading(true);
      getJobById(id)
        .then((response) => {
          if (response.data.success) {
            const jobData = response.data.data;
            setJob({
              title: jobData.title || "",
              description: jobData.description || "",
              requirements: jobData.requirements?.length ? jobData.requirements : [""],
              location: jobData.location || "",
              salary: {
                min: jobData.salary?.min ? jobData.salary.min / 1000000 : "",
                max: jobData.salary?.max ? jobData.salary.max / 1000000 : "",
                currency: jobData.salary?.currency || "VND",
              },
              jobType: jobData.jobType || "full-time",
              experienceLevel: jobData.experienceLevel || "fresher",
              category: jobData.category || "Other",
              status: jobData.status || "active",
              benefits: jobData.benefits?.length ? jobData.benefits : [""],
              workHours: jobData.workHours || "9 AM - 5 PM",
              closingDate: jobData.closingDate
                ? new Date(jobData.closingDate).toISOString().split("T")[0]
                : "",
            });
          }
        })
        .catch((err) => {
          setAlert({
            show: true,
            message: "Không thể tải lại thông tin công việc!",
            type: "error",
          });
        })
        .finally(() => setIsLoading(false));
    }
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
              {isCreating ? "Đăng Công Việc Mới" : "Chỉnh Sửa Công Việc"}
            </h1>

            {alert.show && (
              <Alert
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ show: false, message: "", type: "success" })}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Cột trái */}
              <div className="space-y-4">
                {/* Tiêu đề */}
                <div className="flex items-center gap-3">
                  <label className="w-28 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <DocumentTextIcon className="w-5 h-5 inline mr-1" />
                    Tiêu đề
                  </label>
                  <Input
                    type="text"
                    name="title"
                    value={job.title}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Lập trình viên Full-stack"
                    maxLength={100}
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Địa điểm */}
                <div className="flex items-center gap-3">
                  <label className="w-28 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <MapPinIcon className="w-5 h-5 inline mr-1" />
                    Địa điểm
                  </label>
                  <Input
                    type="text"
                    name="location"
                    value={job.location}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Hà Nội"
                    maxLength={100}
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Mức lương */}
                <div className="flex items-center gap-3">
                  <label className="w-28 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <CurrencyDollarIcon className="w-5 h-5 inline mr-1" />
                    Lương (triệu)
                  </label>
                  <div className="flex gap-2 flex-1 items-center">
                    <Input
                      type="number"
                      name="salary.min"
                      value={job.salary.min}
                      onChange={handleInputChange}
                      placeholder="Min"
                      min={0}
                      disabled={isLoading}
                      required
                    />
                    <Input
                      type="number"
                      name="salary.max"
                      value={job.salary.max}
                      onChange={handleInputChange}
                      placeholder="Max"
                      min={0}
                      disabled={isLoading}
                      required
                    />
                    <select
                      name="salary.currency"
                      value={job.salary.currency}
                      onChange={handleInputChange}
                      className="w-1/3 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                      disabled={isLoading}
                    >
                      {currencies.map((cur) => (
                        <option key={cur.value} value={cur.value}>
                          {cur.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Loại công việc */}
                <div className="flex items-center gap-3">
                  <label className="w-28 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <ClockIcon className="w-5 h-5 inline mr-1" />
                    Loại công việc
                  </label>
                  <select
                    name="jobType"
                    value={job.jobType}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                    disabled={isLoading}
                    required
                  >
                    {jobTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cấp độ kinh nghiệm */}
                <div className="flex items-center gap-3">
                  <label className="w-28 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <BuildingOfficeIcon className="w-5 h-5 inline mr-1" />
                    Cấp độ
                  </label>
                  <select
                    name="experienceLevel"
                    value={job.experienceLevel}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                    disabled={isLoading}
                  >
                    {experienceLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cột phải */}
              <div className="space-y-4">
                {/* Danh mục */}
                <div className="flex items-center gap-3">
                  <label className="w-28 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <BuildingOfficeIcon className="w-5 h-5 inline mr-1" />
                    Danh mục
                  </label>
                  <select
                    name="category"
                    value={job.category}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                    disabled={isLoading}
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Trạng thái */}
                <div className="flex items-center gap-3">
                  <label className="w-28 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <BuildingOfficeIcon className="w-5 h-5 inline mr-1" />
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={job.status}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                    disabled={isLoading}
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Giờ làm việc */}
                <div className="flex items-center gap-3">
                  <label className="w-28 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <ClockIcon className="w-5 h-5 inline mr-1" />
                    Giờ làm việc
                  </label>
                  <Input
                    type="text"
                    name="workHours"
                    value={job.workHours}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 9h sáng - 5h chiều"
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                    disabled={isLoading}
                  />
                </div>

                {/* Hạn nộp */}
                <div className="flex items-center gap-3">
                  <label className="w-28 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    <CalendarIcon className="w-5 h-5 inline mr-1" />
                    Hạn nộp
                  </label>
                  <Input
                    type="date"
                    name="closingDate"
                    value={job.closingDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <div className="mt-6">
              <label className="text-gray-500 dark:text-gray-400 text-sm font-medium block mb-2">
                <DocumentTextIcon className="w-5 h-5 inline mr-1" />
                Mô tả công việc
              </label>
              <Textarea
                name="description"
                value={job.description}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết về công việc (ít nhất 10 ký tự)..."
                minLength={10}
                disabled={isLoading}
                rows={6}
                required
              />
            </div>

            <div className="flex gap-6">
              {/* Yêu cầu */}
              <div className="mt-6 w-1/2">
                <label className="text-gray-500 dark:text-gray-400 text-sm font-medium block mb-2">
                  <DocumentTextIcon className="w-5 h-5 inline mr-1" />
                  Yêu cầu
                </label>
                {job.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      className="flex-1"
                      type="text"
                      value={req}
                      onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
                      placeholder={`Yêu cầu ${index + 1} (không để trống)`}
                      disabled={isLoading}
                    />
                    <Button
                      variant="danger"
                      className="w-auto px-4 py-2 text-sm"
                      onClick={() => removeArrayItem("requirements", index)}
                      disabled={isLoading}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => addArrayItem("requirements")}
                  disabled={isLoading}
                  className="w-auto px-4 py-2 text-sm"
                >
                  Thêm yêu cầu
                </Button>

              </div>

              {/* Phúc lợi */}
              <div className="mt-6 w-1/2">
                <label className="text-gray-500 dark:text-gray-400 text-sm font-medium block mb-2">
                  <DocumentTextIcon className="w-5 h-5 inline mr-1" />
                  Phúc lợi
                </label>
                {job.benefits.map((ben, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      className="flex-1"
                      type="text"
                      value={ben}
                      onChange={(e) => handleArrayChange("benefits", index, e.target.value)}
                      placeholder={`Phúc lợi ${index + 1} (không để trống)`}
                      disabled={isLoading}
                    />
                    <Button
                      variant="danger"
                      className="w-auto px-4 py-2 text-sm"
                      onClick={() => removeArrayItem("benefits", index)}
                      disabled={isLoading}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}

                <Button
                  className="w-auto px-4 py-2 text-sm"
                  onClick={() => addArrayItem("benefits")}
                  disabled={isLoading}
                >
                  Thêm phúc lợi
                </Button>
              </div>
            </div>


            {/* Nút hành động */}
            <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              <Button
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Đang lưu..." : isCreating ? "Đăng" : "Lưu"}
              </Button>
              <Button
                variant="danger"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Hủy
              </Button>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default PostJob;