<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $fileName = $input['filename'] ?? null;

    if (!$fileName) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Filename is required']);
        exit;
    }

    $uploadDir = __DIR__ . '/img/';
    $filePath = $uploadDir . basename($fileName);

    // Cấu hình kết nối CSDL
    require_once __DIR__ . '/../config/Database.php';
    $db = new Database();
    $conn = $db->connect();

    // Tìm và xóa trong DB
    $imgUrl = 'http://localhost/web-hk242/backend/uploads/img/' . basename($fileName);
    $stmt = $conn->prepare("DELETE FROM product_path WHERE img_path = :img_path");
    $stmt->bindValue(':img_path', $imgUrl, PDO::PARAM_STR);
    $stmt->execute();

    // Xoá file trong thư mục
    if (file_exists($filePath)) {
        if (unlink($filePath)) {
            echo json_encode(['success' => true, 'message' => 'File and DB record deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to delete file']);
        }
    } else {
        echo json_encode(['success' => true, 'message' => 'DB record deleted, file not found']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Only POST allowed']);
}
