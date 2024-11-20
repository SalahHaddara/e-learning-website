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

try {
    $jwt = $headers['Authorization'];
    $payload = JWT::decode($jwt, new Key("jwt_secret_key", 'HS256'));

    if ($payload->role !== 'student') {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Only students can submit assignments'
        ]);
        exit;
    }

    $attachment_url = null;
    if (isset($_FILES['attachment'])) {
        $file = $_FILES['attachment'];
        $fileName = uniqid() . '_' . $file['name'];
        $uploadDir = "./../uploads/assignments/";

        if (move_uploaded_file($file['tmp_name'], $uploadDir . $fileName)) {
            $attachment_url = 'uploads/assignments/' . $fileName;
        }
    }


} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}