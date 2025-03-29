import React from "react";
import {
  Button,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
  Table
} from "react-bootstrap";
import {
  FaEdit,
  FaEye,
  FaSearch,
  FaStar,
  FaTrash,
} from "react-icons/fa";
import Titan18x from "../../assets/img/Titan18x.png";
import Titan18x2 from "../../assets/img/Titan18x2.png";
import './ProductList.css';

const products = [
  {
    id: 1,
    uid: "#1",
    name: "Titan18x",
    category: "laptop",
    brand: "DELL",
    price: 21,
    salePrice: 19,
    stock: 30,
    rating: 4.9,
    reviews: 16,
    orders: 380,
    sales: "38k",
    image: Titan18x,
  },
  {
    id: 2,
    uid: "#2",
    name: "Titan18x2",
    category: "laptop",
    brand: "DELL",
    price: 14,
    salePrice: 14,
    stock: 23,
    rating: 4.5,
    reviews: 38,
    orders: 189,
    sales: "9k",
    image: Titan18x2,
  },
  // thêm sản phẩm tùy ý...
];

const ProductList = ({ onViewDetail }) => {
  return (
    <div className="p-3">
      <h5 className="fw-bold mb-4">Best Selling Products</h5>

      <Row className="mb-3 g-2">
        <Col md={3}>
          <Form.Select>
            <option>Show by: 36 Row</option>
            <option>12</option>
            <option>24</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select>
            <option>Category by: </option>
            <option>Mens</option>
            <option>Womens</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select>
            <option>Brand by: </option>
            <option>...</option>
            <option>...</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <InputGroup>
            <FormControl placeholder="Search by ID, name..." />
            <InputGroup.Text><FaSearch /></InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead className="table-primary">
          <tr>
            <th><Form.Check /></th>
            <th>UID</th>
            <th>Product</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Rating</th>
            <th>Order</th>
            <th>Sales</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td><Form.Check /></td>
              <td>{prod.uid}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <img src={prod.image} width="32" height="32" alt="" />
                  <div>
                    <div className="fw-semibold">{prod.name}</div>
                    <small className="text-muted">Description...</small>
                  </div>
                </div>
              </td>
              <td>{prod.category}</td>
              <td>{prod.brand}</td>
              <td>
                {prod.price !== prod.salePrice && (
                  <del className="text-muted me-1">${prod.price}</del>
                )}
                <span className="text-danger fw-bold">${prod.salePrice}</span>
              </td>
              <td>{prod.stock}</td>
              <td>
                <FaStar className="text-warning me-1" />
                {prod.rating} <small className="text-muted">({prod.reviews})</small>
              </td>
              <td>{prod.orders}</td>
              <td>${prod.sales}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => onViewDetail(prod)}
                  >
                    <FaEye className="text-primary" />
                  </Button>
                  <Button variant="light" size="sm">
                    <FaEdit className="text-success" />
                  </Button>
                  <Button variant="light" size="sm">
                    <FaTrash className="text-danger" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <nav aria-label="Page navigation example" className="d-flex align-items-center justify-content-center mt-3">
                            <ul class="pagination pagination-primary">
                                <li class="page-item me-2"><a class="page-link" href="#">Prev</a></li>
                                <li class="page-item" ><a class="page-link" href="#">1</a></li>
                                <li class="page-item active"><a class="page-link" href="#">2</a></li>
                                <li class="page-item "><a class="page-link" href="#">3</a></li>
                                <li class="page-item ms-2"><a class="page-link" href="#">Next</a></li>
                            </ul>
      </nav>
      
    </div>
  );
};

export default ProductList;
