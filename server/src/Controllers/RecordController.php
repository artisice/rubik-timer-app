<?php
namespace App\Controllers;

use App\Helpers\FirebaseDB;
use App\Helpers\Auth;

class RecordController {
    private FirebaseDB $db;

    public function __construct() {
        $this->db = new FirebaseDB();
    }

    public function store() {
        $user = Auth::requireRole('USER');
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['category']) || empty($data['time']) || empty($data['videoUrl'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Категория, время и ссылка на видео обязательны']);
            return;
        }

        $newRecord = [
            'id' => uniqid('rec_'), 
            'userId' => $user->id,
            'category' => $data['category'],
            'time' => (int)$data['time'],
            'videoUrl' => $data['videoUrl'],
            'status' => 'PENDING',
            'createdAt' => date('Y-m-d H:i:s')
        ];

        $this->db->createRecord($newRecord);

        http_response_code(201);
        echo json_encode(['message' => 'Рекорд отправлен на модерацию', 'record' => $newRecord]);
    }

    public function pending() {
        Auth::requireRole('MODERATOR');
        $records = $this->db->getAllRecords();
        $users = $this->db->getAllUsers();

        $pendingRecords = array_filter($records, fn($r) => $r['status'] === 'PENDING');
        
        $result = array_map(function($record) use ($users) {
            $user = array_filter($users, fn($u) => $u['id'] === $record['userId']);
            $user = reset($user);
            $record['userName'] = $user ? $user['name'] : 'Unknown';
            return $record;
        }, $pendingRecords);

        echo json_encode(array_values($result));
    }

    public function approve($id) {
        Auth::requireRole('MODERATOR');
        $this->db->updateRecord($id, ['status' => 'APPROVED']);
        echo json_encode(['message' => 'Рекорд одобрен']);
    }

    public function reject($id) {
        Auth::requireRole('MODERATOR');
        $this->db->updateRecord($id, ['status' => 'REJECTED']);
        echo json_encode(['message' => 'Рекорд отклонен']);
    }

    public function leaderboard() {
        $records = $this->db->getAllRecords();
        $users = $this->db->getAllUsers();

        $approvedRecords = array_filter($records, fn($r) => $r['status'] === 'APPROVED');

        $result = array_map(function($record) use ($users) {
            $user = array_filter($users, fn($u) => $u['id'] === $record['userId']);
            $user = reset($user);
            $record['userName'] = $user ? $user['name'] : 'Unknown';
            return $record;
        }, $approvedRecords);

        usort($result, fn($a, $b) => $a['time'] - $b['time']);
        echo json_encode(array_values($result));
    }
}