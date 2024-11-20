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
            'message' => 'Unauthorized. Only admins can assign instructors'
        ]);
        exit;
    }

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!isset($data['course_id']) || !isset($data['instructor_id'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Course ID and Instructor ID are required'
        ]);
        exit;
    }

    $check_instructor = $conn->prepare("SELECT id FROM user WHERE id = ? AND role = 'instructor'");
    $check_instructor->bind_param("i", $data['instructor_id']);
    $check_instructor->execute();
    $instructor_result = $check_instructor->get_result();

    if ($instructor_result->num_rows === 0) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Instructor not found'
        ]);
        exit;
    }

    $remove_existing = $conn->prepare("DELETE FROM course_instructos WHERE courses_id = ?");
    $remove_existing->bind_param("i", $data['course_id']);
    $remove_existing->execute();

    $stmt = $conn->prepare("INSERT INTO course_instructos (courses_id, user_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $data['course_id'], $data['instructor_id']);

    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Instructor assigned successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to assign instructor'
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