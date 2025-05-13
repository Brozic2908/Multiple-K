// services/answerService.js
import api from "./api";

const answerService = {
  getAnswers: (questionId) => {
    return api.get(`/answers?question_id=${questionId}`);
  },
  createAnswer: (answerData) => {
    return api.post("/answers", answerData);
  },
  updateAnswer: (id, content) => {
    return api.put(`/answers/${id}`, { content });
  },
  deleteAnswer: (id) => {
    return api.delete(`/answers/${id}`);
  },
};

export default answerService;
