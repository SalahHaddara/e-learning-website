<?php
require "./../connection.php";
require "./../../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Only GET method allowed'
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

try {
    $jwt = $headers['Authorization'];
    $payload = JWT::decode($jwt, new Key("jwt_secret_key", 'HS256'));

    if ($payload->role !== 'student') {
        http_response_code(403);
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
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'You are not enrolled in this course'
        ]);
        exit;
    }

    $query = "SELECT 
                a.id,
                a.title,
                a.description,
                a.create_time,
                a.due_date,
                u.username as instructor_name,
                CASE 
                    WHEN s.id IS NOT NULL THEN 'submitted'
                    WHEN a.due_date < NOW() THEN 'overdue'
                    ELSE 'pending'
                END as submission_status,
                s.create_time as submission_date,
                s.submission_text,
                s.attachment_url
            FROM assignments a
            JOIN user u ON a.user_id = u.id
            LEFT JOIN assignment_submissions s ON a.id = s.assignments_id AND s.user_id = ?
            WHERE a.courses_id = ?
            ORDER BY a.due_date ASC";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $payload->user_id, $course_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $assignments = [];
    while ($row = $result->fetch_assoc()) {
        $assignments[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'created_at' => $row['create_time'],
            'due_date' => $row['due_date'],
            'instructor_name' => $row['instructor_name'],
            'submission_status' => $row['submission_status'],
            'submission' => $row['submission_status'] === 'submitted' ? [
                'date' => $row['submission_date'],
                'text' => $row['submission_text'],
                'attachment_url' => $row['attachment_url']
            ] : null
        ];
    }

    echo json_encode([
        'status' => 'success',
        'assignments' => $assignments
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