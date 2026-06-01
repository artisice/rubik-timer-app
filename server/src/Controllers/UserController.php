<?php
namespace App\Controllers;

use App\Helpers\FirebaseDB;

class UserController {
    private FirebaseDB $db;

    public function __construct() {
        $this->db = new FirebaseDB();
    }

    public function index() {
        $users = $this->db->getAllUsers();
        $safeUsers = array_map(function($u) {
            unset($u['password']);
            return $u;
        }, $users);
        
        echo json_encode($safeUsers);
    }

    public function show($id) {
        $users = $this->db->getAllUsers();
        $user = null;
        foreach ($users as $u) {
            if ($u['id'] === $id) {
                $user = $u;
                break;
            }
        }

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'Пользователь не найден']);
            return;
        }
        unset($user['password']);
        echo json_encode($user);
    }

    public function store() {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['name']) || empty($data['email'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Имя и Email обязательны']);
            return;
        }
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(422);
            echo json_encode(['error' => 'Некорректный Email']);
            return;
        }
        if (empty($data['password'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Пароль обязателен']);
            return;
        }

        if ($this->db->findUserByEmail($data['email'])) {
            http_response_code(409);
            echo json_encode(['error' => 'Пользователь с таким Email уже существует']);
            return;
        }

        $newUser = [
            'id' => uniqid('uid_'),
            'name' => $data['name'],
            'email' => $data['email'],
            'age' => $data['age'] ?? null,
            'password' => password_hash($data['password'], PASSWORD_BCRYPT),
            'role' => 'USER'
        ];

        $this->db->createUser($newUser);

        unset($newUser['password']);
        http_response_code(201);
        echo json_encode($newUser);
    }
}