<?php
namespace App\Controllers;

use App\Helpers\FirebaseDB;
use App\Helpers\Logger;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController {
    private FirebaseDB $db;

    public function __construct() {
        $this->db = new FirebaseDB();
    }

    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            Logger::logAuth($email, 'FAIL_LOGIN', 'Пустые поля');
            http_response_code(422);
            echo json_encode(['error' => 'Email и пароль обязательны']);
            return;
        }

        $user = $this->db->findUserByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            Logger::logAuth($email, 'FAIL_LOGIN', 'Неверный email или пароль');
            http_response_code(401);
            echo json_encode(['error' => 'Неверный email или пароль']);
            return;
        }

        $payload = [
            'iss' => 'http://localhost',
            'aud' => 'http://localhost:5173',
            'iat' => time(),
            'exp' => time() + 3600,
            'data' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ];

        $jwt = JWT::encode($payload, JWT_SECRET, 'HS256');
        Logger::logAuth($email, 'SUCCESS_LOGIN', 'Пользователь ' . $user['id']);

        unset($user['password']);
        echo json_encode([
            'token' => $jwt,
            'user' => $user
        ]);
    }

    public function logout() {
        $email = 'unknown';
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            try {
                $decoded = JWT::decode($matches[1], new Key(JWT_SECRET, 'HS256'));
                $email = $decoded->data->email;
            } catch (\Exception $e) {}
        }

        Logger::logAuth($email, 'LOGOUT');
        echo json_encode(['message' => 'Успешный выход из системы']);
    }
}