// services/userService.js
import api from "./api";

const userService = {
  getAll: () => api.get("/admin/users"),
  getById: (id) => api.get(`/admin/users/${id}`),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
};

export default userService;
