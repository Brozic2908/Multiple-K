// Services/api.js
import axios from "axios";

const API_URL = "http://localhost/web-hk242/backend";

const api = axios.create({
  baseURL: API_URL,
});

// Gắn token nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
