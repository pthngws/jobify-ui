import api from "./api";

export const createCompany = (data) => api.post("/companies", data);
export const getAllCompanies = () => api.get("/companies");
export const getCompanyById = (id) => api.get(`/companies/${id}`);
export const updateCompany = (id, data) => api.put(`/companies/${id}`, data);
export const deleteCompany = (id) => api.delete(`/companies/${id}`);
