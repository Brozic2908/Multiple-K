<?php
// app/controllers/QuestionController.php

class QuestionController
{
    private $db;
    private $question;
    private $answer;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->connect();
        $this->question = new Question($this->db);
        $this->answer = new Answer($this->db);
    }

    // Hiển thị tất cả câu hỏi cho người dùng
    public function index()
    {
        // Lấy các tham số tìm kiếm và phân trang
        $search = isset($_GET['search']) ? $_GET['search'] : '';
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;

        // Lấy danh sách câu hỏi
        $result = $this->question->getAll($limit, $offset, $search);
        $questions = [];
        $num = $result->rowCount();

        if ($num > 0) {
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $questions[] = [
                    'id' => $row['id'],
                    'title' => $row['title'],
                    'created_at' => $row['created_at'],
                    'user_name' => $row['user_name'],
                    'answer_count' => $row['answer_count']
                ];
            }
        }

        // Lấy tổng số câu hỏi để phân trang
        $total = $this->question->getTotalCount($search);
        $totalPages = ceil($total / $limit);

        // Trả về kết quả
        http_response_code(200);
        echo json_encode([
            'questions' => $questions,
            'pagination' => [
                'current_page' => $page,
                'total_pages' => $totalPages,
                'total_items' => $total,
                'limit' => $limit
            ]
        ]);
    }

    // Hiển thị tất cả câu hỏi cho admin
    public function adminIndex()
    {
        // Kiểm tra quyền admin
        $user = AuthMiddleware::verifyToken();
        if (!$user || $user->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            return;
        }

        // Lấy các tham số tìm kiếm và phân trang
        $search = isset($_GET['search']) ? $_GET['search'] : '';
        $status = isset($_GET['status']) ? $_GET['status'] : '';
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;

        // Lấy danh sách câu hỏi
        $result = $this->question->getAllForAdmin($limit, $offset, $search, $status);
        $questions = [];
        $num = $result->rowCount();

        if ($num > 0) {
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $questions[] = [
                    'id' => $row['id'],
                    'title' => $row['title'],
                    'email' => $row['email'],
                    'created_at' => $row['created_at'],
                    'status' => $row['status'],
                    'user_name' => $row['user_name'],
                    'answer_count' => $row['answer_count']
                ];
            }
        }

        // Lấy tổng số câu hỏi để phân trang
        $total = $this->question->getTotalCountForAdmin($search, $status);
        $totalPages = ceil($total / $limit);

        // Trả về kết quả
        http_response_code(200);
        echo json_encode([
            'questions' => $questions,
            'pagination' => [
                'current_page' => $page,
                'total_pages' => $totalPages,
                'total_items' => $total,
                'limit' => $limit
            ]
        ]);
    }

    // Chi tiết một câu hỏi
    public function show()
    {
        // Lấy ID câu hỏi từ URL
        $id = isset($_GET['id']) ? $_GET['id'] : null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing question ID']);
            return;
        }

        // Lấy thông tin câu hỏi
        $result = $this->question->getById($id);
        if ($result->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(['message' => 'Question not found']);
            return;
        }

        $question = $result->fetch(PDO::FETCH_ASSOC);

        // Nếu câu hỏi chưa được phê duyệt và người dùng không phải admin, không hiển thị
        $user = null;
        if (isset($headers['Authorization'])) {
            $user = AuthMiddleware::verifyToken();
        }

        if ($question['status'] !== 'approved' && (!$user || $user->role !== 'admin')) {
            http_response_code(403);
            echo json_encode(['message' => 'This question is not approved yet']);
            return;
        }

        // Lấy danh sách câu trả lời
        $answers = [];
        $answersResult = $this->answer->getByQuestionId($id);

        while ($row = $answersResult->fetch(PDO::FETCH_ASSOC)) {
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
        echo json_encode([
            'id' => $question['id'],
            'title' => $question['title'],
            'content' => $question['content'],
            'email' => $question['email'],
            'created_at' => $question['created_at'],
            'user_name' => $question['user_name'],
            'answers' => $answers
        ]);
    }

    // Chi tiết một câu hỏi
    public function showAdmin()
    {
        // Lấy ID câu hỏi từ URL
        $id = isset($_GET['id']) ? $_GET['id'] : null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing question ID']);
            return;
        }

        // Kiểm tra quyền admin
        AuthMiddleware::verifyToken();
        if ($_SERVER['HTTP_USER_ROLE'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'You must be admin']);
            return;
        }

        // Lấy thông tin câu hỏi
        $result = $this->question->getById($id);
        if ($result->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(['message' => 'Question not found']);
            return;
        }

        $question = $result->fetch(PDO::FETCH_ASSOC);

        // Lấy danh sách câu trả lời
        $answers = [];
        $answersResult = $this->answer->getByQuestionId($id);

        while ($row = $answersResult->fetch(PDO::FETCH_ASSOC)) {
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
        echo json_encode([
            'id' => $question['id'],
            'title' => $question['title'],
            'content' => $question['content'],
            'email' => $question['email'],
            'created_at' => $question['created_at'],
            'user_name' => $question['user_name'],
            'status' => $question['status'],
            'answers' => $answers
        ]);
    }

    // Tạo câu hỏi mới
    public function create()
    {
        // Lấy dữ liệu từ client
        $data = json_decode(file_get_contents("php://input"));

        // Kiểm tra dữ liệu đầu vào
        if (
            !isset($data->title) || empty($data->title) ||
            !isset($data->content) || empty($data->content) ||
            !isset($data->email) || !filter_var($data->email, FILTER_VALIDATE_EMAIL)
        ) {

            http_response_code(400);
            echo json_encode(['message' => 'Vui lòng điền đầy đủ thông tin']);
            return;
        }

        // Lấy ID người dùng nếu đã đăng nhập
        $userId = null;
        $headers = apache_request_headers();

        if (isset($headers['Authorization'])) {
            $user = AuthMiddleware::verifyToken();
            if ($user) {
                $userId = $user->id;
            }
        }

        // Tạo dữ liệu để lưu vào cơ sở dữ liệu
        $questionData = [
            'user_id' => $userId,
            'title' => $data->title,
            'content' => $data->content,
            'email' => $data->email
        ];

        // Lưu vào cơ sở dữ liệu
        $questionId = $this->question->create($questionData);

        if ($questionId) {
            http_response_code(201);
            echo json_encode([
                'message' => 'Câu hỏi đã được gửi và đang chờ xét duyệt',
                'id' => $questionId
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Đã xảy ra lỗi khi gửi câu hỏi']);
        }
    }

    // Cập nhật câu hỏi (chỉ admin)
    public function update()
    {
        // Kiểm tra quyền admin
        $user = AuthMiddleware::verifyToken();
        if (!$user || $user->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            return;
        }

        // Lấy ID câu hỏi từ URL
        $id = isset($_GET['id']) ? $_GET['id'] : null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing question ID']);
            return;
        }

        // Lấy dữ liệu từ client
        $data = json_decode(file_get_contents("php://input"));

        if (
            !isset($data->title) || empty($data->title) ||
            !isset($data->content) || empty($data->content) ||
            !isset($data->status) || !in_array($data->status, ['pending', 'approved', 'rejected'])
        ) {

            http_response_code(400);
            echo json_encode(['message' => 'Missing required fields']);
            return;
        }

        // Cập nhật câu hỏi
        $questionData = [
            'title' => $data->title,
            'content' => $data->content,
            'status' => $data->status
        ];

        if ($this->question->update($id, $questionData)) {
            http_response_code(200);
            echo json_encode(['message' => 'Question updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update question']);
        }
    }

    // Cập nhật trạng thái câu hỏi (chỉ admin)
    public function updateStatus()
    {
        // Kiểm tra quyền admin
        $user = AuthMiddleware::verifyToken();
        if (!$user || $user->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            return;
        }

        // Lấy ID câu hỏi từ URL
        $id = isset($_GET['id']) ? $_GET['id'] : null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing question ID']);
            return;
        }

        // Lấy dữ liệu từ client
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->status) || !in_array($data->status, ['pending', 'approved', 'rejected'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Invalid status']);
            return;
        }

        // Cập nhật trạng thái
        $questionData = ['status' => $data->status];

        if ($this->question->update($id, $questionData)) {
            http_response_code(200);
            echo json_encode(['message' => 'Question status updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update question status']);
        }
    }

    // Xóa câu hỏi (chỉ admin)
    public function delete()
    {
        // Kiểm tra quyền admin
        $user = AuthMiddleware::verifyToken();
        if (!$user || $user->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            return;
        }

        // Lấy ID câu hỏi từ URL
        $id = isset($_GET['id']) ? $_GET['id'] : null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing question ID']);
            return;
        }

        // Xóa câu hỏi
        if ($this->question->delete($id)) {
            http_response_code(200);
            echo json_encode(['message' => 'Question deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to delete question']);
        }
    }
}
