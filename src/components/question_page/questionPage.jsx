import styles from "./questionPage.module.css";
import { useState } from "react";

export default function QuestionPage() {
    const [questions] = useState([
        { title: "Laptop gaming có hiệu năng tốt nhất hiện nay?", answers: 2},
        { title: "Cấu hình máy tính văn phòng dưới 10 triệu đồng", answers: 3 },
        { title: "So sánh CPU Intel và AMD năm 2024", answers: 0 },
    ]);

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
                            <div className="btn btn-danger"><i className="fa-solid fa-plus me-2"></i>Đặt câu hỏi mới</div>
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
                                        <td className={styles.faqQuestion}>{q.title}</td>
                                        <td className="col-md-2 text-center"><i className="fa-regular fa-comment"></i> {q.answers}</td>
                                    </tr>
                                ))}Frontend developer with special care on the user experience. Passionate for learning new technologies and methodologies
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};