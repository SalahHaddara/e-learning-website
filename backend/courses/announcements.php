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

try {
    $jwt = $headers['Authorization'];
    $payload = JWT::decode($jwt, new Key("jwt_secret_key", 'HS256'));

    if ($payload->role !== 'student') {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Unauthorized access'
        ]);
        exit;
    }

    $course_id = isset($_GET['course_id']) ? (int)$_GET['course_id'] : null;

    if (!$course_id) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Course ID is required'
        ]);
        exit;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>