<?php
$server = "localhost";
$user = "root";
$password = "";
$database = "e_learning_platform";

$conn = new mysqli($server, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
