import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import articleCommentService from "../../services/articleCommentService"; // ✅ import mới
import articleService from "../../services/articleService";
import "./CommunityDetailPage.css";

export function CommunityDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Lấy dữ liệu bài viết và bình luận
  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleRes = await articleService.getArticleById(id);
        setArticle(articleRes.data.article);

        const commentRes = await articleCommentService.getComments(id);
        setComments(commentRes.data.comments || []);
      } catch (err) {
        console.error("Failed to load article or comments", err);
      }
    };

    fetchData();
  }, [id]);

  // Thêm bình luận mới
  const handleAddComment = async (e) => {
    e.preventDefault();
    const content = newComment.trim();
    if (!content) return;

    try {
      const res = await articleCommentService.createComment({ article_id: id, content });
      setComments((prev) => [...prev, res.data.comment]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to submit comment", err);
    }
  };

  if (!article) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="community-detail">
      <div className="detail-container">
        <div className="detail-header">
          <div className="detail-title">{article.title}</div>
          <div className="detail-meta">
            Đăng ngày: {new Date(article.created_at).toLocaleDateString()}
          </div>
        </div>

        <img src={article.image_url} alt={article.title} className="detail-image" />

        <div className="detail-body">
          <p>{article.content}</p>
        </div>

        <div className="comment-section">
          <div className="comment-title">
            <FontAwesomeIcon icon={faCommentDots} className="comment-icon" />
            Bình luận
          </div>

          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              className="comment-input"
              placeholder="Nhập bình luận của bạn..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            ></textarea>
            <button type="submit" className="comment-button">
              Gửi bình luận
            </button>
          </form>

          {comments.length === 0 ? (
            <div className="comment-empty">Chưa có bình luận nào.</div>
          ) : (
            <ul className="comment-list">
              {comments.map((comment) => (
                <li key={comment.id} className="comment-item">
                  <p className="comment-text">{comment.content}</p>
                  <div className="comment-date">
                    {comment.user_name && <b>{comment.user_name}</b>}{" "}
                    | {new Date(comment.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
