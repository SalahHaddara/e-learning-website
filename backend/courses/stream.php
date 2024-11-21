<?php
require "./../connection.php";
require "./../../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Only GET method allowed'
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

    // if ($payload->role !== 'student' && $payload->role !== 'instructor' && $payload->role !== 'admin') {
    //     echo json_encode([
    //         'status' => 'error',
    //         'message' => 'Unauthorized access'
    //     ]);
    //     exit;
    // }

    // Prepare SQL query to fetch courses with instructor information
    $query = "
        SELECT 
            c.id, 
            c.title, 
            c.description, 
            c.status, 
            c.create_time, 
            u.username AS instructor_name
        FROM 
            courses c
        LEFT JOIN 
            course_instructos ci ON c.id = ci.courses_id
        LEFT JOIN 
            user u ON ci.user_id = u.id
        ORDER BY 
            c.create_time DESC
    ";

    $result = $conn->query($query);

    if ($result) {

        $courses = [];
        while ($row = $result->fetch_assoc()) {
            $courses[] = $row;
        }

        echo json_encode([
            'status' => 'success',
            'count' => count($courses),
            'courses' => $courses
        ]);
    } else {

        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to fetch courses: ' . $conn->error
        ]);
    }

} catch (Exception $e) {

    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid token: ' . $e->getMessage()
    ]);
}

$conn->close();
?>