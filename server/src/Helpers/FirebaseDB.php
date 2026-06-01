<?php
namespace App\Helpers;

class FirebaseDB {
    private $baseUrl;

    public function __construct() {
        $this->baseUrl = 'https://rubiktimer-63dd0-default-rtdb.europe-west1.firebasedatabase.app/';
    }

    private function sendRequest($url, $method = 'GET', $data = null) {
        $options = [
            'http' => [
                'header'  => "Content-type: application/json\r\n",
                'method'  => $method,
                'ignore_errors' => true
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ];
        
        if ($data !== null) {
            $options['http']['content'] = json_encode($data);
        }
        
        $context  = stream_context_create($options);
        $response = @file_get_contents($url, false, $context);
        
        if ($response === false) {
            throw new \Exception("Не удалось подключиться к Firebase. Проверьте URL.");
        }
        
        $result = json_decode($response, true);
        
        if (isset($result['error'])) {
            throw new \Exception("Ошибка Firebase: " . $result['error']);
        }
        
        return $result;
    }

    public function getAllUsers() {
        $url = $this->baseUrl . 'users.json';
        $data = $this->sendRequest($url);
        if (!$data) return [];
        return array_values($data);
    }

    public function findUserByEmail($email) {
        $users = $this->getAllUsers();
        if (!$users) return null;
        foreach ($users as $user) {
            if (isset($user['email']) && $user['email'] === $email) {
                return $user;
            }
        }
        return null;
    }

    public function createUser($userData) {
        $id = $userData['id'];
        $url = $this->baseUrl . 'users/' . $id . '.json';
        $this->sendRequest($url, 'PUT', $userData);
    }

    public function getAllRecords() {
        $url = $this->baseUrl . 'records.json';
        $data = $this->sendRequest($url);
        return $data ? array_values($data) : [];
    }

    public function createRecord($recordData) {
        $id = $recordData['id'];
        $url = $this->baseUrl . 'records/' . $id . '.json';
        $this->sendRequest($url, 'PUT', $recordData);
    }

    public function updateRecord($id, $recordData) {
        $url = $this->baseUrl . 'records/' . $id . '.json';
        $this->sendRequest($url, 'PATCH', $recordData);
    }
}