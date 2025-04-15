import api from "./api";

export const createJob = (data) =>
  api.post("/jobs", data, {
    headers: { "Content-Type": "application/json" },
  });

export const getAllJobs = () => api.get("/jobs");

export const searchJobs = (params) => api.get("/jobs/search", { params });

export const getJobById = (id) => api.get(`/jobs/${id}`);

export const getJobsByCompany = (companyId) =>
  api.get(`/jobs/company/${companyId}`);

export const updateJob = (id, data) =>
  api.put(`/jobs/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });

export const deleteJob = (id) => api.delete(`/jobs/${id}`);