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
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    { value: "VND", label: "VND (Việt Nam Đồng)" },
    { value: "USD", label: "USD (Đô la Mỹ)" },
    { value: "EUR", label: "EUR (Euro)" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser.role !== "recruit") {
          setError("Chỉ nhà tuyển dụng được phép đăng công việc!");
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
                setError("Không tìm thấy công việc!");
              }
            })
            .catch((err) => {
              setError("Không thể tải thông tin công việc!");
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
      setError("Tiêu đề công việc là bắt buộc!");
      return false;
    }
    if (job.title.length > 100) {
      setError("Tiêu đề không được vượt quá 100 ký tự!");
      return false;
    }
    if (!job.description.trim()) {
      setError("Mô tả công việc là bắt buộc!");
      return false;
    }
    if (job.description.length < 10) {
      setError("Mô tả phải có ít nhất 10 ký tự!");
      return false;
    }
    if (!job.location.trim()) {
      setError("Địa điểm là bắt buộc!");
      return false;
    }
    if (job.location.length > 100) {
      setError("Địa điểm không được vượt quá 100 ký tự!");
      return false;
    }
    if (!job.salary.min || !job.salary.max) {
      setError("Mức lương tối thiểu và tối đa là bắt buộc!");
      return false;
    }
    if (isNaN(job.salary.min) || isNaN(job.salary.max) || Number(job.salary.min) > Number(job.salary.max)) {
      setError("Mức lương không hợp lệ! Tối thiểu phải nhỏ hơn hoặc bằng tối đa.");
      return false;
    }
    if (Number(job.salary.min) < 0 || Number(job.salary.max) < 0) {
      setError("Mức lương không được âm!");
      return false;
    }
    if (!job.jobType) {
      setError("Loại hình công việc là bắt buộc!");
      return false;
    }
    if (!job.closingDate) {
      setError("Hạn nộp là bắt buộc!");
      return false;
    }
    if (new Date(job.closingDate) <= new Date()) {
      setError("Hạn nộp phải là ngày trong tương lai!");
      return false;
    }
    const validRequirements = job.requirements.every((req) => req.trim().length > 0);
    if (!validRequirements) {
      setError("Yêu cầu phải là các chuỗi không rỗng!");
      return false;
    }
    const validBenefits = job.benefits.every((ben) => ben.trim().length > 0);
    if (!validBenefits) {
      setError("Phúc lợi phải là các chuỗi không rỗng!");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setError("");
    setSuccessMessage("");

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
      setSuccessMessage(isCreating ? "Đăng công việc thành công!" : "Cập nhật công việc thành công!");
      setTimeout(() => navigate("/jobs"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Lưu công việc thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setError("");
    setSuccessMessage("");
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
          setError("Không thể tải lại thông tin công việc!");
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

            {successMessage && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg mb-4">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg mb-4">
                {error}
              </div>
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
                  <input
                    type="text"
                    name="title"
                    value={job.title}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Lập trình viên Full-stack"
                    maxLength={100}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
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
                  <input
                    type="text"
                    name="location"
                    value={job.location}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: Hà Nội"
                    maxLength={100}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
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
                    <input
                      type="number"
                      name="salary.min"
                      value={job.salary.min}
                      onChange={handleInputChange}
                      placeholder="Tối thiểu"
                      min={0}
                      className="w-1/3 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                      disabled={isLoading}
                      required
                    />
                    <input
                      type="number"
                      name="salary.max"
                      value={job.salary.max}
                      onChange={handleInputChange}
                      placeholder="Tối đa"
                      min={0}
                      className="w-1/3 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
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
                  <input
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
                  <input
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
              <textarea
                name="description"
                value={job.description}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết về công việc (ít nhất 10 ký tự)..."
                minLength={10}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                disabled={isLoading}
                rows={6}
                required
              />
            </div>

            {/* Yêu cầu */}
            <div className="mt-6">
              <label className="text-gray-500 dark:text-gray-400 text-sm font-medium block mb-2">
                <DocumentTextIcon className="w-5 h-5 inline mr-1" />
                Yêu cầu
              </label>
              {job.requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
                    placeholder={`Yêu cầu ${index + 1} (không để trống)`}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => removeArrayItem("requirements", index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors"
                    disabled={isLoading}
                  >
                    Xóa
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem("requirements")}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
                disabled={isLoading}
              >
                Thêm yêu cầu
              </button>
            </div>

            {/* Phúc lợi */}
            <div className="mt-6">
              <label className="text-gray-500 dark:text-gray-400 text-sm font-medium block mb-2">
                <DocumentTextIcon className="w-5 h-5 inline mr-1" />
                Phúc lợi
              </label>
              {job.benefits.map((ben, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={ben}
                    onChange={(e) => handleArrayChange("benefits", index, e.target.value)}
                    placeholder={`Phúc lợi ${index + 1} (không để trống)`}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => removeArrayItem("benefits", index)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors"
                    disabled={isLoading}
                  >
                    Xóa
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem("benefits")}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
                disabled={isLoading}
              >
                Thêm phúc lợi
              </button>
            </div>

            {/* Nút hành động */}
            <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Đang lưu..." : isCreating ? "Đăng" : "Lưu"}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:ring-2 focus:ring-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Hủy
              </button>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default PostJob;