import api from "../utils/api";

export const askAstroChat = (message) =>
  api.post("/chat/ask", { message });

export const getChatHistory = () => api.get("/chat/history");
