import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { questionService, answerService } from "../../services";
import "./adminQA.module.css";

export default function adminQA() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    limit: 10,
  });

  const [answerForm, setAnswerForm] = useState({
    content: "",
    question_id: null,
  });

  const [editAnswerId, setEditAnswersId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch questions on component mount and when pagination changes
  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (modalType === "edit-answer") {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [modalType]);

  // Fetch questions with optional search and pagination
  const fetchQuestions = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await questionService.getAdminQuestions(
        page,
        10,
        search
      );
      setQuestions(response.data.questions);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      console.error("Error fetching questions: ", err);
      setError("Failed to load questions. Please try again later.");
      toast.error("Error loading questions");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      fetchQuestions(1, searchTerm);
    }
  };

  // Chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.total_pages) {
      fetchQuestions(newPage, searchTerm);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Load question details
  const loadQuestionDetails = async (questionId) => {
    try {
      setAnswerLoading(true);
      const response = await questionService.getQuestionsByIdForAdmin(
        questionId
      );
      setSelectedQuestion(response.data);
      setAnswers(response.data.answers || []);

      // Thêm state vào history
      window.history.pushState(
        { questionId: questionId },
        "",
        `?question=${questionId}`
      );
    } catch (err) {
      console.error("Error fetching question details: ", err);
      if (err.response?.status === 403) {
        toast.error("You don't have permission to view this question");
      } else {
        toast.error("Error loading question details");
      }
    } finally {
      setAnswerLoading(false);
    }
  };

  // Open modal for adding/editing questions or answers
  const openModal = (type, item = null) => {
    setModalType(type);

    if (type === "answer" && item) {
      // Set form for new answer to a specify question
      setAnswerForm({
        content: "",
        question_id: item.id,
      });
      setEditAnswersId(null);
    } else if (type === "edit-answer" && item) {
      // Set form for editing answer
      setAnswerForm({
        content: item.content,
        question_id: selectedQuestion.id,
      });
      setEditAnswersId(item.id);
    }
  };

  // Close modal
  const closeModal = () => {
    setModalType(null);
  };

  // Handle answer form input changes
  const handleAnswerFormChange = (e) => {
    const { name, value } = e.target;
    setAnswerForm({
      ...answerForm,
      [name]: value,
    });
  };

  // Submit answer form (create or update)
  const submitAnswerForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!answerForm.content.trim()) {
      toast.error("Answer content is required");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editAnswerId) {
        // Update exiting answer
        await answerService.updateAnswer(editAnswerId, answerForm.content);
        toast.success("Answer updated successfully");
      } else {
        // Create new answer
        await answerService.createAnswer(answerForm);
        toast.success("Answer submitted successfully");
      }

      // Refresh lại danh sách answer
      if (selectedQuestion) {
        loadQuestionDetails(selectedQuestion.id);
      }
      closeModal();
    } catch (err) {
      console.error("Error submitting answer: ", err);
      toast.error(err.response?.data?.message || "Error submitting answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a question
  const deleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this questions?")) {
      return;
    }

    try {
      await questionService.deleteQuestion(questionId);
      toast.success("Question deleted successfully");

      // If the deleted question was seleceted, clear
      if (selectedQuestion && selectedQuestion.id === questionId) {
        setSelectedQuestion(null);
        setAnswers([]);
      }

      // Refresh questions list
      fetchQuestions(pagination.current_page, searchTerm);
    } catch (err) {
      console.error("Error deleting question: ", err);
      toast.error("Error deleting question");
    }
  };

  // Delete an answer
  const deleteAnswer = async (answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) {
      return;
    }

    try {
      await answerService.deleteAnswer(answerId);
      toast.success("Answer deleted successfully");

      // Refresh question details to reflect the deleted answer
      if (selectedQuestion) {
        loadQuestionDetails(selectedQuestion.id);
      }
    } catch (err) {
      console.error("Error deleting answer:", err);
      toast.error("Error deleting answer");
    }
  };

  // Update question status (approve/reject)
  const updateQuestionStatus = async (questionId, status) => {
    try {
      await questionService.updateQuestionStatus(questionId, status);
      toast.success(
        `Question ${
          status === "approved" ? "approved" : "rejected"
        } successfully`
      );

      // Refreshing questions list
      fetchQuestions(pagination.current_page, searchTerm);

      // Update selected question if it's the one being updated
      if (selectedQuestion && selectedQuestion.id === questionId) {
        setSelectedQuestion({
          ...selectedQuestion,
          status: status,
        });
      }
    } catch (err) {
      console.error("Error updating question status:", err);
      toast.error("Error updating question status");
    }
  };

  useEffect(() => {
    const handlePopState = (event) => {
      // Nếu không có dữ liệu về questionId, nghĩa là quay về trang danh sách
      if (!event.state || !event.state.questionId) {
        setSelectedQuestion(null);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div className="p-sm-4 p-0 container-fluid page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Questions & Answers Management</h3>
            <p className="text-subtitle text-muted">
              Manage all questions and answers on the Q&A platform
            </p>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/admin">Dashboard</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Q&A Management
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {!selectedQuestion && (
        <section className="section">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Questions List</h4>
                  </div>
                </div>
                <div className="card-body px-sm-3 p-1">
                  <div className="my-3">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                      />
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover table-striped mb-0">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th className="d-table-cell">Title</th>
                            <th className="d-none d-md-table-cell">Email</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {questions.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No questions found
                              </td>
                            </tr>
                          ) : (
                            questions.map((question, index) => (
                              <tr key={question.id}>
                                <td>
                                  {(pagination.current_page - 1) *
                                    pagination.limit +
                                    index +
                                    1}
                                </td>
                                <td className="d-table-cell">
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      loadQuestionDetails(question.id);
                                    }}
                                    className="text-decoration-none text-black w-100"
                                  >
                                    {question.title}
                                  </a>
                                </td>
                                <td className="d-none d-md-table-cell">
                                  {question.email || "-"}
                                </td>
                                <td>
                                  <span
                                    className={`badge bg-${
                                      question.status === "approved"
                                        ? "success"
                                        : question.status === "rejected"
                                        ? "danger"
                                        : "warning"
                                    }`}
                                    style={{ fontSize: "12px" }}
                                  >
                                    {question.status || "pending"}
                                  </span>
                                </td>
                                <td>
                                  {question.created_at
                                    ? formatDate(question.created_at)
                                    : "-"}
                                </td>
                                <td>
                                  <div className="d-flex">
                                    {question.status !== "approved" && (
                                      <button
                                        className="btn btn-sm btn-success me-1"
                                        onClick={() =>
                                          updateQuestionStatus(
                                            question.id,
                                            "approved"
                                          )
                                        }
                                        title="Approved"
                                      >
                                        <i className="fa-regular fa-circle-check"></i>
                                      </button>
                                    )}
                                    {question.status !== "pending" && (
                                      <button
                                        className="btn btn-sm btn-warning me-1"
                                        onClick={() =>
                                          updateQuestionStatus(
                                            question.id,
                                            "pending"
                                          )
                                        }
                                        title="Pending"
                                      >
                                        <i className="fa-regular fa-clock"></i>
                                      </button>
                                    )}

                                    {question.status !== "rejected" && (
                                      <button
                                        className="btn btn-sm btn-danger me-1"
                                        onClick={() =>
                                          updateQuestionStatus(
                                            question.id,
                                            "rejected"
                                          )
                                        }
                                        title="Reject"
                                      >
                                        <i className="fa-regular fa-circle-xmark"></i>
                                      </button>
                                    )}
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() =>
                                        deleteQuestion(question.id)
                                      }
                                      title="Delete"
                                    >
                                      <i className="fa-regular fa-trash-can"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination && pagination.total_pages > 1 && (
                    <nav aria-label="Page navigation" className="mt-3">
                      <ul className="pagination justify-content-center">
                        <li
                          className={`page-item ${
                            pagination.current_page === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              handlePageChange(pagination.current_page - 1)
                            }
                          >
                            <i className="fa-solid fa-chevron-left"></i>
                          </button>
                        </li>
                        {Array.from(
                          { length: pagination.total_pages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <li
                            key={page}
                            className={`page-item ${
                              pagination.current_page === page ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        <li
                          className={`page-item ${
                            pagination.current_page === pagination.total_pages
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              handlePageChange(pagination.current_page + 1)
                            }
                          >
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Question Details Section */}
      {selectedQuestion && (
        <section className="section">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-end">
                    <button
                      className="btn btn-outline-secondary me-3"
                      onClick={() => {
                        setSelectedQuestion(null);
                        window.history.pushState(
                          {},
                          "",
                          window.location.pathname
                        );
                      }}
                    >
                      <i className="fa-solid fa-arrow-left me-1"></i> Back
                    </button>
                    <h4 className="mb-0">Question Details</h4>
                    <button
                      className="btn btn-primary"
                      onClick={() => openModal("answer", selectedQuestion)}
                    >
                      <i className="fa-solid fa-comment-medical"></i> Add Answer
                    </button>
                  </div>
                </div>
                <div className="card-body pb-0">
                  <div className="question-details my-4">
                    <h4>{selectedQuestion.title}</h4>
                    <div className="d-flex mb-2">
                      <span className="me-3 text-muted">
                        <i className="fa-regular fa-circle-user me-2"></i>
                        {selectedQuestion.user_name ||
                          selectedQuestion.email ||
                          "Anonymous"}
                      </span>
                      <span className="me-3 text-muted">
                        <i className="fa-regular fa-calendar me-2"></i>
                        {formatDate(selectedQuestion.created_at)}
                      </span>
                      <span
                        className={`badge bg-${
                          selectedQuestion.status === "approved"
                            ? "success"
                            : selectedQuestion.status === "rejected"
                            ? "danger"
                            : "warning"
                        }`}
                      >
                        {selectedQuestion.status || "pending"}
                      </span>
                    </div>
                    <div className="question-content p-3 bg-light rounded">
                      {selectedQuestion.content}
                    </div>
                  </div>

                  <h4>Answers ({answers.length})</h4>
                  {answerLoading ? (
                    <div className="text-center py-3">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : answers.length === 0 ? (
                    <div className="alert alert-info">
                      No answers yet for this question.
                    </div>
                  ) : (
                    <div className="answers-list">
                      {answers.map((answer) => (
                        <div key={answer.id} className="answer-item card mb-3">
                          <div
                            className="card-body"
                            style={{ minHeight: "100px" }}
                          >
                            <div className="answer-content">
                              {answer.content}
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <div className="answer-meta">
                                <span className="me-3 text-muted">
                                  <i className="fa-regular fa-circle-user me-2"></i>
                                  {answer.user_name || "Admin"}
                                </span>
                                <span className="text-muted">
                                  <i className="fa-regular fa-calendar me-2"></i>
                                  {formatDate(answer.created_at)}
                                </span>
                              </div>
                              <div className="answer-actions">
                                <button
                                  className="btn btn-sm btn-primary me-1"
                                  onClick={() =>
                                    openModal("edit-answer", answer)
                                  }
                                >
                                  <i className="fa-regular fa-pen-to-square"></i>{" "}
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => deleteAnswer(answer.id)}
                                >
                                  <i className="fa-regular fa-trash-can"></i>{" "}
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Add/Edit Answer Modal */}
      {(modalType === "answer" || modalType === "edit-answer") && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "answer" ? "Add New Answer" : "Edit Answer"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <form onSubmit={submitAnswerForm}>
                <div className="modal-body">
                  <div className="form-group mb-3">
                    <label htmlFor="answerContent" className="form-label">
                      Answer Content <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="answerContent"
                      name="content"
                      rows="5"
                      value={answerForm.content}
                      onChange={handleAnswerFormChange}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : null}
                    {modalType === "answer" ? "Submit Answer" : "Update Answer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
