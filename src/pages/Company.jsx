import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import {
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../services/companyService";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

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
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
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
          setAlert({
            show: true,
            message: "Chỉ nhà tuyển dụng được phép quản lý công ty!",
            type: "error",
          });
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
                setAlert({
                  show: true,
                  message: "Không thể tải thông tin công ty!",
                  type: "error",
                });
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
      setAlert({
        show: true,
        message: "File avatar không được vượt quá 5MB!",
        type: "error",
      });
      return;
    }
    setAvatarFile(file);
  };

  const validateInputs = () => {
    if (!company.name.trim()) {
      setAlert({
        show: true,
        message: "Tên công ty là bắt buộc!",
        type: "error",
      });
      return false;
    }
    if (!company.location.trim()) {
      setAlert({
        show: true,
        message: "Địa điểm là bắt buộc!",
        type: "error",
      });
      return false;
    }
    if (company.website && !/^https?:\/\/.+/.test(company.website)) {
      setAlert({
        show: true,
        message: "Website không hợp lệ! Vui lòng bắt đầu bằng http:// hoặc https://",
        type: "error",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setAlert({ show: false, message: "", type: "success" });

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
      setAlert({
        show: true,
        message: isCreating ? "Tạo công ty thành công!" : "Cập nhật công ty thành công!",
        type: "success",
      });
    } catch (err) {
      setAlert({
        show: true,
        message: err.response?.data?.message || "Lưu thông tin công ty thất bại!",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa công ty này?")) return;

    setAlert({ show: false, message: "", type: "success" });
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
      setAlert({
        show: true,
        message: "Xóa công ty thành công!",
        type: "success",
      });
    } catch (err) {
      setAlert({
        show: true,
        message: err.response?.data?.message || "Xóa công ty thất bại!",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAlert({ show: false, message: "", type: "success" });
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
          setAlert({
            show: true,
            message: "Không thể tải lại thông tin công ty!",
            type: "error",
          });
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
                {alert.show && (
                  <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ show: false, message: "", type: "success" })}
                  />
                )}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="w-24 text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Tên công ty
                    </label>
                    {isEditing ? (
                      <Input
                        type="text"
                        name="name"
                        value={company.name}
                        onChange={handleInputChange}
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
                      <Textarea
                        name="description"
                        value={company.description}
                        onChange={handleInputChange}
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
                      <Input
                        type="text"
                        name="location"
                        value={company.location}
                        onChange={handleInputChange}
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
                      <Input
                        type="text"
                        name="website"
                        value={company.website}
                        onChange={handleInputChange}
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
                      <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Đang lưu..." : isCreating ? "Tạo" : "Lưu"}
                      </Button>
                      <Button variant="danger" onClick={handleCancel} disabled={isLoading}>
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => setIsEditing(true)}>
                        {isCreating ? "Tạo công ty" : "Chỉnh sửa"}
                      </Button>
                      {!isCreating && (
                        <Button
                          variant="danger"
                          onClick={handleDelete}
                          disabled={isLoading}
                        >
                          Xóa công ty
                        </Button>
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