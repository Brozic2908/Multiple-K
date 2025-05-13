<?php
require_once __DIR__ . '/../models/Image.php';
class ImageController {
    private $imgmodel;
    public function __construct()
    {
        $db = (new Database())->connect();
        $this->imgmodel = new ImageModel($db);
    }
    public function upload() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Only POST allowed']);
            return;
        }
    
        try {
            $this->imgmodel->uploadImage();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
        }
    }
    public function delete() {

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->imgmodel->deleteImage();
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Only POST allowed']);
        }
    }
}
