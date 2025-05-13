import { AnimatePresence, motion } from "framer-motion";
import React, { useState,useEffect, useContext } from "react";
import { Badge, Button, Col, Container, Image, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import "./ProductDetail.css"; // Import your CSS file for styling
import { CartContext } from "../../Context/CartContext";
const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [currentIndex,setCurrentIndex] = useState(0);
  const {addToCart} = useContext(CartContext);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost/web-hk242/backend/products/${productId}`);
        setProduct(res.data.data); // giả sử API trả về theo { data: { ...product } }
      } catch (err) {
        console.error("Error fetching product detail", err);
      }
    };
    fetchProduct();
  }, [productId]);
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % (product?.images?.length || 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + (product?.images?.length || 1)) % (product?.images?.length || 1));
  };
  if (!product) return <Container className="p-4">Đang tải sản phẩm...</Container>;

  return (
    <Container fluid className="p-4">
      <Row>
        <Col md={6} className="text-center mkmb-3">
          <Container fluid md={12} className="p-3">
            <div className="position-relative w-100" style={{minHeight: "350px"}}>
              <AnimatePresence mode="wait">
                <motion.img key={product.images[currentIndex]} src={product.images[currentIndex].base64} className="img-fluid rounded"
                initial ={{opacity:0, x:50}} animate={{opacity:1,x:0}} exit={{opacity: 0, x:-50}}
                transition={{duration: 0.4}} style={{ maxHeight: "350px", objectFit: "contain"}}/>
              </AnimatePresence>
            </div>
          </Container>
          <Container className="text-center mt-3">
              <Row className="align-items-center justify-content-center g-2">
                {/* Nút trái */}
                <Col xs="auto" onClick={()=>{handlePrev()}} style={{cursor: "pointer"}}>
                  <IoIosArrowBack size={24} />
                </Col>
                  {product.images.map((img,index) =>(
                    <Col xs={4} md={3} key={index}>
                      <Image src={img.base64} thumbnail style={{border: index === currentIndex ? "2px solid #0d6efd"
                          : "1px solid #dee2e6",
                      cursor: "pointer",}} onClick={() => setCurrentIndex(index)} />
                    </Col>
                  ))}
                <Col xs="auto" onClick={()=>{handleNext()}} style={{cursor: "pointer"}}>
                  <IoIosArrowForward size={24}/>
                </Col>
              </Row>
          </Container>
        </Col>

        <Col md={6}>
          <h5 className="fw-bold">
            {product.name}
          </h5>
          <hr />
          <p>
            <i className="bi bi-tags"></i> <strong>Brand:</strong> {product.brand}
          </p>
          <p>
            <i className="bi bi-grid"></i> <strong>CPU:</strong> {product.cpu}
          </p>
         {/* Tags section */}
              {product.tags?.length > 0 && (
                <p>
                  <i className="bi bi-ui-checks"></i> <strong>Tags:</strong>{" "}
                  {product.tags.map((tag, index) => (
                    <Badge key={index} bg="secondary" className="me-1">{tag}</Badge>
                  ))}
                </p>
              )}

              {/* Colors section */}
              {product.colors?.length > 0 && (
                <p>
                  <i className="bi bi-palette"></i> <strong>Color:</strong>{" "}
                  {product.colors.map((color, index) => (
                    <span
                      key={index}
                      className="me-1 custom-badge"
                      style={{
                        backgroundColor: color,
                        color: "#fff",
                        border: `1px solid ${color}`,
                      }}
                    >
                      {color}
                  </span>
                  ))}
                </p>
              )}

          <p>
            <i className="bi bi-hdd"></i> <strong>Storage:</strong>{" "}
            <Badge bg="light" text="dark" className="me-1">{product.storage}</Badge>
          </p>
          <p>
            <i className="bi bi-currency-dollar"></i> <strong>Price:</strong>{" "}
            <span className="fw-bold text-success">{product.price}</span>{" "}
          </p>
          <p>
            <i className="bi bi-box"></i> <strong>Stock:</strong> ({product.stock}) Units
          </p>
          <p>
            <i className="bi bi-calendar"></i> <strong>Published:</strong> {product.published}
          </p>
          <Button variant="primary" onClick={()=>addToCart(product)}>Add to Cart</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
