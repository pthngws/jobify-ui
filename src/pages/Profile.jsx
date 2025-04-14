import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import { getProfile, updateProfile } from "../services/userService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "",
    avatarUrl: "",
    resumeUrl: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
        setIsLoading(true);
        getProfile()
          .then((response) => {
            const userData = response.data.user;
            setProfile({
              fullName: userData.fullName || parsedUser.fullName || "",
              email: userData.email || parsedUser.email || "",
              role: userData.role || parsedUser.role || "",
              avatarUrl: userData.avatarUrl || parsedUser.avatarUrl || "",
              resumeUrl: userData.resumeUrl || parsedUser.resumeUrl || "",
            });
          })
          .catch((err) => {
            console.error("Lỗi lấy hồ sơ:", err);
            setError("Không thể tải thông tin hồ sơ!");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            navigate("/login");
          })
          .finally(() => setIsLoading(false));
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
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSave = async () => {
    setError("");
    setSuccessMessage("");
    const formData = new FormData();
    formData.append("fullname", profile.fullName);

    if (avatarFile) formData.append("avatar", avatarFile);
    if (resumeFile) formData.append("cv", resumeFile);

    setIsLoading(true);
    try {
      const response = await updateProfile(formData);
      const updatedUser = response.data.user || response.data;
      setProfile({
        fullName: updatedUser.fullName || profile.fullName,
        email: updatedUser.email || profile.email,
        role: updatedUser.role || profile.role,
        avatarUrl: updatedUser.avatarUrl || profile.avatarUrl,
        resumeUrl: updatedUser.resumeUrl || profile.resumeUrl,
      });
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setAvatarFile(null);
      setResumeFile(null);
      setIsEditing(false);
      setSuccessMessage("Cập nhật hồ sơ thành công!");
    } catch (err) {
      setError(err.response?.data?.error || "Cập nhật hồ sơ thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setResumeFile(null);
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    getProfile()
      .then((response) => {
        const userData = response.data.user;
        setProfile({
          fullName: userData.fullName || "",
          email: userData.email || "",
          role: userData.role || "",
          avatarUrl: userData.avatarUrl || "",
          resumeUrl: userData.resumeUrl || "",
        });
      })
      .catch((err) => {
        console.error("Lỗi tải lại hồ sơ:", err);
        setError("Không thể tải lại hồ sơ!");
      })
      .finally(() => setIsLoading(false));
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
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
          : profile.avatarUrl || "https://via.placeholder.com/256"
      }
      alt="User Avatar"
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
              {/* Tiêu đề */}
              <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                Thông Tin Hồ Sơ
              </h2>

              {/* Messages */}
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

              {/* Thông tin */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="w-24 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      disabled={isLoading}
                    />
                  ) : (
                    <p className="flex-1 text-gray-700 dark:text-gray-200">
                      {profile.fullName || "Chưa cập nhật"}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="w-24 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Email
                  </label>
                    <p className="flex-1 text-gray-700 dark:text-gray-200">
                      {profile.email || "Chưa cập nhật"}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="w-24 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Vai trò
                  </label>
                  <p className="flex-1 text-gray-700 dark:text-gray-200 capitalize">
                    {profile.role === "candidate" ? "Ứng viên" : "Nhà tuyển dụng"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="w-24 text-gray-500 dark:text-gray-400 text-sm font-medium">
                    CV
                  </label>
                  {isEditing ? (
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeChange}
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="flex-1 items-center gap-2">
                      {profile.resumeUrl && (
                        <div className="flex justify-center items-start gap-2">
  {profile.resumeUrl ? (
    <button
      onClick={() =>
        navigate("/view-resume", {
          state: { resumeUrl: profile.resumeUrl },
        })
      }
      className="flex flex-row items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
      title="Xem CV"
    >
      <span>Xem CV</span>
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    </button>
  ) : (
    <span className="text-gray-700 dark:text-gray-200">Chưa tải lên</span>
  )}
</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang lưu..." : "Lưu"}
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
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-colors"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;