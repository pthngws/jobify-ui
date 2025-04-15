import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import {
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../services/companyService";

const Company = () => {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState({
    name: "",
    description: "",
    location: "",
    website: "",
    avatarUrl: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser.role !== "recruit") {
          setError("Chỉ nhà tuyển dụng được phép quản lý công ty!");
          return;
        }

        setIsLoading(true);
        if (parsedUser.company) {
          getCompanyById(parsedUser.company)
            .then((response) => {
              const companyData = response.data.data;
              setCompany({
                name: companyData.name || "",
                description: companyData.description || "",
                location: companyData.location || "",
                website: companyData.website || "",
                avatarUrl: companyData.avatarUrl || "",
              });
            })
            .catch((err) => {
              if (err.response?.status === 404) {
                setIsCreating(true);
              } else {
                setError("Không thể tải thông tin công ty!");
              }
            })
            .finally(() => setIsLoading(false));
        } else {
          setIsCreating(true);
          setIsLoading(false);
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
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError("File avatar không được vượt quá 5MB!");
      return;
    }
    setAvatarFile(file);
  };

  const validateInputs = () => {
    if (!company.name.trim()) {
      setError("Tên công ty là bắt buộc!");
      return false;
    }
    if (!company.location.trim()) {
      setError("Địa điểm là bắt buộc!");
      return false;
    }
    if (company.website && !/^https?:\/\/.+/.test(company.website)) {
      setError("Website không hợp lệ! Vui lòng bắt đầu bằng http:// hoặc https://");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setError("");
    setSuccessMessage("");

    if (!validateInputs()) return;

    const formData = new FormData();
    formData.append("name", company.name.trim());
    formData.append("description", company.description.trim());
    formData.append("location", company.location.trim());
    formData.append("website", company.website.trim());
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

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
        name: updatedCompany.name || "",
        description: updatedCompany.description || "",
        location: updatedCompany.location || "",
        website: updatedCompany.website || "",
        avatarUrl: updatedCompany.avatarUrl || "",
      });
      setUser((prev) => ({ ...prev, company: updatedCompany._id }));
      localStorage.setItem("user", JSON.stringify({ ...user, company: updatedCompany._id }));
      setAvatarFile(null);
      setIsEditing(false);
      setIsCreating(false);
      setSuccessMessage(isCreating ? "Tạo công ty thành công!" : "Cập nhật công ty thành công!");
    } catch (err) {
      setError(err.response?.data?.message || "Lưu thông tin công ty thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa công ty này?")) return;

    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    try {
      await deleteCompany(user.company);
      setCompany({
        name: "",
        description: "",
        location: "",
        website: "",
        avatarUrl: "",
      });
      setUser((prev) => ({ ...prev, company: null }));
      localStorage.setItem("user", JSON.stringify({ ...user, company: null }));
      setIsCreating(true);
      setIsEditing(false);
      setSuccessMessage("Xóa công ty thành công!");
    } catch (err) {
      setError(err.response?.data?.message || "Xóa công ty thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setError("");
    setSuccessMessage("");
    if (!isCreating) {
      setIsLoading(true);
      getCompanyById(user.company)
        .then((response) => {
          const companyData = response.data.data;
          setCompany({
            name: companyData.name || "",
            description: companyData.description || "",
            location: companyData.location || "",
            website: companyData.website || "",
            avatarUrl: companyData.avatarUrl || "",
          });
        })
        .catch(() => {
          setError("Không thể tải lại thông tin công ty!");
        })
        .finally(() => setIsLoading(false));
    } else {
      setCompany({
        name: "",
        description: "",
        location: "",
        website: "",
        avatarUrl: "",
      });
    }
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Cột trái: Avatar */}
              <div className="flex flex-col">
                <div className="relative">
                  <img
                    src={
                      avatarFile
                        ? URL.createObjectURL(avatarFile)
                        : company.avatarUrl || "https://via.placeholder.com/256"
                    }
                    alt="Company Avatar"
                    className="w-64 h-64 rounded-full border-4 border-green-400 dark:border-green-700 object-cover"
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 translate-x-[-20%] translate-y-[-20%] bg-green-500 text-white p-3 rounded-full cursor-pointer hover:bg-green-600 transition-colors duration-200">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        disabled={isLoading}
                      />
                    </label>
                  )}
                </div>
              </div>
              {/* Cột phải: Thông tin và hành động */}
              <div className="sm:col-span-2 space-y-5">
                <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Thông Tin Công Ty
                </h2>
                {successMessage && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                    {successMessage}
                  </div>
                )}
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Tên công ty
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={company.name}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        disabled={isLoading}
                        required
                      />
                    ) : (
                      <p className="flex-1 text-gray-700 dark:text-gray-200">
                        {company.name || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Mô tả
                    </label>
                    {isEditing ? (
                      <textarea
                        name="description"
                        value={company.description}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        disabled={isLoading}
                        rows={4}
                      />
                    ) : (
                      <p className="flex-1 text-gray-700 dark:text-gray-200">
                        {company.description || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Địa điểm
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={company.location}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        disabled={isLoading}
                        required
                      />
                    ) : (
                      <p className="flex-1 text-gray-700 dark:text-gray-200">
                        {company.location || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="website"
                        value={company.website}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        disabled={isLoading}
                      />
                    ) : (
                      <p className="flex-1 text-gray-700 dark:text-gray-200">
                        {company.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {company.website}
                          </a>
                        ) : (
                          "Chưa cập nhật"
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        {isLoading ? "Đang lưu..." : isCreating ? "Tạo" : "Lưu"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:ring-2 focus:ring-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-colors"
                      >
                        {isCreating ? "Tạo công ty" : "Chỉnh sửa"}
                      </button>
                      {!isCreating && (
                        <button
                          onClick={handleDelete}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isLoading}
                        >
                          Xóa công ty
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Company;