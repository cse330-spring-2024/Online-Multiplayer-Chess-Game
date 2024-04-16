<!-- function registerAjax(event) {
    const username = document.getElementById("reg_username").value; // Get the username from the form
    const password = document.getElementById("reg_password").value; // Get the password from the form
    const password_retype = document.getElementById("password_retype").value;

    if (password != password_retype) {
        document.getElementById("notice").innerHTML = "Password and Retype Password Does not Match!";
    } else {
        // Make a URL-encoded string for passing POST data:
        const data = {
            'username': username,
            'password': password
        };

        fetch("register_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById("add_event").style.visibility = "hidden";
                    document.getElementById("add_event").style.height = "0";
                    document.getElementById("login").style.visibility = "visible";
                    document.getElementById("login").style.height = "auto";
                    document.getElementById("notice").innerHTML = "";
                    document.getElementById("registrate").style.visibility = "hidden";
                    document.getElementById("registrate").style.height = "0";
                } else {
                    document.getElementById("notice").innerHTML = data.message;
                }
            })
            .catch(err => console.error(err));
    }
} -->



<?php
require 'database.php';
ini_set('display_errors', true);
error_reporting(E_ALL);

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

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
