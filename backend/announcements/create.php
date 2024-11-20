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

try {
    $jwt = $headers['Authorization'];
    $payload = JWT::decode($jwt, new Key("jwt_secret_key", 'HS256'));

    if ($payload->role !== 'instructor') {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Only instructors can create announcements'
        ]);
        exit;
    }

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!isset($data['title']) || !isset($data['course_id'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Title and course_id are required'
        ]);
        exit;
    }

    $check_stmt = $conn->prepare(
        "SELECT 1 FROM course_instructos 
        WHERE user_id = ? AND courses_id = ?"
    );
    $check_stmt->bind_param("ii", $payload->user_id, $data['course_id']);
    $check_stmt->execute();
    if ($check_stmt->get_result()->num_rows === 0) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'You are not assigned to this course'
        ]);
        exit;
    }

    $stmt = $conn->prepare(
        "INSERT INTO announcements (title, content, user_id, courses_id)
        VALUES (?, ?, ?, ?)"
    );
    $stmt->bind_param(
        "ssii",
        $data['title'],
        $data['content'],
        $payload->user_id,
        $data['course_id']
    );

    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Announcement created successfully',
            'announcement_id' => $stmt->insert_id
        ]);
    } else {
        throw new Exception('Failed to create announcement');
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}