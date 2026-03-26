import api from "../utils/api";

export const registerUser = (formData) => api.post("/auth/register", formData);
export const loginUser = (formData) => api.post("/auth/login", formData);
export const logoutUser = () => api.post("/auth/logout");