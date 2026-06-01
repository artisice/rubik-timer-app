<?php
namespace App\Helpers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth {
    public static function getUser() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['error' => 'Токен не предоставлен']);
            exit;
        }

        try {
            $decoded = JWT::decode($matches[1], new Key(JWT_SECRET, 'HS256'));
            return $decoded->data;
        } catch (\Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Токен невалиден или просрочен']);
            exit;
        }
    }

    public static function requireRole($requiredRole) {
        $user = self::getUser();
        if ($user->role !== $requiredRole) {
            http_response_code(403);
            echo json_encode(['error' => 'Доступ запрещен. Требуется роль: ' . $requiredRole]);
            exit;
        }
        return $user;
    }
}