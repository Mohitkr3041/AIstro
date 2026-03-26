import api from "../utils/api";

export const saveBirthDetails = (formData) => api.post("/birth/save", formData);

export const getBirthDetails = () => api.get("/birth/me");