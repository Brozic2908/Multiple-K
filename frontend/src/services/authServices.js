// services/authService.js
import api from "./api";

const authService = {
  login: (email, password) => {
    return api.post("/auth/login", { email, password });
  },
  register: (userData) => {
    return api.post("/auth/register", userData);
  },
};

export default authService;
