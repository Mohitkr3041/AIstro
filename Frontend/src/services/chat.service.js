import api from "../utils/api";

export const askAstroChat = (message, mode = "general") =>
  api.post("/chat/ask", { message, mode });

export const getChatHistory = () => api.get("/chat/history");
