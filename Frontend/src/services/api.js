import axios from "axios";

const api = axios.create({
  baseURL: "https://aistro-01sa.onrender.com",
  withCredentials: true
});

export default api;