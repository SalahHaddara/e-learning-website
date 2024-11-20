<?php
require "./../connection.php";
require "./../../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Only DELETE method allowed'
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
            'message' => 'Unauthorized access'
        ]);
        exit;
    }

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!isset($data['course_id']) || empty($data['course_id'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Course ID is required'
        ]);
        exit;
    }

    $course_id = $data['course_id'];

    $stmt = $conn->prepare("DELETE FROM courses WHERE id = ?");
    $stmt->bind_param("i", $course_id);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Course not found'
        ]);
        exit;
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Course deleted successfully'
    ]);

    $stmt->close();

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid token or deletion failed'
    ]);
}

$conn->close();
?>