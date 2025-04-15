import api from "./api";

export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
export const completeRegistration = (data) => api.post("/auth/complete-registration", data);
export const forgetPassword = (data) => api.post("/auth/forgot-password", data);
export const resetPassword = (data) => api.post("/auth/reset-password", data);
export const refreshToken = () => api.post("/auth/refresh-token");
