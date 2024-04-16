<!-- function loginAjax(event) {
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = {
        'username': username,
        'password': password
    };

    fetch("login_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        }
    })
        .then(response => response.json())
        //change site display
        .then(data => {
            if (data.success) {
                document.getElementById("add_event").style.visibility = "visible";
                document.getElementById("add_event").style.height = "auto";
                document.getElementById("login").style.visibility = "hidden";
                document.getElementById("login").style.height = "0";
                document.getElementById("notice").innerHTML = "";
                document.getElementsByTagName("h1")[0].innerHTML = "Welcome " + username + " to MOYU Calendar";
                document.getElementById("event_on_this_day").style.visibility = "visible";
                document.getElementById("event_on_this_day").style.height = "300px";
                document.getElementById("event_on_this_day").style.width = "100%";
                document.getElementById("event_on_this_day").innerHTML = "<h2>Click on Calendar to see Event on a Day!</h2>";
                document.getElementById("user_operation").style.display = "flex";
                document.getElementById("user_operation").style.flexDirection = "row";
                document.cookie = "token=" + data.token;
            } else {
                document.getElementById("notice").innerHTML = "Wrong Password or Username!";
            }
        })

        .catch(err => console.error(err));
} -->





<?php
// login_ajax.php
require 'database.php';
//display error informatoins
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
//This is equivalent to what you previously did with $_POST['username'] and $_POST['password']

// Check to see if the username and password are valid.  (You learned how to do this in Module 3.)
$stmt = $mysqli->prepare("SELECT count(*), username, password, id from users where username=?");
if (!$stmt) {
    printf("Unable to prepare auth query. Error Message: \n %s\n", $mysqli->error);
    exit;
}
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->bind_result($cnt, $user_id, $pwd_hash, $id);
$stmt->fetch();
$stmt->close();

if(password_verify($password, $pwd_hash)){
	ini_set("session.cookie_httponly", 1);
	session_start();
	$_SESSION['username'] = $username;
	$_SESSION['user_id'] = $id;
	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 

	echo json_encode(array(
		"success" => true,
		"token" => $_SESSION['token']
	));
}else{
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
}