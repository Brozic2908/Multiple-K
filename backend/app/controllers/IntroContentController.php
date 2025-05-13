<?php
// app/controller/IntroContentController.php
class IntroContentController
{
    private $db;
    private $introContent;
    private $userId;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->connect();
        $this->introContent = new IntroContent($this->db);
        $this->userId = isset($_SERVER['HTTP_USER_ID']) ? $_SERVER['HTTP_USER_ID'] : null;
    }

    // get all intro content sections
    public function index()
    {
        $result = $this->introContent->getAll();
        $num = $result->rowCount();

        if ($num > 0) {
            $intro_content_arr = [];

            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                extract($row);

                $intro_item = [
                    'id' => $id,
                    'section_key' => $section_key,
                    'title' => $title,
                    'content' => $content,
                    'image_path' => $image_path,
                    'updated_at' => $updated_at,
                ];

                array_push($intro_content_arr, $intro_item);
            }

            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'data' => $intro_content_arr
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Not found content'
            ]);
        }
    }

    // Get content by section key
    public function show()
    {
        $key = isset($_GET['key']) ? $_GET['key'] : null;

        if (!$key) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing section key information'
            ]);
            return;
        }

        $result = $this->introContent->getByKey($key);
        $num = $result->rowCount();

        if ($num > 0) {
            $row = $result->fetch(PDO::FETCH_ASSOC);

            $intro_item = [
                'id' => $row['id'],
                'section_key' => $row['section_key'],
                'title' => $row['title'],
                'content' => $row['content'],
                'image_path' => $row['image_path'],
                'updated_at' => $row['updated_at']
            ];

            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'data' => $intro_item
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'No content found for this section'
            ]);
        }
    }

    // Update intro content
    public function update()
    {
        $data = json_decode(file_get_contents('php://input'));

        if (!isset($data->section_key) || !isset($data->title) || !isset($data->content) || empty($data->section_key) || empty($data->title) || empty($data->content)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing necessary information in Intro Content'
            ]);
            return;
        }

        // Check if section exists
        $result = $this->introContent->getByKey($data->section_key);
        if ($result->rowCount() == 0) {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Không tìm thấy phần nội dung cần cập nhật'
            ]);
            return;
        }

        // Set properties
        $this->introContent->section_key = $data->section_key;
        $this->introContent->title = $data->title;
        $this->introContent->content = $data->content;
        $this->introContent->updated_by = $this->userId;

        // Update the content
        if ($this->introContent->update()) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Content updated successfully'
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Content update failed'
            ]);
        }
    }

    // Upload image for intro content
    public function uploadImage()
    {
        $section_key = isset($_POST['section_key']) ? $_POST['section_key'] : null;

        if (!$section_key) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing necessary section key in Intro Content'
            ]);
            return;
        }

        $result = $this->introContent->getByKey($section_key);
        if ($result->rowCount() == 0) {
            http_response_code(404);

            echo json_encode([
                'status' => 'error',
                'message' => 'The content section that needs to be updated could not be found'
            ]);
            return;
        }

        if (!isset($_FILES['image'])) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'No file upload'
            ]);
            return;
        }

        $file = $_FILES['image'];
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];

        // Validate file 
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedExt = ['jpg', 'jpeg', 'png', 'gif'];

        if (!in_array($fileExt, $allowedExt)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Loại file không được hỗ trợ'
            ]);
            return;
        }

        if ($fileError !== 0) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Có lỗi khi tải file'
            ]);
            return;
        }

        if ($fileSize > 5000000) { // 5MB limit
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'File quá lớn'
            ]);
            return;
        }

        // Create uploads directory if not exists
        $uploadDir = dirname(__DIR__, 2) . '/uploads/img';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Generate unique file name
        $newFileName = 'intro_' . $section_key . '_' . time() . '.' . $fileExt;
        $destination = $uploadDir . '/' . $newFileName;


        // Upload file
        if (move_uploaded_file($fileTmpName, $destination)) {
            // Update image path in database
            $relativePath = 'uploads/img/' . $newFileName;
            $this->introContent->section_key = $section_key;
            $this->introContent->image_path = $relativePath;
            $this->introContent->updated_by = $this->userId;

            if ($this->introContent->updateImage()) {
                http_response_code(200);
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Cập nhật hình ảnh thành công',
                    'image_path' => $relativePath
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Cập nhật hình ảnh trong cơ sở dữ liệu thất bại'
                ]);
            }
        } else {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Tải file thất bại'
            ]);
        }
    }
}
