<?php
require "./../connection.php";
require "./../../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Content-Type: application/json');

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

    if ($payload->role !== 'student' && $payload->role !== 'instructor') {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Unauthorized. Only students and instructors can create comments'
        ]);
        exit;
    }

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!isset($data['content']) || !isset($data['courses_id']) || !isset($data['is_private'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Content, course ID, and privacy status are required'
        ]);
        exit;
    }
    $stmt = $conn->prepare("INSERT INTO comments (content, user_id, courses_id, is_private) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("siii",
        $data['content'],
        $payload->user_id,
        $data['courses_id'],
        $data['is_private']
    );

    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Comment created successfully',
            'comment_id' => $stmt->insert_id
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to create comment'
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