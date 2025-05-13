<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'File upload error.']);
        exit;
    }

    $uploadDir = __DIR__ . '/img/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileTmpPath = $_FILES['image']['tmp_name'];
    $fileName = uniqid('img_') . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $destPath = $uploadDir . $fileName;

    if (move_uploaded_file($fileTmpPath, $destPath)) {
        $url = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST']
            . dirname($_SERVER['PHP_SELF']) . '/img/' . $fileName;
        echo json_encode(['success' => true, 'url' => $url]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Only POST allowed.']);
}
