<?php
require 'database.php';
ini_set('display_errors', true);
error_reporting(E_ALL);

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
header("Access-Control-Allow-Headers: X-Requested-With, content-type");

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $json_obj['username'];
$password = $json_obj['password'];

$cnt = 0;
$stmt = $mysqli->prepare("select count(*) from users WHERE username=?");
if (!$stmt) {
    echo json_encode(array(
		"success" => false,
		"message" => "Server Error!"
	));
	exit;
}
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($cnt);
$stmt->fetch();
$stmt->close();

//If the username is not yet registered
if ($cnt == 0) {
    $stmt = $mysqli->prepare("insert into users (username, password) values (?, ?)");
    if (!$stmt) {
        echo json_encode(array(
            "success" => false,
            "message" => "Server Error!"
        ));
        exit;
    }
    //Hash the input password and load the info in table user_info
    $salted_password = password_hash($password, PASSWORD_BCRYPT);
    $stmt->bind_param("ss", $username, $salted_password);
    $stmt->execute();
    $stmt->close();
    echo json_encode(array(
		"success" => true
	));
	exit;
}
//If the username is already registered
else{
    echo json_encode(array(
		"success" => false,
		"message" => "This username has registrated!"
	));
	exit;
}
