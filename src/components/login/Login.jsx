// Login.jsx
import React, { useState } from "react";
import styles from "./Auth.module.css";
import { Button, Form, Row, Col, Modal } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import MK_icon from "../../assets/img/Login-img/MyMSI_icon.png";
import MK_qr from "../../assets/img/Login-img/MyMSI_qrcode.png";
import appStore from "../../assets/img/Login-img/btn-appstore.png";
import ggStore from "../../assets/img/Login-img/btn-googleplay.png";
import { Link } from "react-router-dom";

const Login = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleShowRegisterModal = () => setShowRegisterModal(true);
  const handleCloseRegisterModal = () => setShowRegisterModal(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Here you would handle the login logic with PHP backend
    console.log("Login with:", { email, password });
  };

  const handleSocialLogin = (provider) => {
    // Here you would handle social login logic
    console.log(`Login with ${provider}`);
  };

  return (
    <div className={`py-5 ${styles.loginBg}`}>
      <div className="commonContainer">
        <h2 className="text-center font-bold mb-5 mt-2">
          Chào mừng đến với Trung tâm thành viên MK
        </h2>

        <Row className="flex-md-row-reverse">
          {/* Right Column - Login Form */}
          <Col lg={6}>
            <div>
              <section className="p-4">
                <h4 className="mb-3 font-bold">Đăng nhập tài khoản MK</h4>
                <p className="mb-4">
                  Vui lòng sử dụng tài khoản bạn đã đăng ký để đăng nhập vào
                  trung tâm thành viên MK!
                </p>

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Địa chỉ thư điện tử"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="p-3"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Mật Khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="p-3"
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="danger"
                    type="submit"
                    className={`w-100 py-2 mb-3 d-flex justify-content-between ${styles.customColor}`}
                  >
                    <div>Đăng nhập</div>
                    <div className="me-2">&gt;</div>
                  </Button>

                  <div
                    className={`${styles.borderBottom} d-flex justify-content-end mb-3 text pb-4`}
                  >
                    <div
                      href="#"
                      className={`text-decoration-none small pe-2 ${styles.loginBorderRight}`}
                    >
                      Bạn quên mật khẩu?
                    </div>
                    <div href="#" className="text-decoration-none small ms-2">
                      Gửi lại email xác minh
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <p className="text-center text-sm mb-3">
                      HOẶC ĐĂNG NHẬP VỚI
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="danger"
                        onClick={() => handleSocialLogin("Google")}
                        className="px-3 py-2"
                      >
                        <FaGoogle />
                        <span className="text-bold">oogle</span>
                      </Button>
                    </div>
                  </div>
                </Form>
              </section>
            </div>
          </Col>

          {/* Left Column - Registration */}
          <Col lg={6} className={`mb-4 ${styles.loginBorderRight}`}>
            <div>
              <section className="border-0 bg-transparent p-4">
                <h4 className="mb-3 font-bold">
                  Bạn chưa phải là Thành viên MK?
                </h4>
                <p>
                  Trở thành thành viên MK để theo dõi các chương trình khuyến
                  mãi và cập nhật các chương trình hỗ trợ mới nhất.
                </p>
                <Button
                  variant="secondary"
                  className={`d-flex align-items-center justify-content-between mb-4 px-4 py-2 w-50 ${styles.cancelButton}`}
                  onClick={handleShowRegisterModal}
                >
                  Tạo tài khoản mới
                  <span className="ms-2">&gt;</span>
                </Button>
                <div className={`${styles.borderBottom} pb-3 mb-4`}>
                  <h6 className="d-flex font-bold align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-person me-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z" />
                    </svg>
                    Lợi ích thành viên
                  </h6>
                  <div className="d-flex">
                    <div className="ms-4 col">
                      <p className="mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="green"
                          className="bi bi-check me-2"
                          viewBox="0 0 16 16"
                        >
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                        </svg>
                        Đăng kí bảo hành
                      </p>
                      <p className="mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="green"
                          className="bi bi-check me-2"
                          viewBox="0 0 16 16"
                        >
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                        </svg>
                        Cập nhật độc quyền về các chương trình khuyến mãi và sự
                        kiện
                      </p>
                    </div>
                    <div className="ms-4 col">
                      <p className="mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="green"
                          className="bi bi-check me-2"
                          viewBox="0 0 16 16"
                        >
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                        </svg>
                        Hỗ trợ sản phẩm và dịch vụ nhanh hơn
                      </p>
                      <p className="mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="green"
                          className="bi bi-check me-2"
                          viewBox="0 0 16 16"
                        >
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                        </svg>
                        Xem các sản phẩm MK hiện đã đăng ký của bạn
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`${styles.borderBottom} pb-3 mb-4 d-flex`}>
                  <i class="fa-solid fa-gift text-secondary"></i>
                  <h6 className="ms-2 font-bold">
                    Nâng cấp quyền lợi thành viên của bạn bằng cách chọn tham
                    gia Chương trình Phần thưởng của MK để có cơ hội nhận được
                    nhiều phần thưởng độc quyền hơn!
                  </h6>
                </div>
                <div className="mb-4">
                  <h6 className="d-flex align-items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-phone me-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                      <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                    </svg>
                    <div className="font-bold">MyMK</div>
                  </h6>
                  <div className="ms-4">
                    <p className="mb-2">
                      MyMK cho phép bạn truy cập nhanh chóng và dễ dàng vào mọi
                      thứ trong MK. "Từ nội dung Chỉ-trong-ứng-dụng, nhiệm vụ và
                      phần thưởng đến yêu cầu hỗ trợ sản phẩm – bạn có thể làm
                      tất cả ở đây!"
                    </p>
                    <div className="d-flex align-items-center">
                      <img
                        src={MK_icon}
                        alt="MK Logo"
                        height="80"
                        className="me-3"
                      />
                      <img
                        src={MK_qr}
                        alt="QR Code"
                        height="80"
                        className="me-3"
                      />
                      <div>
                        <a href="#" className="d-block mb-2">
                          <img src={appStore} alt="App Store" width="100" />
                        </a>
                        <a href="#" className="d-block">
                          <img src={ggStore} alt="Google Play" width="100" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </Col>
        </Row>
      </div>

      {/* Registration Modal */}
      <Modal
        show={showRegisterModal}
        onHide={handleCloseRegisterModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <h4 className="font-bold mt-4">Đăng ký ngay</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Vui lòng sử dụng các phương pháp sau để đăng ký làm thành viên MK
          </p>

          <Link to={"/register"} className="text-white text-decoration-none">
            <Button
              variant="danger"
              className={`w-100 mb-2 py-2 d-flex align-items-center justify-content-center ${styles.customColor}`}
              hover=""
            >
              <i className="fa-solid fa-envelope me-2"></i> Đăng ký với Email
            </Button>
          </Link>
          <Button
            variant="danger"
            style={{ backgroundColor: "#DB4437" }}
            className={`w-100 mb-2 py-2 d-flex align-items-center justify-content-center ${styles.customColorGG}`}
          >
            <FaGoogle className="me-2" /> Đăng ký với Google
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Login;
