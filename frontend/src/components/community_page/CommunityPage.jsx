import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import articleService from "../../services/articleService";
import "./CommunityPage.css";

export default function CommunityPage() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await articleService.getArticles();
        setArticles(res.data.articles); // Giả sử API trả về { articles: [...] }
      } catch (error) {
        console.error("Failed to fetch articles", error);
      }
    };

    fetchData();
  }, []);

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="community-page">
      <div className="container">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="form-control bg-light text-dark"
          />
        </div>

        <div className="row g-4">
          {currentArticles.map((article) => (
            <div key={article.id} className="col-12 col-sm-6 col-lg-4">
              <Link to={`/community/${article.id}`} className="community-card text-decoration-none">
              <img src={article.image_url} alt={article.title} className="community-img" />
                <div className="community-body">
                  <h5 className="community-title mb-2">{article.title}</h5>
                  <p className="community-desc small mb-2">{article.description}</p>
                  <p className="community-date text-muted small mb-0 mt-auto">
                    {new Date(article.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination community-pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                    &lt;
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                    &gt;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
