import { questionService } from "../../services";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import styles from "./questionDetail.module.css";

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestions] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answerLoading, setAnswersLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestionsAndAnswers = async () => {
      try {
        setLoading(true);

        // fetch question default;
        const questionResponse = await questionService.getQuestionsById(id);
        setQuestions(questionResponse.data);
        setAnswers(questionResponse.data.answers);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải xuống câu hỏi. Vui lòng thử lại sau.");
        toast.error("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsAndAnswers();
  }, [id]);

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

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="my-4 pt-3 container">
          <Link
            to="/questions"
            className={`text-secondary text-decoration-none ${styles.questionDetailBtnBack}`}
          >
            <i className="fa-solid fa-arrow-left me-2"></i>
            Quay lại
          </Link>
        </div>
        <div className="container my-4">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="container my-4 pt-4">
      <Link
        to="/questions"
        className={`text-secondary text-decoration-none ${styles.questionDetailBtnBack}`}
      >
        <i className="fa-solid fa-arrow-left me-2"></i>
        Quay lại
      </Link>

      {question && (
        <>
          <div className={`p-md-5 p-0 m-md-5 m-0 ${styles.boxCard}`}>
            <div className={styles.questionHeader}>
              <h1 className={styles.questionTitle}>{question.title}</h1>
              <div className={styles.questionMeta}>
                <span className={styles.createDate}>
                  <i className="fa-regular fa-clock me-2"></i>
                  {formatDate(question.created_at)}
                </span>
                {question.user_name && (
                  <div className={styles.author}>
                    <i className="fa-regular fa-user me-2"></i>
                    Asked by {question.user_name}
                  </div>
                )}
              </div>
            </div>

            <h4 className={styles.titleQA}>Question:</h4>
            <div className={styles.questionCard}>
              <div className={styles.textContent}>
                <div>{question.content}</div>
              </div>
              <div className={styles.questionFooter}>
                <span className={styles.answerCount}>
                  <i className="fa-regular fa-comment me-1 mt-2"></i>
                  {answers.length} câu trả lời
                </span>
              </div>
            </div>

            <h4 className={styles.titleQA}>Answer:</h4>
            <div className={styles.textContent}>
              {answers && answers.length > 0 ? (
                answers.map((answer) => (
                  <div key={answer.id} className={styles.answerCard}>
                    <div className={styles.textContent}>
                      <p>{answer.content}</p>
                    </div>
                    <div className={styles.answerFooter}>
                      <div className={styles.answerMeta}>
                        <div className={styles.answerDate}>
                          <i className="fa-regular fa-clock me-2"></i>
                          {formatDate(answer.created_at)}
                        </div>
                        {answer.user_name && (
                          <span className={styles.answerAuthor}>
                            <i className="fa-regular fa-user me-2"></i>
                            Answer by {answer.user_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="alert alert-info mt-3">
                  Chưa có câu trả lời nào cho câu hỏi này.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
