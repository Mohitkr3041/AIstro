import api from "../utils/api";

export const generateAstroReport = () => api.post("/astro/generate", {});