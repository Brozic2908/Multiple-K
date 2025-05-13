import "./ContactPage.css";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import api from "../../services/api";
import axios from "axios";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    content: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập địa chỉ email";
    if (!formData.phone_number.trim())
      newErrors.phone_number = "Vui lòng nhập số điện thoại";
    if (!formData.content.trim())
      newErrors.content = "Vui lòng nhập nội dung cần liên hệ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await api.post("/contact-form", formData);
      alert("Gửi biểu mẫu liên hệ thành công");
      setErrors({});
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        content: "",
      });
    } catch (error) {
      if (error.response?.status === 400) {
        const newErrors = error.response.data.errors;
        console.log(newErrors);
        setErrors(newErrors);
        return;
      }

      if (error.response?.status === 429) {
        alert(error.response.data.errors);
        console.log(error.response.data);
        return;
      }
    }
  };

  return (
    <div className="contactForm">
      <div className="contact-title">
        <h2 className="mb-2 text-center fw-bold">Biểu Mẫu Liên Hệ</h2>
      </div>
      <div>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} xs={12} lg={6} controlId="formName">
              <Form.Label className="fs-5 fw-semibold">
                Họ Tên/Tên Doanh Nghiệp
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={handleChange}
                name="name"
                placeholder="Nguyễn Văn A"
              />
              {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
            </Form.Group>
            <Form.Group as={Col} xs={12} lg={6} controlId="formEmail">
              <Form.Label className="fs-5 fw-semibold">Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="anguyen@gmail.com"
              />
              {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group>
              <Form.Label className="fs-5 fw-semibold">
                Số Điện Thoại
              </Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="0000-000-000"
              />
              {errors.phone_number && (
                <p style={{ color: "red" }}>{errors.phone_number}</p>
              )}
            </Form.Group>
          </Row>

          <Row>
            <Form.Group className="mb-3" controlId="formText">
              <Form.Label className="fs-5 fw-semibold">
                Nội Dung Liên Hệ
              </Form.Label>
              <Form.Control
                as="textarea"
                value={formData.content}
                onChange={handleChange}
                name="content"
                rows={3}
              />
              {errors.content && (
                <p style={{ color: "red" }}>{errors.content}</p>
              )}
            </Form.Group>
          </Row>

          <Button
            variant="outline-secondary"
            type="submit"
            className="submit-contactForm"
          >
            Gửi Biểu Mẫu
          </Button>
        </Form>
      </div>
    </div>
  );
}

function ContactInfo() {
  const [contactEmails, setContactEmails] = useState([]);
  const [contactPhones, setContactPhones] = useState([]);

  useEffect(() => {
    const getContactEmail = async () => {
      const respond = await api.get("/contact-email");
      setContactEmails(respond.data.data);
    };

    const getContactPhone = async () => {
      const respond = await api.get("/contact-phone");
      setContactPhones(respond.data.data);
    };
    getContactEmail();
    getContactPhone();
  }, []);

  return (
    <div className="contactInfo">
      <div className="contact-title">
        <h2 className="mb-2 text-center fw-bold">Liên Hệ Hỗ Trợ</h2>
        <p className="mb-2 text-center">
          Cảm ơn bạn đã chọn MK. Xin vui lòng liên hệ với chúng tôi qua các kênh
          dưới đây, chúng tôi rất vui khi được giúp đỡ.
        </p>
      </div>

      <div className="contact-content">
        <ul className="d-flex flex-wrap">
          <li className="contact-item col-12 col-md-4">
            <div className="item-container text-center">
              <div className="item-img p-2">
                <img src="/contact-images/hotline.png" alt="" />
              </div>
              <div className="item-theme p-4">
                <p className="item-theme-title fw-bold fs-5">Đường dây nóng</p>
                <div className="item-theme-content">
                  {contactPhones.map((value, idx) => {
                    return (
                      <p key={idx}>
                        <span className="fw-medium">
                          Hotline {idx + 1}: {value.phone_number}
                        </span>
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </li>
          <li className="contact-item col-12 col-md-4">
            <a className="item-container text-center">
              <div className="item-img p-2">
                <img src="/contact-images/question.png" alt="" />
              </div>
              <div className="item-theme p-4">
                <p className="item-theme-title fw-bold fs-5">
                  Câu hỏi trực tuyến
                </p>
                <div className="item-theme-content">
                  <p>Đặt một câu hỏi</p>
                </div>
              </div>
            </a>
          </li>
          <li className="contact-item col-12 col-md-4">
            <div className="item-container text-center">
              <div className="item-img p-2">
                <img src="/contact-images/email.png" alt="" />
              </div>
              <div className="item-theme p-4">
                <p className="item-theme-title fw-bold fs-5">Email</p>
                <div className="item-theme-content">
                  {contactEmails.map((value, idx) => {
                    return (
                      <p key={idx}>
                        <span className="fw-medium">{value.email}</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="contact-page">
      <ContactInfo />
      <ContactForm />
    </div>
  );
}
