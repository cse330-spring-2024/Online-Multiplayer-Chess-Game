<?php
// login_ajax.php
require 'database.php';
//display error informatoins
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
//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)
$stmt = $mysqli->prepare("SELECT count(*), username, password, id from users where username=?;");
if (!$stmt) {
	printf("Unable to prepare auth query. Error Message: \n %s\n", $mysqli->error);
	exit;
}
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($cnt, $user_id, $pwd_hash, $id);
$stmt->fetch();
$stmt->close();

if (password_verify($password, $pwd_hash)) {
	ini_set("session.cookie_httponly", 1);
	session_start();
	$_SESSION['username'] = $username;
	$_SESSION['user_id'] = $id;
	$token = base64_encode(bin2hex(openssl_random_pseudo_bytes(32)));

	$stmt = $mysqli->prepare("update users set token=? where id=?;");
	if (!$stmt) {
		echo json_encode(array(
			"success" => false,
			"message" => "Server Error on Set Token!"
		));
		exit;
	}
	//Hash the input password and load the info in table user_info
	$stmt->bind_param("si", $token, $id);
	$stmt->execute();
	$stmt->close();

	echo json_encode(array(
		"success" => true,
		"token" => $token
	));
} else {
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
}
