import React,{useState} from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Breadcrumb,
  InputGroup
} from "react-bootstrap";
import { FaImages } from "react-icons/fa";
import "./ProductUpload.css"
const ProductUpload = () => {
    const [images,setImages] = useState([]);
    const handleImg = (e) =>
    {
        const files = Array.from(e.target.files);
        const newImg = files.map((file) => (
        {
            url: URL.createObjectURL(file),
            file
        }))
        setImages((prev) => [...prev, ...newImg].slice(0,6));
    }
  return (
    <Container fluid className="p-4">
      {/* <Breadcrumb>
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="#">Products</Breadcrumb.Item>
        <Breadcrumb.Item active>Product Upload</Breadcrumb.Item>
      </Breadcrumb> */}

      <h4 className="mb-4 fw-bold">Product Upload</h4>

      <Row>
        <Col md={8}>
          <Card className="mb-4 h-100">
            <Card.Body className="h-100">
              <h5 className="fw-bold mb-3">Basic Information</h5>
              <Form className="d-flex flex-column h-100">
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" placeholder="Enter product title" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Enter product description" />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select>
                        <option>Laptop</option>
                        <option>Gaming Console</option>
                        <option>Smartphone</option>
                        <option>Tablet</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Brand</Form.Label>
                      <Form.Select>
                        <option>Apple</option>
                        <option>Samsung</option>
                        <option>Lenovo</option>
                        <option>Microsoft</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Regular Price</Form.Label>
                      <Form.Control type="text" placeholder="USD" />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Discount Price</Form.Label>
                      <Form.Control type="text" placeholder="USD" />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Shipping Fee</Form.Label>
                      <Form.Control type="text" placeholder="USD" />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Tax Rate (%)</Form.Label>
                      <Form.Control type="text" placeholder="Enter tax rate" />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="flex-grow-1 d-flex flex-column">
                    <Form.Label>Tags</Form.Label>
                    <div style={{ flex: 1 }}>
                      <Form.Control
                        as="textarea"
                        placeholder="e.g. gaming, 4K display, SSD"
                        className="h-100"
                        style={{ resize: "none" }}
                      />
                    </div>
                </Form.Group>

              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="fw-bold mb-3">Organization</h5>
              {['Category', 'Brand', 'Color', 'Size'].map((item, idx) => (
                <InputGroup className="mb-3" key={idx}>
                  <Form.Control placeholder={`Add ${item.toLowerCase()}`} />
                  <Button variant="primary">Add</Button>
                </InputGroup>
              ))}
            </Card.Body>
          </Card>

          <Card>
            <Card.Body >
              <h5 className="fw-bold mb-3">Specification</h5>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>RAM</Form.Label>
                    <Form.Control type="text" placeholder="e.g. 16GB" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Storage</Form.Label>
                    <Form.Control type="text" placeholder="e.g. 512GB SSD" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Weight</Form.Label>
                    <Form.Control type="text" placeholder="in kg" />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mt-4 card-submit">
        <Card.Body>
          <h5 className="fw-bold mb-3">Media And Published</h5>
          <Row className="mb-3 card-submit-row">
            {images.map((img,idx) =>
            (
                <Col key={idx} xs={6} md={3} className="mb-3">
                <div
                        style={{
                        border: "1px dashed #ccc",
                        padding: 10,
                        textAlign: "center",
                        borderRadius: 8,
                        cursor: "pointer",
                        height: "200px",
                         width: "200px",          
                        display: "flex",          
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        }}
                    >
                        <img
                        src={img.url}
                        alt={`Uploaded ${idx}`}
                        style={{ width: "100%" }}
                        />
                </div>
                </Col>
            ))}
            {images.length < 6 && (
        <Col xs={6} md={3} className="mb-3 d-flex align-items-center ">
          <div
            style={{
              border: "2px dashed rgb(87, 84, 84,0.5)",
              padding: 10,
              textAlign: "center",
              borderRadius: 8,
              cursor: "pointer",
              height: "200px",
              width: "200px",          
            display: "flex",
            flexDirection: "column",         
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <FaImages style={{width: "80px",height: "80px",marginBottom: "10px"}}/>
            <span>Image Upload</span>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              id="fileInput"
              onChange={handleImg}
            />
          </div>
        </Col>
      )}
          </Row>
          <Button variant="primary" className="w-100 button-publish-view">
            Publish and View
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductUpload;
