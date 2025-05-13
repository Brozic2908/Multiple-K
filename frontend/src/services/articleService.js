import api from "./api";

const articleService = {
  getArticles: (page = 1, limit = 9, search = "") => {
    return api.get(`/articles?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  },

  getArticleById: (id) => {
    return api.get(`/articles/${id}`);
  },

  createArticle: (articleData) => {
    return api.post("/articles", articleData);
  },

  updateArticle: (id, articleData) => {
    return api.put(`/articles/${id}`, articleData);
  },

  deleteArticle: (id) => {
    return api.delete(`/articles/${id}`);
  },
};

export default articleService;