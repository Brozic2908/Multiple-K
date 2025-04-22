import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "./CommunityDetailPage.css";

export function CommunityDetailPage() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    setComments([
      ...comments,
      { text: newComment.trim(), date: new Date().toLocaleString() },
    ]);
    setNewComment("");
  };

  return (
    <div className="community-detail">
      <div className="detail-container">
        <div className="detail-header">
          <div className="detail-title">Tiêu đề bài viết {id}</div>
          <div className="detail-meta">Tác giả: Khánh Nguyễn | Đăng ngày: 22/03/2025</div>
        </div>

        <img
          src={`https://storage-asset.msi.com/global/picture/article/article_1742882133d0fc9248570336ab76ee0c227f353ee0.jpeg`}
          alt="Ảnh minh họa"
          className="detail-image"
        />

        <div className="detail-body">
          <p>
            Đây là nội dung chi tiết của bài viết #{id}. Bài viết có thể chứa
            nhiều đoạn văn bản, hình ảnh và liên kết đến các sản phẩm liên quan.
          </p>
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
              {comments.map((comment, index) => (
                <li key={index} className="comment-item">
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-date">{comment.date}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}