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

    $enrollment_check = $conn->prepare(
        "SELECT 1 FROM course_enrollments 
        WHERE user_id = ? AND courses_id = ? AND status = 'active'"
    );
    $enrollment_check->bind_param("ii", $payload->user_id, $course_id);
    $enrollment_check->execute();

    if ($enrollment_check->get_result()->num_rows === 0) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'You are not enrolled in this course'
        ]);
        exit;
    }

    $query = "SELECT 
                a.id,
                a.title,
                a.content,
                a.create_time,
                u.username as instructor_name
            FROM announcements a
            JOIN user u ON a.user_id = u.id
            WHERE a.courses_id = ?
            ORDER BY a.create_time DESC";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $announcements = [];
    while ($row = $result->fetch_assoc()) {
        $announcements[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'content' => $row['content'],
            'created_at' => $row['create_time'],
            'instructor_name' => $row['instructor_name']
        ];
    }

    echo json_encode([
        'status' => 'success',
        'announcements' => $announcements
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>