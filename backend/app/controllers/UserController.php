<?php
// controllers/UserController.php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../../config/Database.php';

class UserController
{
    private $db;
    private $userModel;

    public function __construct()
    {
        $this->db = (new Database())->connect();
        $this->userModel = new User($this->db);
    }

    public function index()
    {
        $user = AuthMiddleware::verifyToken();
        if (!$user) {
            http_response_code(401);
            echo json_encode(["message" => "Unauthorized"]);
            return;
        }

        if ($user->role !== 'admin') {
            http_response_code(403);
            echo json_encode(["message" => "Access denied"]);
            return;
        }

        $query = "SELECT id, email, first_name, last_name, region, birthdate, phone, role, avatar_url, created_at FROM users";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["users" => $users]);
    }

    public function show($id)
    {
        $user = AuthMiddleware::verifyToken();
        if (!$user) {
            http_response_code(401);
            echo json_encode(["message" => "Unauthorized"]);
            return;
        }

        if ($user->role !== 'admin' && $user->id != $id) {
            http_response_code(403);
            echo json_encode(["message" => "Access denied"]);
            return;
        }

        $stmt = $this->userModel->getById($id);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            unset($data['password']);
            echo json_encode(["user" => $data]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "User not found"]);
        }
    }

    public function update()
    {
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(["message" => "Missing user ID"]);
            return;
        }

        $user = AuthMiddleware::verifyToken();
        if (!$user) {
            http_response_code(401);
            echo json_encode(["message" => "Unauthorized"]);
            return;
        }

        if ($user->role !== 'admin') {
            http_response_code(403);
            echo json_encode(["message" => "Access denied"]);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['role'])) {
            http_response_code(400);
            echo json_encode(["message" => "Missing role field"]);
            return;
        }

        $role = strtolower($data['role']);
        if (!in_array($role, ['admin', 'user'])) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid role"]);
            return;
        }

        $success = $this->userModel->updateRole($id, $role);
        if ($success) {
            echo json_encode(["message" => "Role updated"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update role"]);
        }
    }

    public function delete()
    {
        $user = AuthMiddleware::verifyToken();
        if (!$user || $user->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied']);
            return;
        }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing user ID']);
            return;
        }

        $stmt = $this->db->prepare("DELETE FROM users WHERE id = :id");
        $stmt->bindParam(":id", $id);
        if ($stmt->execute()) {
            echo json_encode(['message' => 'User deleted']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to delete user']);
        }
    }

    public function profile()
    {
        // Gọi AuthMiddleware để xác thực
        $user = AuthMiddleware::verifyToken();
        if (!$user) {
            return;
        }

        $stmt = $this->userModel->getById($user->id);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            unset($data['password']);
            echo json_encode(["user" => $data]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "User not found"]);
        }
    }

    public function updateAvatar()
    {
        $user = AuthMiddleware::verifyToken();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['avatar_url'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing avatar_url field']);
            return;
        }

        $stmt = $this->db->prepare("UPDATE users SET avatar_url = :avatar_url WHERE id = :id");
        $stmt->bindParam(":avatar_url", $data['avatar_url']);
        $stmt->bindParam(":id", $user->id);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Avatar updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to update avatar']);
        }
    }

    public function changePassword()
{
    $user = AuthMiddleware::verifyToken(); // Tự gọi kiểm tra token
    if (!$user) return; // Nếu token không hợp lệ thì middleware đã trả lỗi rồi

    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['old_password']) || empty($data['new_password'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing required fields']);
        return;
    }

    $userModel = new User($this->db);
    $userFromDB = $userModel->getById($user->id)->fetch(PDO::FETCH_ASSOC);

    if (!$userFromDB || !password_verify($data['old_password'], $userFromDB['password'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Incorrect current password']);
        return;
    }

    $hashed = password_hash($data['new_password'], PASSWORD_BCRYPT);
    $success = $userModel->updatePassword($user->id, $hashed);

    if ($success) {
        echo json_encode(['message' => 'Password updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to update password']);
    }
}


}