<?php
require "./../connection.php";
require "./../../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Content-Type: application/json');

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

    if ($payload->role !== 'student' && $payload->role !== 'instructor') {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Unauthorized access'
        ]);
        exit;
    }

    $user_id = $payload->user_id;
    $role = $payload->role;


    $query = $role === 'student'
        ? "SELECT c.id, c.title, c.description, ce.status, u.username as instructor_name
       FROM courses c 
       JOIN course_enrollments ce ON c.id = ce.courses_id 
       LEFT JOIN course_instructos ci ON c.id = ci.courses_id
       LEFT JOIN user u ON ci.user_id = u.id
       WHERE ce.user_id = ? AND ce.status = 'active'"
        : "SELECT c.id, c.title, c.description 
       FROM courses c 
       JOIN course_instructos ci ON c.id = ci.courses_id 
       WHERE ci.user_id = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $courses = [];
    while ($row = $result->fetch_assoc()) {
        $courses[] = $row;
    }

    echo json_encode([
        'status' => 'success',
        'courses' => $courses
    ]);

    $stmt->close();

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid token'
    ]);
}

$conn->close();
?>