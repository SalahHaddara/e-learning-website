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

    if ($payload->role !== 'instructor') {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Unauthorized access'
        ]);
        exit;
    }

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!isset($data['course_id']) || !isset($data['email'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Course ID and email are required'
        ]);
        exit;
    }

    $course_id = $data['course_id'];
    $email = $data['email'];
    $instructor_id = $payload->user_id;

    $check_stmt = $conn->prepare("SELECT 1 FROM course_instructos WHERE courses_id = ? AND user_id = ?");
    $check_stmt->bind_param("ii", $course_id, $instructor_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows === 0) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'You are not authorized to invite for this course'
        ]);
        exit;
    }

    $user_stmt = $conn->prepare("SELECT id FROM user WHERE email = ? AND role = 'student'");
    $user_stmt->bind_param("s", $email);
    $user_stmt->execute();
    $user_result = $user_stmt->get_result();
    $user = $user_result->fetch_assoc();

    if (!$user) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Student not found'
        ]);
        exit;
    }

    $enroll_check = $conn->prepare("SELECT 1 FROM course_enrollments WHERE user_id = ? AND courses_id = ?");
    $enroll_check->bind_param("ii", $user['id'], $course_id);
    $enroll_check->execute();
    $enroll_result = $enroll_check->get_result();

    if ($enroll_result->num_rows > 0) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Student is already enrolled in this course'
        ]);
        exit;
    }

    $enroll_stmt = $conn->prepare("INSERT INTO course_enrollments (user_id, courses_id, status) VALUES (?, ?, 'active')");
    $enroll_stmt->bind_param("ii", $user['id'], $course_id);
    $enroll_stmt->execute();

    echo json_encode([
        'status' => 'success',
        'message' => 'Student invited and enrolled successfully'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid token or invitation failed'
    ]);
}

$conn->close();
?>