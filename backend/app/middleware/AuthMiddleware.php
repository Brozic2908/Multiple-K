<?php
// middleware/AuthMiddleware.php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    public static function verifyToken()
    {
        $headers = apache_request_headers();
        if (!isset($headers['Authorization'])) {
            http_response_code(401);
            echo json_encode(['message' => 'No token provided']);
            return false;
        }

        $token = str_replace('Bearer ', '', $headers['Authorization']);

        try {
            $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));

            // Set user ID for controllers
            $_SERVER['HTTP_USER_ID'] = $decoded->user->id;
            $_SERVER['HTTP_USER_ROLE'] = $decoded->user->role;

            return $decoded->user;
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['message' => 'Invalid token']);
            return false;
        }
    }

    public static function handle()
    {
        $user = self::verifyToken();
        if (!$user || $user->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['message' => 'Access denied because you are not admin']);
            return false;
        }
        return true;
    }
}
