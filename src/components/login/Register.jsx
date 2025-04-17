// Register.jsx
import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import styles from "./Auth.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    region: "",
    birthdate: "",
    phone: "",
    agreeTerms: false,
    subscribeNewsletter: false,
    joinRewards: false,
    captchaAnswer: "",
  });

  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const refreshCaptcha = () => {
    // In a real app, you would fetch a new captcha here
    console.log("Refreshing captcha");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    console.log("Form submitted:", formData);
    // Here you would send the data to your PHP backend
  };

  const handleCancel = () => {
    // Handle cancel action, e.g., redirect to home page
    window.history.back();
  };

  return (
    <div className={`commonContainer ${styles.registerContainer}`}>
      <h1 className={styles.title}>Đăng ký</h1>

      <div className={styles.introText}>
        <p className="text-center">
          MSI cam kết tôn trọng và bảo vệ các thông tin của bạn
        </p>
        <p className="text-center">
          Thông tin mà bạn cung cấp sẽ giúp chúng tôi phục vụ bạn tốt hơn
        </p>
        <p className="text-center text-danger">
          Các mục được đánh dấu * là bắt buộc cho đơn đăng ký
        </p>
      </div>

      <hr className={styles.divider} />

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            Địa chỉ thư điện tử <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Vui lòng nhập địa chỉ email hợp lệ.
          </Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Mật Khẩu <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập mật khẩu.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Xác nhận mật khẩu <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                isInvalid={
                  formData.password !== formData.confirmPassword &&
                  formData.confirmPassword !== ""
                }
              />
              <Form.Control.Feedback type="invalid">
                Mật khẩu không khớp.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Tên <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập tên của bạn.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Họ</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Vùng / Vị trí <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
              >
                <option value="">Chọn</option>
                <option value="VN">Việt Nam</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="SG">Singapore</option>
                <option value="MY">Malaysia</option>
                <option value="PH">Philippines</option>
                <option value="ID">Indonesia</option>
                <option value="TH">Thailand</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Vui lòng chọn vùng/vị trí của bạn.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Ngày sinh <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập ngày sinh của bạn.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Số Điện Thoại</Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            label={
              <span>
                Tôi đồng ý với{" "}
                <a href="#" className="text-danger">
                  Trung tâm thành viên MSI
                </a>{" "}
                Điều khoản và Điều kiện.
                <span className="text-danger">*</span>
              </span>
            }
            checked={formData.agreeTerms}
            onChange={handleChange}
            required
            feedback="Bạn phải đồng ý với các điều khoản và điều kiện."
            feedbackType="invalid"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Check
            type="checkbox"
            id="subscribeNewsletter"
            name="subscribeNewsletter"
            checked={formData.subscribeNewsletter}
            onChange={handleChange}
            label={
              <div>
                <div>Đăng ký Bản tin MSI</div>
                <div className="text-muted small">
                  Vui lòng đánh dấu vào ô nếu bạn muốn nhận tin tức và cập nhật
                  mới nhất của chúng tôi.
                  <br />
                  Thông qua nhập vào đây, bạn đồng ý với việc xử lý dữ liệu cá
                  nhân của mình bằng [Micro-Star International Co., LTD.] để gửi
                  cho bạn thông tin về [Các sản phẩm, dịch vụ, và các sự kiện
                  sắp diễn ra của MSI]. Xin lưu ý rằng bạn có thể hủy đăng ký
                  Bản tin MSI{" "}
                  <a href="#" className="text-danger">
                    tại đây
                  </a>{" "}
                  bất kỳ lúc nào.
                </div>
              </div>
            }
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            id="joinRewards"
            name="joinRewards"
            checked={formData.joinRewards}
            onChange={handleChange}
            label={
              <div>
                <div>Chương trình Phần thưởng của MSI</div>
                <div className="text-muted small">
                  Tôi đã đồng ý với chính sách, thời gian và điều kiện tham gia
                  dự thưởng
                  <br />
                  Trở thành thành viên ngay hôm nay để kiếm điểm, nhận ưu đãi
                  độc quyền, lời mời tham gia sự kiện VIP đặc biệt và hơn thế
                  nữa!
                  <br />
                  <a href="#" className="text-decoration-none">
                    Tìm hiểu thêm về các lợi ích của Chương trình Phần thưởng
                    MSI.
                  </a>
                </div>
              </div>
            }
          />
        </Form.Group>

        <div className="text-muted small mb-4">
          Thông tin chi tiết khác về các hoạt động xử lý dữ liệu của chúng tôi
          có tại{" "}
          <a href="#" className="text-danger">
            Chính sách quyền riêng tư của MSI
          </a>
        </div>

        <div className={styles.buttonGroup}>
          <Button
            type="submit"
            variant="danger"
            className={`${styles.submitButton} d-flex align-items-center justify-content-between`}
          >
            Đăng ký thành viên
            <span className="ms-2">&gt;</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            className={`${styles.cancelButton} d-flex align-items-center justify-content-between`}
            onClick={handleCancel}
          >
            Hủy bỏ
            <span className="ms-2">&gt;</span>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Register;
