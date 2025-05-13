// src/services/articleCommentService.js
import api from "./api";

const articleCommentService = {
  getComments: (articleId) =>
    api.get(`/article-comments?article_id=${articleId}`),

  createComment: (commentData) =>
    api.post("/article-comments", commentData),

  getCommentsByArticleId: (articleId) => {
    return api.get(`/article-comments?article_id=${articleId}`);
  },

  deleteComment: (id) => {
    return api.delete(`/article-comments/${id}`);
  },
};

export default articleCommentService;
