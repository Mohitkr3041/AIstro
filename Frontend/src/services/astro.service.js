import api from "../utils/api";

export const generateAstroReport = (options = {}) => api.post("/astro/generate", options);
