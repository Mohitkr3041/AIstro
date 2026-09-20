import api from "../utils/api";

export const generateAstroReport = (options = {}) => api.post("/astro/generate", options);
export const getGroundedReport = (options = {}) => api.post("/astro/grounded-report", options);
export const getGroundedEvidence = () => api.get("/astro/evidence");
