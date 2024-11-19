<?php
require 'connection.php';
require './../vendor/autoload.php';

use Firebase\JWT\JWT;

$jwt_secret = "jwt_secret_key";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $email = trim($data['email']);
    $password = $data['password'];

    if (empty($email) || empty($password)) {
        echo json_encode([
            'status' => 'error',
            'message' => 'email and password are required'
        ]);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, username, password, role, email, status FROM user WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && password_verify($password, $user['password'])) {

        $payload = [
            'user_id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'exp' => time() + 3600 * 24 * 7
        ];

        $token = JWT::encode($payload, $jwt_secret, 'HS256');

        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'user_id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role'],
                'status' => $user['status']
            ]
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalide email or password'
        ]);
    }

    $stmt->close();
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Only POST method allowed'
    ]);
}

$conn->close();
?>