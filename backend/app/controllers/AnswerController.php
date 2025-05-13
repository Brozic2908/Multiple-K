<?php
// app/controllers/AnswerController.php

class AnswerController
{
    private $db;
    private $answer;
    private $question;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->connect();
        $this->answer = new Answer($this->db);
        $this->question = new Question($this->db);
    }

    // Lấy câu trả lời cho một câu hỏi
    public function getByQuestionId()
    {
        // Lấy ID câu hỏi từ URL
        $questionId = isset($_GET['question_id']) ? $_GET['question_id'] : null;

        if (!$questionId) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing question ID']);
            return;
        }

        // Kiểm tra xem câu hỏi có tồn tại và đã được phê duyệt chưa
        $questionResult = $this->question->getById($questionId);
        if ($questionResult->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(['message' => 'Question not found']);
            return;
        }

        $question = $questionResult->fetch(PDO::FETCH_ASSOC);

        // Nếu câu hỏi chưa được phê duyệt và người dùng không phải admin, không hiển thị
        $user = null;
        $headers = apache_request_headers();

        if (isset($headers['Authorization'])) {
            $user = AuthMiddleware::verifyToken();
        }

        if ($question['status'] !== 'approved' && (!$user || $user->role !== 'admin')) {
            http_response_code(403);
            echo json_encode(['message' => 'This question is not approved yet']);
            return;
        }

        // Lấy danh sách câu trả lời
        $result = $this->answer->getByQuestionId($questionId);
        $answers = [];

        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $answers[] = [
                'id' => $row['id'],
                'content' => $row['content'],
                'created_at' => $row['created_at'],
                'user_name' => $row['user_name'],
                'user_role' => $row['user_role']
            ];
        }

        // Trả về kết quả
        http_response_code(200);
        echo json_encode($answers);
    }

    // Thêm câu trả lời mới (cần đăng nhập)
    public function create()
    {
        // Kiểm tra xác thực
        $user = AuthMiddleware::verifyToken();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['message' => 'Bạn cần đăng nhập để trả lời câu hỏi']);
            return;
        }

        // Lấy dữ liệu từ client
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->question_id) || !isset($data->content) || empty($data->content)) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing required fields']);
            return;
        }

        // Kiểm tra xem câu hỏi có tồn tại và đã được phê duyệt chưa
        $questionResult = $this->question->getById($data->question_id);
        if ($questionResult->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(['message' => 'Question not found']);
            return;
        }

        $question = $questionResult->fetch(PDO::FETCH_ASSOC);

        // Chỉ admin có thể trả lời câu hỏi chưa được phê duyệt
        if ($question['status'] !== 'approved' && $user->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'This question is not approved yet']);
            return;
        }

        // Chuẩn bị dữ liệu để lưu
        $answerData = [
            'question_id' => $data->question_id,
            'user_id' => $user->id,
            'content' => $data->content
        ];

        // Lưu câu trả lời
        $answerId = $this->answer->create($answerData);

        if ($answerId) {
            http_response_code(201);
            echo json_encode([
                'message' => 'Answer created successfully',
                'id' => $answerId
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to create answer']);
        }
    }

    // Cập nhật câu trả lời (người tạo hoặc admin)
    public function update()
    {
        // Kiểm tra xác thực
        $user = AuthMiddleware::verifyToken();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['message' => 'Authentication required']);
            return;
        }

        // Lấy ID câu trả lời từ URL
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing answer ID']);
            return;
        }

        // Lấy dữ liệu từ client
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->content) || empty($data->content)) {
            http_response_code(400);
            echo json_encode(['message' => 'Content is required']);
            return;
        }

        // Cập nhật câu trả lời
        if ($this->answer->update($id, $data->content, $user->id)) {
            http_response_code(200);
            echo json_encode(['message' => 'Answer updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update answer']);
        }
    }

    // Xóa câu trả lời (chỉ admin)
    public function delete()
    {
        // Kiểm tra quyền admin
        AuthMiddleware::handle();

        // Lấy ID câu trả lời từ URL
        $id = isset($_GET['id']) ? $_GET['id'] : null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing answer ID']);
            return;
        }

        // Xóa câu trả lời
        if ($this->answer->delete($id)) {
            http_response_code(200);
            echo json_encode(['message' => 'Answer deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to delete answer']);
        }
    }
}
