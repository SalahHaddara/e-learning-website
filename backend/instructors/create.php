<?php
require "./../connection.php";
require "./../../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Only POST method allowed'
    ]);
    exit;
}

$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'No authorization token provided'
    ]);
    exit;
}

$jwt = $headers['Authorization'];
$secretKey = "jwt_secret_key";

try {
    $payload = JWT::decode($jwt, new Key($secretKey, 'HS256'));

    if ($payload->role !== 'admin') {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Unauthorized. Only admins can create instructors'
        ]);
        exit;
    }

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Username, email and password are required'
        ]);
        exit;
    }

    $check = $conn->prepare("SELECT id FROM user WHERE email = ?");
    $check->bind_param("s", $data['email']);
    $check->execute();
    if ($check->get_result()->num_rows > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Email already exists'
        ]);
        exit;
    }
    $check->close();

    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
    $stmt = $conn->prepare("INSERT INTO user (username, email, password, role, status) VALUES (?, ?, ?, 'instructor', 1)");
    $stmt->bind_param("sss", $data['username'], $data['email'], $hashedPassword);

    if ($stmt->execute()) {
        $newId = $stmt->insert_id;
        echo json_encode([
            'status' => 'success',
            'message' => 'Instructor created successfully',
            'instructor' => [
                'id' => $newId,
                'username' => $data['username'],
                'email' => $data['email'],
                'role' => 'instructor',
                'status' => '1'
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to create instructor'
        ]);
    }

    $stmt->close();

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid token'
    ]);
}

$conn->close();
?>