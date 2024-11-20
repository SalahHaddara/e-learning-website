<?php
require "./../connection.php";
require "./../../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Only POST method allowed'
    ]);
    exit;
}

$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
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
            'message' => 'Unauthorized access'
        ]);
        exit;
    }

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!isset($data['title']) || empty($data['title'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Course title is required'
        ]);
        exit;
    }

    $title = $data['title'];
    $description = $data['description'] ?? null;
    $user_id = $payload->user_id;

    $stmt = $conn->prepare("INSERT INTO courses (title, description) VALUES (?, ?)");
    $stmt->bind_param("ss", $title, $description);
    $stmt->execute();
    $course_id = $conn->insert_id;

    echo json_encode([
        'status' => 'success',
        'message' => 'Course created successfully',
        'course_id' => $course_id
    ]);

    $stmt->close();

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid token or creation failed'
    ]);
}

$conn->close();
?>