<?php
// index.php
// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, PATCH');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

date_default_timezone_set('Asia/Ho_Chi_Minh');
// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

// Autoload classes
spl_autoload_register(function ($class) {
    $paths = [
        'app/controllers/',
        'app/models/',
        'core/',
        'app/middleware/'
    ];

    foreach ($paths as $path) {
        $file = __DIR__ . '/' . $path . $class . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// Load dependencies
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/libs/php-jwt-main/src/JWT.php';
require_once __DIR__ . '/libs/php-jwt-main/src/Key.php';

// Initialize router
$router = new Router();

// Load routes
require_once __DIR__ . '/routes/api.php';

// Handle the request
$router->handleRequest();
