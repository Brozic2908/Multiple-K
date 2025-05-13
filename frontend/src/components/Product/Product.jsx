import { faArrowDown, faChevronRight, faComputer, faDesktop, faHardDrive, faMemory, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Form, Pagination, Row } from 'react-bootstrap';
import './Product.css';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const FilterSection = ({ title, icon, options = [], open, toggle, sectionKey, selected, onChange }) => (
  <div className="filter-section">
    <h5 onClick={() => toggle(sectionKey)} className="toggle-header">
      <span>{icon && <FontAwesomeIcon icon={icon} className="faIcon" />} {title}</span>
      <span className={`toggle-icon ${open ? 'rotate' : ''}`}>
        <FontAwesomeIcon icon={faChevronRight} />
      </span>
    </h5>
    <div className={`filter-content ${open ? 'open' : 'closed'}`}>
      {options.map((item, index) => (
        <Form.Check
          key={`${sectionKey}-${index}`}
          label={item || "Không xác định"}
          type="checkbox"
          className="custom-checkbox"
          checked={selected.includes(item)}
          onChange={() => onChange(sectionKey, item)}
        />
      ))}
    </div>
  </div>
);

const LeftSidebar = ({ filters, setFilters }) => {
  const [openSections, setOpenSection] = useState({
    brands: false,
    cpus: false,
    rams: false,
    storages: false,
    graphic_cards: false,
    oss: false,
    pins: false,
    screen_sizes: false
  });

  const toggleSection = (key) =>
    setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleCheckboxChange = (section, value) => {
    setFilters((prev) => {
      const current = new Set(prev[section] || []);
      if (current.has(value)) current.delete(value);
      else current.add(value);
      return { ...prev, [section]: Array.from(current) };
    });
  };

  const [filterOptions, setFilterOptions] = useState({});
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await axios.get("http://localhost/web-hk242/backend/products/distinct");
        if (res.data.status === "success") setFilterOptions(res.data.data);
      } catch (err) {
        console.error("Error loading filters", err);
      }
    };
    fetchFilters();
  }, []);

  return (
    <>
      <FilterSection title="Thương hiệu" icon={faComputer} options={filterOptions.brands || []} open={openSections.brands} toggle={toggleSection} sectionKey="brands" selected={filters.brands || []} onChange={handleCheckboxChange} />
      <FilterSection title="CPU"  options={filterOptions.cpus || []} open={openSections.cpus} toggle={toggleSection} sectionKey="cpus" selected={filters.cpus || []} onChange={handleCheckboxChange} />
      <FilterSection title="RAM"  options={filterOptions.rams || []} open={openSections.rams} toggle={toggleSection} sectionKey="rams" selected={filters.rams || []} onChange={handleCheckboxChange} />
      <FilterSection title="Ổ cứng"  options={filterOptions.storages || []} open={openSections.storages} toggle={toggleSection} sectionKey="storages" selected={filters.storages || []} onChange={handleCheckboxChange} />
      <FilterSection title="Card đồ họa"  options={filterOptions.graphic_cards || []} open={openSections.graphic_cards} toggle={toggleSection} sectionKey="graphic_cards" selected={filters.graphic_cards || []} onChange={handleCheckboxChange} />
      <FilterSection title="Hệ điều hành"  options={filterOptions.oss || []} open={openSections.oss} toggle={toggleSection} sectionKey="oss" selected={filters.oss || []} onChange={handleCheckboxChange} />
      <FilterSection title="Pin"  options={filterOptions.pins || []} open={openSections.pins} toggle={toggleSection} sectionKey="pins" selected={filters.pins || []} onChange={handleCheckboxChange} />
      <FilterSection title="Kích cỡ màn hình" icon={faDesktop} options={(filterOptions.screen_sizes || []).map(size => size + '"')} open={openSections.screen_sizes} toggle={toggleSection} sectionKey="screen_sizes" selected={filters.screen_sizes || []} onChange={handleCheckboxChange} />
    </>
  );
};

const RightSidebar = ({ filters, sortBy}) => {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get("http://localhost/web-hk242/backend/products");
        const data = res.data.data || [];
        setAllProducts(data);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    fetchAll();
  }, []);
  const filterKeyMap = {
    brands: "brand",
    cpus: "cpu",
    rams: "ram",
    storages: "storage",
    graphic_cards: "graphic_card",
    oss: "os",
    pins: "pin",
    screen_sizes: "screen_size",
    name
  };
  useEffect(() => {
    const filtered = allProducts.filter(p => {
      return Object.keys(filters).every(key => {
        //Nếu key không có trong filters hoặc không có giá trị nào được chọn thì bỏ qua
        if (!filters[key]?.length) return true;
        const productKey = filterKeyMap[key];
        return filters[key].some(f => (p[productKey]?.toString().includes(f)));
      });
    });
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "release_date") {
      filtered.sort((a, b) => new Date(b.published) - new Date(a.published));
    }
    else if (sortBy === "price") {
      filtered.sort((a, b) => a.price - b.price);
    }
    const start = (page - 1) * limit;
    const end = start + limit;
    setProducts(filtered.slice(start, end));
    setTotalPages(Math.ceil(filtered.length / limit));
  }, [allProducts, filters, page,sortBy]);

  return (
    <>
    
      <div className='container-card'>
      <Row>
        {products.map((product) => (
          <Col lg={4} md={6} sm={12}>
          <NavLink key={product.id} to={`/products/detail/${product.id}`} className="text-decoration-none">
            <div className="card">
              <Card className="product-card">
                <div className="prod__tag"><div className="triangle"></div><span className="tagTitle">MỚI</span></div>
                <Card.Img variant="top" src={product.images?.[0]} />
                <Card.Body>
                  <Form.Check label="Thêm vào phần so sánh" />
                  <Card.Title className="product-title">{product.name}</Card.Title>
                  <Card.Text className="product-desc">
                    Bộ xử lý: Intel® Core™ {product.cpu} – RAM: {product.ram} – Ổ cứng: {product.storage}
                  </Card.Text>
                  <Card.Text className="product-price">
                    Giá: {product.price ? product.price.toLocaleString('vi-VN') + '₫' : 'Liên hệ'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </NavLink>
          </Col>
        ))}
      </Row>
      </div>
    
      <div className="pagination-container mk">
        <Pagination>
          <Pagination.Prev onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1} />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item key={i} active={i + 1 === page} onClick={() => setPage(i + 1)}>{i + 1}</Pagination.Item>
          ))}
          <Pagination.Next onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages} />
        </Pagination>
      </div>
    </>
  );
};

const ProductPage = () => {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("");
  return (
    <div className="product-page">
      <div className='main-products px-0'>
        <Container fluid>
          <div className="product-header">
            <h2>MÁY TÍNH XÁCH TAY</h2>
            <div className="sort-buttons">
              <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-auto">
                <option value="">-- Sắp xếp --</option>
                <option value="name">Tên (A-Z)</option>
                <option value="release_date">Ngày ra mắt (mới nhất)</option>
                <option value="price">Giá tiền(Rẻ nhất)</option>
              </Form.Select>
            </div>
          </div>
        </Container>
        <Row className='row-products'>
          <Col lg={3} md={4} sm={12} className="leftsidebar-product">
            <LeftSidebar filters={filters} setFilters={setFilters} />
          </Col>
          <Col lg={9} md={8} sm={12} className='rightsidebar-product'>
            <RightSidebar filters={filters} sortBy={sortBy} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductPage;
