import React, { useState } from "react";
import styles from "./asking.module.css";
import { toast } from "react-toastify";
import { questionService } from "../../services";

function Asking({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    email: localStorage.getItem("userEmail") || "",
    agreePolicy: false,
  });
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when you types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập chủ đề";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Vui lòng nhập nội dung câu hỏi";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.agreePolicy) {
      newErrors.agreePolicy = "Vui lòng đồng ý với điều khoản";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmiting(true);

      const questionData = {
        title: formData.title,
        content: formData.content,
        email: formData.email,
      };

      await questionService.createQuestion(questionData);

      // Reset Form
      setFormData({
        title: "",
        content: "",
        email: formData.email,
        agreePolicy: false,
      });

      // Thông báo thành công
      // toast.success();
      toast.success(
        <div style={{ marginRight: "10px" }}>
          Câu hỏi đã được gửi thành công và đang chờ phê duyệt!
        </div>
      );

      onSubmit();
    } catch (err) {
      console.error("Error submitting question: ", err);
      toast.error(
        errors.response?.data?.message || "Có lỗi xảy ra khi gọi câu hỏi"
      );
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.modalContain}>
      <h3 className="mb-3 text-center text-black fw-bold">Đặt câu hỏi mới</h3>

      <p className="mb-2">Địa chỉ thư điện tử nhận phản hồi</p>
      <input
        type="email"
        name="email"
        className="form-control mb-4 p-2"
        value={formData.email}
        disabled
      ></input>
      {errors.email && (
        <div className="invalid-feedback mb-2">{errors.email}</div>
      )}

      <label htmlFor="subject" className="form-label">
        Chủ đề <span style={{ color: "red" }}>*</span>
      </label>
      <input
        id="subject"
        name="title"
        type="text"
        className={`form-control mb-4 p-2 ${errors.title ? "is-invalid" : ""}`}
        required
        value={formData.title}
        onChange={handleChange}
      />
      {errors.title && (
        <div className="invalid-feedback mb-2">{errors.title}</div>
      )}

      <label htmlFor="question" className="form-label">
        Câu hỏi <span style={{ color: "red" }}>*</span>
      </label>
      <textarea
        rows="5"
        name="content"
        id="question"
        className={`form-control mb-4 p-2 ${
          errors.content ? "is-invalid" : ""
        }`}
        value={formData.content}
        onChange={handleChange}
        required
      ></textarea>
      {errors.content && (
        <div className="invalid-feedback mb-2">{errors.content}</div>
      )}

      <div className={styles.noticeBox}>
        <div className={styles.noticeBoxTitle}>
          Dịch vụ khách hàng Thông báo thu thập thông tin cá nhân
        </div>
        <p className="text-gray-600">
          MK cam kết cung cấp dịch vụ (đạt tiêu chuẩn) chất lượng. Để tiến hành
          các dịch vụ bảo hành và sửa chữa, chúng tôi sẽ cần: thu thập, xử lý và
          lưu trữ một số thông tin cá nhân của bạn. Và cũng để nâng cao trải
          nghiệm của bạn với MK, chúng tôi muốn giữ liên lạc với bạn thông qua
          các email thông tin về trạng thái dịch vụ, cũng như gửi cho bạn bản
          khảo sát mức độ hài lòng sau này để nhận được những ý kiến đóng góp từ
          phía bạn.
        </p>
        <p className="text-gray-600">
          MK công nhận quyền riêng tư là một quyền mang tính cơ bản. Hãy yên tâm
          rằng thông tin của bạn sẽ được sử dụng phù hợp với chính sách bảo mật
          của MK.
        </p>

        <div className="form-check">
          <input
            className={`form-check-input ${styles.noticeFormCheck}`}
            type="checkbox"
            id="policy"
            name="agreePolicy"
            checked={formData.agreePolicy}
            onChange={handleChange}
            style={{ accentColor: "red" }}
          />
          <label className="form-check-label" htmlFor="policy">
            <span className="me-1" style={{ color: "red" }}>
              *
            </span>
            Tôi hoàn toàn hiểu và đồng ý với các điều khoản ở trên và tôi rất
            vui khi tiếp tục sử dụng Hỗ trợ Dịch vụ Khách hàng của MK.
          </label>
          {errors.agreePolicy && (
            <div className="text-danger small mt-1">{errors.agreePolicy}</div>
          )}
        </div>
      </div>

      <div className="text-center mb-5 mt-4">
        <button
          type="submit"
          className={`equal-btn btn btn-danger me-3 ${styles.hoverRed}`}
          disabled={isSubmiting}
        >
          {isSubmiting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              >
                Đang gửi...
              </span>
            </>
          ) : (
            "Gửi"
          )}
        </button>
        <button
          type="button"
          className={`equal-btn btn btn-secondary ${styles.hoverGray}`}
          onClick={onCancel}
          disabled={isSubmiting}
        >
          Hủy bỏ
        </button>
      </div>
    </form>
  );
}

export default Asking;
