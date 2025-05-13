import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import axios from "axios";
import "./ProductList.css";
import { NavLink } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({ tag: "", brand: "", search: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState(""); 
  const [totalPages, setTotalPages] = useState(1); 
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchProducts();
  }, [limit, page,sortBy]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost/web-hk242/backend/products/${page}/${limit}${sortBy ? `?sort=${sortBy}` : ""}`
        , { headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }, }
      );
      setProducts(res.data.data || []);
      setTotalPages(Math.ceil((res.data.total || 0) / limit));
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Confirm delete?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn chưa đăng nhập hoặc không có quyền xóa.");
        return;
      }

      await axios.delete(`http://localhost/web-hk242/backend/products/${id}`,
        { headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }, }
      );
      fetchProducts();
    } catch {
      alert("Delete failed");
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch = !filter.search || (
      p.name?.toLowerCase().includes(filter.search.toLowerCase()) ||
      String(p.id).includes(filter.search) ||
      String(p.brand.toLowerCase()).includes(filter.search.toLowerCase()) ||
      (p.tags && p.tags.some(tag => tag.toLowerCase().includes(filter.search.toLowerCase())))    
    );
    return matchSearch;
  });

  return (
    <div className="container-fluid p-2">
      <h5 className="fw-bold mb-3">Best Selling Products</h5>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <select className="form-select" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            <option value={5}>Show: 5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={36}>36</option>
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="published">Sort by Published</option>
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </div>

        <div className="col-md-4">
          <div className="input-group">
            <input
              className="form-control"
              placeholder="Search by name, ID, Brands or tags"
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
            <span className="input-group-text"><FaSearch /></span>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Product</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Tags</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody> 
            {filtered.length === 0 && (
              <tr><td colSpan="7" className="text-center text-muted">No matching results</td></tr>
            )}
            {filtered.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>{p.id}</td>
                <td className="d-flex align-items-center gap-2">
                  <img src={p.images?.[0]?.base64 || "https://via.placeholder.com/32"} alt={p.name} width="32" height="32" className="rounded" />
                  <div>
                    <div className="fw-bold">{p.name}</div>
                    <small className="text-muted">{p.cpu} | {p.ram}</small>
                  </div>
                </td>

                <td>{p.brand}</td>
                <td>${p.price}</td>
                <td>{p.tags?.join(", ")}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button className="btn btn-light btn-sm" onClick={() => { setSelectedProduct(p); setShowModal(true); }}>
                      <FaEye className="text-primary" />
                    </button>
                    <button className="btn btn-light btn-sm"><NavLink key={p.id} to={`/admin/products/update/${p.id}`}><FaEdit className="text-success" /></NavLink></button>
                    <button className="btn btn-light btn-sm" onClick={() => handleDelete(p.id)}>
                      <FaTrash className="text-danger" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal hiển thị chi tiết sản phẩm */}
      <div className={`modal fade ${showModal ? "show d-block" : "d-none"}`} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Product Detail - {selectedProduct?.name}</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              {selectedProduct && (
                <div className="row">
                  <div className="col-md-4 text-center">
                    <img
                      src={selectedProduct.images?.[0]?.base64 || "https://via.placeholder.com/150"}
                      alt={selectedProduct.name}
                      className="img-fluid rounded"
                    />
                  </div>
                  <div className="col-md-8">
                    <p><strong>Brand:</strong> {selectedProduct.brand}</p>
                    <p><strong>CPU:</strong> {selectedProduct.cpu}</p>
                    <p><strong>RAM:</strong> {selectedProduct.ram}</p>
                    <p><strong>Storage:</strong> {selectedProduct.storage}</p>
                    <p><strong>OS:</strong> {selectedProduct.os}</p>
                    <p><strong>Price:</strong> ${selectedProduct.price}</p>
                    <p><strong>Published:</strong> {selectedProduct.published}</p>
                    <p><strong>Graphic Card:</strong> {selectedProduct.graphic_card}</p>
                    <p><strong>Colors:</strong> {selectedProduct.colors?.join(", ")}</p>
                    <p><strong>Tags:</strong> {selectedProduct.tags?.join(", ")}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    <nav className="mt-3 d-flex justify-content-center">
    <ul className="pagination">
      <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
        <button className="page-link" onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Previous</button>
      </li>
      {[...Array(totalPages)].map((_, idx) => (
        <li key={idx} className={`page-item ${page === idx + 1 ? "active" : ""}`}>
          <button className="page-link" onClick={() => setPage(idx + 1)}>{idx + 1}</button>
        </li>
      ))}
      <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
        <button className="page-link" onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
      </li>
    </ul>
  </nav>
    </div>
  );
};

export default ProductList;
