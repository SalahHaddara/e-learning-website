<?php
require "./../connection.php";
require "./../../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Only POST method allowed'
    ]);
    exit;
}

$headers = getallheaders();
if (!isset($headers['Authorization'])) {
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

    if ($payload->role !== 'student') {
        echo json_encode([
            'status' => 'error',
            'message' => 'Unauthorized. Only students can enroll in courses'
        ]);
        exit;
    }

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!isset($data['course_id'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Course ID is required'
        ]);
        exit;
    }

    $user_id = $payload->user_id;
    $course_id = $data['course_id'];
    
    $query = "INSERT INTO course_enrollments (status, user_id, courses_id) VALUES ('active', ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $user_id, $course_id);

    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Enrollment successful'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error'
        ]);
    }

    $stmt->close();

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid token'
    ]);
}

$conn->close();
?>