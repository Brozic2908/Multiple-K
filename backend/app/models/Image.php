<?php
class ImageModel {
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function uploadImage() {
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'File upload error.']);
            return;
        }

        $uploadDir = __DIR__ . '/../../uploads/img/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileName = uniqid('img_') . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $destPath = $uploadDir . $fileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $url = 'http://localhost/web-hk242/backend/uploads/img/' . $fileName;
            echo json_encode(['success' => true, 'url' => $url, 'filename' => $fileName]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file.']);
        }
    }

    public function deleteImage()
{
    $input = json_decode(file_get_contents("php://input"), true);
    $filenames = $input['filenames'] ?? [];

    if (!is_array($filenames) || empty($filenames)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Filenames must be a non-empty array']);
        return;
    }

    $uploadDir = __DIR__ . '/../../uploads/img/';
    $errors = [];
    $successCount = 0;

    foreach ($filenames as $fileName) {
        $fileName = basename($fileName); // sanitize
        $filePath = $uploadDir . $fileName;
        $imgUrl = 'http://localhost/web-hk242/backend/uploads/img/' . $fileName;

        try {

            // Xoá file nếu tồn tại
            if (file_exists($filePath)) {
                if (!unlink($filePath)) {
                    $errors[] = "Failed to delete file: $fileName";
                    continue;
                }
            }

            $successCount++;
        } catch (Exception $e) {
            $errors[] = "Error deleting $fileName: " . $e->getMessage();
        }
    }

    echo json_encode([
        'success' => empty($errors),
        'deleted' => $successCount,
        'errors' => $errors
    ]);
}

}
