import styles from "./questionPage.module.css";
import { useState, useEffect } from "react";
import Asking from "./asking";
import { questionService } from "../../services";
import { useNavigate } from "react-router-dom";

export default function QuestionPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    limit: 10,
  });

  const handleQuestionClick = (questionId) => {
    navigate(`/questions/${questionId}`);
  };

  // Lấy danh sách câu hỏi
  const fetchQuestions = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await questionService.getQuestions(page, 10, search);
      setQuestions(response.data.questions);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(
        "Đã xảy ra lỗi khi tải danh sách câu hỏi. Vui lòng thử lại sau."
      );
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm câu hỏi
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

  // Tải danh sách câu hỏi khi component được tạo
  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <>
      <div>
        <div className={`${styles.faqHeader} text-center`}>
          <h2 className={styles.faqTitle}>Q&A</h2>
        </div>
        <div className={`${styles.faqContain} container-md`}>
          <div className="row justify-content-between mb-5">
            <div className="col-md-7 mt-4 ms-2">
              <div className={`${styles.faqSearch} input-group`}>
                <label htmlFor="faqSearchInput" className="input-group-text">
                  <i
                    className={`${styles.faqSearchIcon} fa-solid fa-magnifying-glass`}
                  ></i>
                </label>
                <input
                  type="text"
                  id="faqSearchInput"
                  className="form-control"
                  placeholder="Tìm kiếm câu hỏi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                ></input>
              </div>
            </div>
            <div className="col-md-2 mt-4">
              <div
                className={`btn btn-danger ${styles.addQuestionBtn}`}
                onClick={() => setShowModal(false)}
              >
                <i className="fa-solid fa-plus me-2"></i>Đặt câu hỏi mới
              </div>
            </div>
          </div>
          {showModal ? (
            <>
              <div className={styles.listTitle}>ALL</div>
              {loading ? (
                <div className="text-center my-5">
                  <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : (
                <div className={styles.faqList}>
                  <table className="table table-striped mb-4">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="col-md-1 text-center d-none d-sm-table-cell"
                        >
                          #
                        </th>
                        <th scope="col" className="col-md-9 d-table-cell">
                          Question
                        </th>
                        <th
                          scope="col"
                          className="col-md-2 text-center d-none d-sm-table-cell"
                        >
                          Answer
                        </th>
                      </tr>
                    </thead>
                    <tbody className="table-group-divider">
                      {questions && questions.length > 0 ? (
                        questions.map((q, index) => (
                          <tr
                            key={q.id}
                            className={styles.faqRow}
                            onClick={() => handleQuestionClick(q.id)}
                          >
                            <th className="col-md-1 text-center d-none d-sm-table-cell">
                              {(pagination.current_page - 1) *
                                pagination.limit +
                                index +
                                1}
                            </th>
                            <td className="d-table-cell">{q.title}</td>
                            <td className="col-md-2 text-center d-none d-sm-table-cell">
                              <i className="fa-regular fa-comment me-1"></i>
                              {q.answer_count}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            Không tìm thấy câu hỏi nào
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Phân trang */}
                  {pagination && pagination.total_pages > 1 && (
                    <nav aria-label="Page navigation">
                      <ul className="pagination justify-content-center">
                        <li
                          className={`page-item ${
                            pagination.current_page === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link page-hover"
                            onClick={() =>
                              handlePageChange(pagination.current_page - 1)
                            }
                          >
                            {"<"}
                          </button>
                        </li>

                        {/* Hiển thị số trang */}
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
                            {">"}
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </div>
              )}
            </>
          ) : (
            <Asking
              onSubmit={() => setShowModal(true)}
              onCancel={() => setShowModal(true)}
            />
          )}
        </div>
      </div>
    </>
  );
}
