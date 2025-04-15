import api from "./api";

export const createApplication = (data) => api.post("/applications", data);
export const getAllApplicationsByJobId = (jobId) => api.get(`/applications/job/${jobId}`);
export const getMyApplications = () => api.get("/applications/me");
export const getApplicationById = (id) => api.get(`/applications/${id}`);
export const updateApplicationStatus = (id, data) => api.put(`/applications/${id}`, data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);
