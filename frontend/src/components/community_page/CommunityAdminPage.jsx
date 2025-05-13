import { useEffect, useState } from "react";
import articleCommentService from "../../services/articleCommentService";
import articleService from "../../services/articleService";
import "./CommunityAdminPage.css";

export default function CommunityAdminPage() {
  const [articles, setArticles] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    content: "",
    image_url: "",
  });
  const [modalArticle, setModalArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await articleService.getArticles();
      setArticles(res.data.articles || []);
    } catch (error) {
      console.error("Error fetching articles", error);
    }
  };

  const fetchComments = async (articleId) => {
    try {
      const res = await articleCommentService.getComments(articleId);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.description || !newPost.content || !newPost.image_url) return;

    try {
      if (isEditing) {
        await articleService.updateArticle(newPost.id, newPost);
      } else {
        await articleService.createArticle(newPost);
      }
      await fetchArticles(); 

      setNewPost({ title: "", description: "", content: "", image_url: "" });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving article", error);
    }
  };

  const handleEdit = (article) => {
    setNewPost(article);
    setIsEditing(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    try {
      await articleService.deleteArticle(id);
      setArticles(articles.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting article", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await articleCommentService.deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const indexOfLast = currentPage * articlesPerPage;
  const indexOfFirst = indexOfLast - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  return (
    <div className="admin-page container py-5">
      <div className="card shadow-sm p-4 mb-5">
        <h4 className="mb-3">{isEditing ? "✏️ Edit Article" : "✍️ Add New Article"}</h4>
        <form onSubmit={handleAdd}>
          <div className="mb-3">
            <label className="form-label">Article Title</label>
            <input type="text" className="form-control" name="title" value={newPost.title} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Short Description</label>
            <textarea className="form-control" name="description" value={newPost.description} onChange={handleChange} rows={3}></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Full Content</label>
            <textarea className="form-control" name="content" value={newPost.content} onChange={handleChange} rows={10}></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input type="text" className="form-control" name="image_url" value={newPost.image_url} onChange={handleChange} />
          </div>

          {newPost.image_url && (
            <div className="mb-3">
              <img src={newPost.image_url} alt="Preview" className="img-fluid rounded" style={{ maxHeight: "200px" }} />
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            {isEditing ? "Update Article" : "Publish Article"}
          </button>
        </form>
      </div>

      <div className="article-list card shadow-sm p-4">
        <h4 className="mb-3">📑 Article List ({articles.length})</h4>
        {articles.length === 0 ? (
          <p className="text-muted">No articles available.</p>
        ) : (
          <>
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentArticles.map((article, index) => (
                  <tr key={article.id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>
                      <img src={article.image_url} alt={article.title} style={{ width: "60px", height: "40px", objectFit: "cover" }} />
                    </td>
                    <td>{article.title}</td>
                    <td>{new Date(article.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-info me-1" onClick={() => { setModalArticle(article); fetchComments(article.id); }}>View</button>
                      <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(article)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(article.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex justify-content-center mt-3">
              <nav>
                <ul className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </>
        )}
      </div>

      {modalArticle && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">📰 {modalArticle.title}</h5>
                <button type="button" className="btn-close" onClick={() => setModalArticle(null)}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <img src={modalArticle.image_url} alt={modalArticle.title} className="img-fluid mb-3 rounded" />
                <p><strong>Description:</strong> {modalArticle.description}</p>
                <div><strong>Content:</strong></div>
                <div style={{ whiteSpace: "pre-line" }}>{modalArticle.content}</div>
                <hr />
                <div><strong>Comments:</strong></div>
                {comments.length === 0 ? (
                  <p className="text-muted">No comments found.</p>
                ) : (
                  <ul className="list-group">
                    {comments.map((c) => (
                      <li key={c.id} className="list-group-item d-flex justify-content-between align-items-start">
                        <div>{c.content}</div>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteComment(c.id)}>Delete</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalArticle(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}