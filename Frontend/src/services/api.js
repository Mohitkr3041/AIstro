import axios from "axios";

const API = axios.create({
  baseURL: "https://aistro-01sa.onrender.com",
  withCredentials: true,
});

export default API;