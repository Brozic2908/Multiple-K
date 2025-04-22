import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Badge, Button, Col, Container, Image, Row } from "react-bootstrap";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Titan18x from "../../assets/img/Titan18x.png";
import Titan18x2 from "../../assets/img/Titan18x2.png";
import Titan18x3 from "../../assets/img/Titan18x3.png";
const img = [Titan18x,Titan18x2,Titan18x3];
const ProductDetail = () => {
  const [currentIndex,setCurrentIndex] = useState(0);
  const handleNext = () =>
  {
    setCurrentIndex((prev) => (prev + 1) % img.length);
  }
  const handlePrev = () =>
    {
      setCurrentIndex((prev) => (prev - 1 + img.length) % img.length);
    }
  return (
    <Container fluid className="p-4">
      <Row>
        <Col md={6} className="text-center">
          <Container fluid md={12} className="p-3">
            <div className="position-relative w-100" style={{minHeight: "350px"}}>
              <AnimatePresence mode="wait">
                <motion.img key={img[currentIndex]} src={img[currentIndex]} className="img-fluid rounded"
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
                  {img.map((img,index) =>(
                    <Col xs={4} md={3} key={index}>
                      <Image src={img} thumbnail style={{border: index === currentIndex ? "2px solid #0d6efd"
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
            Gaming Laptop - Ryzen 7, RTX 4060, 16GB RAM, 512GB SSD
          </h5>
          <hr />
          <p>
            <i className="bi bi-tags"></i> <strong>Brand:</strong> ASUS
          </p>
          <p>
            <i className="bi bi-grid"></i> <strong>Category:</strong> Laptop
          </p>
          <p>
            <i className="bi bi-ui-checks"></i> <strong>Tags:</strong>{" "}
            <Badge bg="secondary" className="me-1">GAMING</Badge>
            <Badge bg="secondary" className="me-1">LAPTOP</Badge>
            <Badge bg="secondary" className="me-1">HIGH-PERFORMANCE</Badge>
            <Badge bg="secondary" className="me-1">ASUS</Badge>
          </p>
          <p>
            <i className="bi bi-palette"></i> <strong>Color:</strong>{" "}
            <Badge bg="light" text="dark" className="me-1">Black</Badge>
            <Badge bg="light" text="dark" className="me-1">Gray</Badge>
          </p>
          <p>
            <i className="bi bi-hdd"></i> <strong>Storage:</strong>{" "}
            <Badge bg="light" text="dark" className="me-1">512GB</Badge>
            <Badge bg="light" text="dark" className="me-1">1TB</Badge>
          </p>
          <p>
            <i className="bi bi-currency-dollar"></i> <strong>Price:</strong>{" "}
            <span className="fw-bold text-success">$1199.00</span>{" "}
            <del className="text-muted">$1399.00</del>
          </p>
          <p>
            <i className="bi bi-box"></i> <strong>Stock:</strong> (24) Units
          </p>
          <p>
            <i className="bi bi-star"></i> <strong>Review:</strong> (15) Reviews
          </p>
          <p>
            <i className="bi bi-calendar"></i> <strong>Published:</strong> 15 Mar 2025
          </p>
          <Button variant="primary">Add to Cart</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
