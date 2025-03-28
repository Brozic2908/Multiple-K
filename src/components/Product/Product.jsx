import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Pagination } from 'react-bootstrap';
import './Product.css'; // CSS riêng
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faArrowDown, faDesktop, faComputer } from '@fortawesome/free-solid-svg-icons';

import Titan18x from '../../assets/img/Titan18x.png';
import Titan18x2 from '../../assets/img/Titan18x2.png';
import Titan18x3 from '../../assets/img/Titan18x3.png';

const LeftSidebar = () => {
  const [openSections,setOpenSection] = useState({
    productLine:false,
    geForce50: false,
    geForce40: false,
    geForce30: false,
    geForce20: false,
    geForce6000: false,
    screenSize:false

  })
  const toggleSection = (sectionName) =>
  {
    setOpenSection((prev) => (
      {
        ...prev,
        [sectionName]: !prev[sectionName],
      }
    ))
  }

  return (
    <>
      {/* Section toggle */}
      <div className="filter-section">
        <h5 onClick={()=>toggleSection('productLine')} className="toggle-header">
          <span>
          <FontAwesomeIcon icon={faComputer} className='faComputer'/> Dòng sản phẩm Gaming
          </span>
          <span className={`toggle-icon ${openSections.productLine ? 'rotate' : ''}`}>
            <FontAwesomeIcon icon={faChevronRight}/>
          </span>
        </h5>

        <div className={`filter-content ${openSections.productLine ? 'open' : 'closed'}`}>
          <Form.Check label="Titan GT Series" type="checkbox" className="custom-checkbox"/>
          <Form.Check label="Stealth Series" type="checkbox" className="custom-checkbox"/>
          <Form.Check label="Raider GE Series" type="checkbox" className="custom-checkbox"/>
          <Form.Check label="Vector GP Series" type="checkbox" className="custom-checkbox" />
          <Form.Check label="Crosshair / Pulse GL Series" type="checkbox" className="custom-checkbox"/>
          <Form.Check label="Sword / Katana GF Series" type="checkbox" className="custom-checkbox"/>
          <a href="#" className="see-more">
            <FontAwesomeIcon icon={faArrowDown}/>Xem tất cả...
          </a>
        </div>
      </div>

      {/* Các filter khác */}
      <div className="filter-section">
        <h5>Dòng GPU</h5>
        <ul className="gpu-list">
          <li><div className="gpu mb-2" onClick={()=>toggleSection('geForce50')}><FontAwesomeIcon icon={faChevronRight} className='gpu faChevronRight'/>GeForce RTX™ 50 Series</div>
          <div className={`sublist ${openSections.geForce50 ? 'open' : 'closed'}`}>
          <Form.Check label="GeForce RTX™ 5090" type="checkbox" className="mb-2 custom-checkbox"/>
          <Form.Check label="GeForce RTX™ 5080" type="checkbox" className="mb-2 custom-checkbox"/>
          </div ></li>

          <li><div className="gpu mb-2" onClick={()=>toggleSection('geForce40')}><FontAwesomeIcon icon={faChevronRight} className='gpu faChevronRight'/>GeForce RTX™ 40 Series</div>
          <div className={`sublist ${openSections.geForce40 ? 'open' : 'closed'}`}>
          <Form.Check label="GeForce RTX™ 5090" type="checkbox"  className="mb-2 custom-checkbox"/>
          <Form.Check label="GeForce RTX™ 5080" type="checkbox" className="mb-2 custom-checkbox"/>
          </div></li>

          <li><div className="gpu mb-2" onClick={()=>toggleSection('geForce30')}><FontAwesomeIcon icon={faChevronRight} className='gpu faChevronRight'/> GeForce RTX™ 30 Series</div>
          <div className={`sublist ${openSections.geForce30 ? 'open' : 'closed'}`}>
          <Form.Check label="GeForce RTX™ 5090" type="checkbox"  className="mb-2"/>
          <Form.Check label="GeForce RTX™ 5080" type="checkbox" className="mb-2"/>
          </div></li>

          <li><div className="gpu mb-2" onClick={()=>toggleSection('geForce20')}><FontAwesomeIcon icon={faChevronRight} className='gpu faChevronRight'/> GeForce RTX™ 20 Series</div>
          <div className={`sublist ${openSections.geForce20 ? 'open' : 'closed'}`}>
          <Form.Check label="GeForce RTX™ 5090" type="checkbox"  className="mb-2 custom-checkbox"/>
          <Form.Check label="GeForce RTX™ 5080" type="checkbox" className="mb-2 custom-checkbox"/>
          </div></li>

          <li><div className="gpu mb-2" onClick={()=>toggleSection('geForce6000')}><FontAwesomeIcon icon={faChevronRight} className='gpu faChevronRight'/> AMD Radeon™ 6000M Series</div>
          <div className={`sublist ${openSections.geForce6000 ? 'open' : 'closed'}`}>
          <Form.Check label="GeForce RTX™ 5090" type="checkbox"  className="mb-2 custom-checkbox"/>
          <Form.Check label="GeForce RTX™ 5080" type="checkbox" className="mb-2 custom-checkbox"/>
          </div></li>
        </ul>
      </div>

      <div className="filter-section">
        <h5>Dòng CPU</h5>
        <ul className="gpu-list">
          <li><FontAwesomeIcon icon={faChevronRight} className='gpu faChevronRight'/> Intel Core™ Ultra</li>
          <li><FontAwesomeIcon icon={faChevronRight} className='gpu faChevronRight'/> Intel Core™ Gen 14</li>
        </ul>
      </div>
      <div className="filter-section">
        <h5 onClick={()=>toggleSection('screenSize')} className="toggle-header">
          <span>
          <FontAwesomeIcon icon={faDesktop} className='faDesktop'/> Kích cỡ màn hình
          </span>
          <span className={`toggle-icon ${openSections.screenSize ? 'rotate' : ''}`}>
            <FontAwesomeIcon icon={faChevronRight}/>
          </span>
        </h5>

        <div className={`filter-content ${openSections.screenSize ? 'open' : 'closed'}`}>
          <Form.Check label="14" type="checkbox" className="custom-checkbox" />
          <Form.Check label="15.6" type="checkbox" className="custom-checkbox"/>
          <Form.Check label="15.6 4K" type="checkbox" className="custom-checkbox"/>
          <Form.Check label="16" type="checkbox" />
          <Form.Check label="17 Series" type="checkbox" className="custom-checkbox"/>
          <Form.Check label="18" type="checkbox" className="custom-checkbox"/>
          <a href="#" className="see-more">
            <FontAwesomeIcon icon={faArrowDown}/> Xem tất cả...
          </a>
        </div>
      </div>
    </>
  );
};
const RightSidebar = () => {
  return (
    <>
      <div className='container-card'>
        {/* Card 1 */}
        <div className="card">
          <Card className="product-card">
          <div className="prod__tag"><div className="triangle"></div><span className="tagTitle">MỚI</span></div>
            <Card.Img variant="top" src={Titan18x} />
            <Card.Body>
              <Form.Check label="Thêm vào phần so sánh" />
              <Card.Title className="product-title">Titan 18 HX Dragon Edition Norse Myth</Card.Title>
              <Card.Text className="product-desc">
                Bộ xử lý Intel® Core™ Ultra (chuỗi 2) / card đồ họa GeForce RTX™ 50 Series
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        {/* Card 2 */}
        <div className="card">
          <Card className="product-card">
          <div className="prod__tag"><div className="triangle"></div><span className="tagTitle">MỚI</span></div>
            <Card.Img variant="top" src={Titan18x2} />
            <Card.Body>
              <Form.Check label="Thêm vào phần so sánh" />
              <Card.Title className="product-title">Titan 18 HX AI A2XW</Card.Title>
              <Card.Text className="product-desc">
                Bộ xử lý Intel® Core™ Ultra (Chuỗi 2) / card đồ họa GeForce RTX™ 50 Series
              </Card.Text>
            </Card.Body>
          </Card>
        </div>

        {/* Card 3 */}
        <div className="card">
          <Card className="product-card">
          <div className="prod__tag"><div className="triangle"></div><span className="tagTitle">HOT</span></div>
            <Card.Img variant="top" src={Titan18x3} />
            <Card.Body>
              <Form.Check label="Thêm vào phần so sánh" />
              <Card.Title className="product-title">Titan 18 HX A14V</Card.Title>
              <Card.Text className="product-desc">
                Vi xử lý Intel® Core™ (thế hệ 14) / card đồ họa GeForce RTX™ 40 Series
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination-container">
        <Pagination>
          <Pagination.Prev />
          <Pagination.Item active>1</Pagination.Item>
          <Pagination.Next />
        </Pagination>
      </div>
    </>
  );
};



const ProductPage = () => {
  return (
    <div className="product-page">
      <div className='main-products px-0'>

        {/* Header */}
        <Container fluid>
          <div className="product-header">
            <h2>MÁY TÍNH XÁCH TAY (3)</h2>
            <div className="sort-buttons">
              <button className="btn btn-dark">↕ Sắp xếp theo</button>
              <button className="btn btn-secondary">Độ phổ biến</button>
            </div>
          </div>
        </Container>

        {/* Layout */}
        <Row className='row-products'>
          <Col lg={3} md={3} sm={12} className="leftsidebar-product">
            <LeftSidebar />
          </Col>

          <Col lg={9} md={9} sm={12} className='rightsidebar-product'>
            <RightSidebar />
          </Col>
        </Row>

      </div>
    </div>
  );
};

export default ProductPage;