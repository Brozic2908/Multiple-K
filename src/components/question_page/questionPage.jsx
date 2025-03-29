import { color } from "framer-motion";
import styles from "./questionPage.module.css";
import { useState } from "react";

export default function QuestionPage() {
    const [questions, setQuestions] = useState([
        { title: "Laptop gaming có hiệu năng tốt nhất hiện nay?", answers: 2 },
        { title: "Cấu hình máy tính văn phòng dưới 10 triệu đồng", answers: 3 },
        { title: "So sánh CPU Intel và AMD năm 2024", answers: 0 },
    ]);

    const categories = [
        { value: "", label: "Chọn" },
        { value: "promotion", label: "Khuyến mãi: Bộ trò chơi & Bộ phần cứng" },
        { value: "registration", label: "Đăng ký sản phẩm" },
        { value: "purchase", label: "Vấn đề mua hàng" },
        { value: "warranty", label: "Dịch vụ sửa chữa và bảo hành" },
        { value: "support", label: "Hỗ trợ kĩ thuật" },
        { value: "reward", label: "Reward Program" },
        { value: "mobile-app", label: "Mobile App" },
    ];

    const [showModal, setShowModal] = useState(false);
    const [newQuestion, setNewQuestion] = useState("");

    const handleAddQuestion = () => {
        if (newQuestion.trim() !== "") {
            setQuestions([...questions, { title: newQuestion, answers: 0 }]);
            setNewQuestion("");
            setShowModal(false);
        }
    };

    return (
        <>
            <div className="container-md">
                <div className={`${styles.faqHeader} text-center`}>
                    <h2 className={styles.faqTitle}>FAQ</h2>
                </div>
                <div className={`${styles.faqContain}`}>
                    <div className="row justify-content-between mb-5">
                        <div className="col-md-7 mt-4 ms-2">
                            <div className={`${styles.faqSearch} input-group`}>
                                <label for="faqSearchInput" className="input-group-text"><i className={`${styles.faqSearchIcon} fa-solid fa-magnifying-glass`}></i></label>
                                <input type="text" id="faqSearchInput" className="form-control" placeholder="Tìm kiếm câu hỏi..."></input>
                            </div>
                        </div>
                        <div className="col-md-2 mt-4">
                            <div className="btn btn-danger" onClick={() => setShowModal(true)}><i className="fa-solid fa-plus me-2"></i>Đặt câu hỏi mới</div>
                        </div>
                    </div>
                    <div className={styles.listTitle}>ALL</div>
                    <div className={styles.faqList}>
                        <table className="table table-striped mb-4">
                            <thead>
                                <tr>
                                    <th scope="col" className="col-md-1 text-center">#</th>
                                    <th scope="col" className="col-md-9">Question</th>
                                    <th scope="col" className="col-md-2 text-center">Answer</th>
                                </tr>
                            </thead>
                            <tbody className="table-group-divider">
                                {questions.map((q, index) => (
                                    <tr key={index} className={styles.faqRow}>
                                        <th className="col-md-1 text-center">{index + 1}</th>
                                        <td>{q.title}</td>
                                        <td className="col-md-2 text-center">
                                            <i className="fa-regular fa-comment"></i> {q.answers}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* modal form */}
                    {/* {showModal && ( */}
                    {/* )} */}
                    <div className={styles.modalContain}>
                        <h3 className="mb-3 text-center fw-bold">Đặt câu hỏi mới</h3>

                        <p className="mb-2">Địa chỉ thư điện tử nhận phản hồi</p>
                        <input
                            type="text"
                            className="form-control mb-4 p-2"
                            placeholder="abc@gmail.com"
                            disabled
                        ></input>

                        <label for="category" className="form-label" >Thể loại <span style={{ color: "red" }}>*</span></label>
                        <select id="category" className="form-select mb-4 p-2" required>
                            {categories.map((category, index) => (
                                <option key={index} value={category.value}>{category.label}</option>
                            ))}
                        </select>

                        <label for="subject" className="form-label" >Chủ đề <span style={{ color: "red" }}>*</span></label>
                        <input
                            id="subject"
                            type="text"
                            className="form-control mb-4 p-2"
                            required
                        ></input>

                        <label for="question" className="form-label" >Câu hỏi <span style={{ color: "red" }}>*</span></label>
                        <textarea
                            rows="5"
                            id="question"
                            className="form-control mb-4 p-2"
                            required
                        ></textarea>

                        <label for className="form-label" >Tải lên</label>
                        <input type="file" name="uploadFile[]" className="form-control mb-2 p-2" required></input>
                        <input type="file" name="uploadFile[]" className="form-control mb-2 p-2" required></input>
                        <input type="file" name="uploadFile[]" className="form-control mb-2 p-2" required></input>
                        <input type="file" name="uploadFile[]" className="form-control mb-2 p-2" required></input>

                        <p className="text-gray-600">Lưu ý: Bạn có thể kiểm tra và tải lên cấu hình hệ thống của mình bằng cách sử dụng tính năng của Windows MKnfo32.exe hoặc CPUZ, chỉ hỗ trợ định dạng gif, jpg, png, zip, txt; Kích thước tệp không được vượt quá 3MB.</p>

                        <div className={styles.noticeBox}>
                            <div className={styles.noticeBoxTitle}>Dịch vụ khách hàng Thông báo thu thập thông tin cá nhân</div>
                            <p className="text-gray-600">MK cam kết cung cấp dịch vụ (đạt tiêu chuẩn) chất lượng. Để tiến hành các dịch vụ bảo hành và sửa chữa, chúng tôi sẽ cần: thu thập, xử lý và lưu trữ một số thông tin cá nhân của bạn. Và cũng để nâng cao trải nghiệm của bạn với MK, chúng tôi muốn giữ liên lạc với bạn thông qua các email thông tin về trạng thái dịch vụ, cũng như gửi cho bạn bản khảo sát mức độ hài lòng sau này để nhận được những ý kiến đóng góp từ phía bạn.</p>
                            <p className="text-gray-600">MK công nhận quyền riêng tư là một quyền mang tính cơ bản. Hãy yên tâm rằng thông tin của bạn sẽ được sử dụng phù hợp với chính sách bảo mật của MK.</p>

                            <div className="form-check">
                                <input className={`form-check-input ${styles.noticeFormCheck}`} type="checkbox" id="policy" style={{accentColor: "red"}}></input>
                                <label className="form-check-label" for="policy"><span className="me-1" style={{ color: "red" }}>*</span>Tôi hoàn toàn hiểu và đồng ý với các điều khoản ở trên và tôi rất vui khi tiếp tục sử dụng Hỗ trợ Dịch vụ Khách hàng của MK.</label>
                            </div>
                        </div>

                        <div className="text-center">
                            <button className="equal-btn btn btn-danger me-3" onClick={handleAddQuestion}>Gửi</button>
                            <button className="equal-btn btn btn-secondary" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};