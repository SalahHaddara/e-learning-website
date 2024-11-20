<?php
require "./../connection.php";
require "./../../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Only GET method allowed'
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
            'message' => 'Unauthorized. Only admins can list users'
        ]);
        exit;
    }

    $query = "SELECT id, username, email, role, status, create_time FROM user";
    $result = $conn->query($query);

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode([
        'status' => 'success',
        'users' => $users
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid token'
    ]);
}

$conn->close();
?>