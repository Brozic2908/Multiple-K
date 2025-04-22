import React from 'react';
import {
  Navbar,
  Container,
  Form,
  FormControl,
  InputGroup,
  Badge,
  Dropdown,
  Image,
  Nav,
  Row,
  Col
} from 'react-bootstrap';
import {
  FaBars,
  FaGlobe,
  FaShoppingCart,
  FaEnvelope,
  FaBell,
  FaSlidersH ,
  FaSearch 
} from 'react-icons/fa';
import { MdWbSunny} from "react-icons/md";
import './HeaderAdmin.css';
const HeaderAdmin = () => {
  return (
    <Navbar bg="light" expand="lg" className="nav-bar-admin shadow-sm py-2">
      
      <Container fluid >
      <Row className=" left-element-bar w-100 align-items-center">
        {/* Logo + Sidebar Toggle */}
        <Col md={2}>
          <div className="d-flex align-items-center gap-2">
            <img
                    src='https://storage-asset.msi.com/frontend/imgs/logo.png'
                    alt='MSI  Logo'
                    width='98.8'
                    height='65'
              />
            {/* <span className="fw-bold text-dark ms-2">HOTASH</span> */}
          </div>
        </Col>
        {/* Search Bar */}
        <Col md={4}>
        <Form className="d-none d-md-flex mx-4 flex-grow-1">
          <InputGroup>
            <InputGroup.Text className="bg-light border-0">
                <FaSearch />
            </InputGroup.Text>
              <FormControl
                placeholder="quick finding..."
                className="border-0 shadow-sm bg-light"
              />
            
          </InputGroup>
        </Form>
        </Col>

        {/* Icons + User */}
        <Col md={6}>
          <div className="d-flex align-items-center gap-5">
            <div className="position-relative">
            <MdWbSunny size={20} className="text-secondary"/>
            </div>
            <div className="position-relative">
            <FaGlobe size={20} className="text-secondary" />
            </div>
            <div className="position-relative">
              <FaShoppingCart size={20} className="text-secondary" />
              <Badge pill bg="primary" className="position-absolute top-0 start-100 translate-middle">
                12
              </Badge>
            </div>

            <div className="position-relative">
              <FaEnvelope size={20} className="text-secondary" />
              <Badge pill bg="primary" className="position-absolute top-0 start-100 translate-middle">
                23
              </Badge>
            </div>

            <div className="position-relative">
              <FaBell size={20} className="text-secondary" />
              <Badge pill bg="primary" className="position-absolute top-0 start-100 translate-middle">
                34
              </Badge>
            </div>

            {/* User Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" className="d-flex align-items-center border-0 shadow-none">
                <div className="avatar bg-warning me-3">
                    <span className="avatar-content">AS</span>
                    <span className="avatar-status bg-success"></span>
                </div>
                <div className="d-none d-md-block text-start">
                  <div className="fw-semibold text-dark">Miron Mahmud</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>@mironcoder</div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>Profile</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
          </Col>
        
      </Row>
      </Container>
    </Navbar>
  );
};

export default HeaderAdmin;
