import api from "./api";

// upload avatar và CV dùng FormData
export const updateProfile = (formData) => 
  api.put("/users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getProfile = () => api.get("/users/profile");
