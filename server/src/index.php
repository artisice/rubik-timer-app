<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

define('JWT_SECRET', 'super_secret_key_for_rubik_timer_2023');

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\UserController;
use App\Controllers\AuthController;
use App\Controllers\RecordController;

 $fullUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

 $scriptName = $_SERVER['SCRIPT_NAME'];
 $basePath = dirname($scriptName);

 $uri = substr($fullUri, strlen($basePath));
if ($uri === '' || $uri === false) $uri = '/';

 $method = $_SERVER['REQUEST_METHOD'];

try {
    if ($uri === '/auth/login' && $method === 'POST') {
        (new AuthController())->login();
    }
    elseif ($uri === '/auth/logout' && $method === 'POST') {
        (new AuthController())->logout();
    }
    
    elseif ($uri === '/users' && $method === 'GET') {
        (new UserController())->index();
    }
    elseif ($uri === '/users' && $method === 'POST') {
        (new UserController())->store();
    }
    elseif (preg_match('/^\/users\/([a-zA-Z0-9\.]+)$/', $uri, $matches) && $method === 'GET') {
        (new UserController())->show($matches[1]);
    }

    elseif ($uri === '/records' && $method === 'POST') {
        (new RecordController())->store();
    }
    elseif ($uri === '/records/pending' && $method === 'GET') {
        (new RecordController())->pending();
    }
    elseif (preg_match('/^\/records\/([a-zA-Z0-9_]+)\/approve$/', $uri, $matches) && $method === 'PUT') {
        (new RecordController())->approve($matches[1]);
    }
    elseif (preg_match('/^\/records\/([a-zA-Z0-9_]+)\/reject$/', $uri, $matches) && $method === 'PUT') {
        (new RecordController())->reject($matches[1]);
    }
    elseif ($uri === '/leaderboard' && $method === 'GET') {
        (new RecordController())->leaderboard();
    }
    
    else {
        http_response_code(404);
        echo json_encode(['error' => 'Маршрут не найден']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сервера: ' . $e->getMessage()]);
}