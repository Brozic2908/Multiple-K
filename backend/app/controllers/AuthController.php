<?php
// controllers/AuthController.php

use Firebase\JWT\JWT;

class AuthController
{
    private $db;
    private $user;

    public function __construct()
    {
        $database = new Database();
        $this->db = $database->connect();
        $this->user = new User($this->db);
    }

    public function register()
    {
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));

        // Validate data
        $errorMsg = "";
        if (!$this->validateRegistrationData($data, $errorMsg)) {
            http_response_code(400);
            echo json_encode(['message' => $errorMsg]);
            return;
        }

        // Check email existed
        $result = $this->user->getByEmail($data->email);
        if ($result->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(['message' => 'Email has already existes']);
            return;
        }

        // Create user
        if ($this->user->create((array)$data)) {
            http_response_code(200);
            echo json_encode(['message' => 'Success']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'User creation failed']);
        }
    }

    public function login()
    {
        // Get posted data
        $data = json_decode(file_get_contents("php://input"));

        // Validate data
        if (!isset($data->email) || !isset($data->password)) {
            http_response_code(400);
            echo json_encode(['message' => 'Missing required fields']);
            return;
        }

        // Attempt login
        $user = $this->user->login($data->email, $data->password);
        if ($user) {
            // Generate JWT token
            $token = $this->generateJWT($user);

            http_response_code(200);
            echo json_encode([
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'firstName' => $user['first_name']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['message' => 'Tài khoản hoặc mất khẩu không hợp lệ !!!']);
        }
    }

    private function validateRegistrationData($data, &$errorMsg)
    {
        if (!isset($data->email) || !filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
            $errorMsg = "Email không hợp lệ";
            return false;
        }
        if (!isset($data->password) || strlen($data->password) < 6) {
            $errorMsg = "Mật khẩu phải có ít nhất 6 ký tự";
            return false;
        }
        if (!isset($data->firstName) || empty($data->firstName)) {
            $errorMsg = "Vui lòng nhập tên";
            return false;
        }
        if (!isset($data->region) || empty($data->region)) {
            $errorMsg = "Vui lòng chọn vùng";
            return false;
        }
        if (!isset($data->birthdate) || !strtotime($data->birthdate)) {
            $errorMsg = "Ngày sinh không hợp lệ";
            return false;
        }
        return true;
    }


    private function generateJWT($user)
    {
        $issued_at = time();
        $expiration = $issued_at + (60 * 60 * 24 * 30); // Valid for 30 days

        $payload = [
            'iat' => $issued_at,
            'exp' => $expiration,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ];

        return JWT::encode($payload, JWT_SECRET, 'HS256');
    }
}
