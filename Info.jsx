import "./Info.css"
import { useEffect, useState } from "react";

function Info({user, setUser, socketio}) {
    const [status, setStatus] = useState("login");

    const register = function () {
        const username = document.getElementById("register_username").value; // Get the username from the form
        const password = document.getElementById("register_password").value; // Get the password from the form

        // Make a URL-encoded string for passing POST data:
        const data = {
            'username': username,
            'password': password
        };

        fetch("http://ec2-3-140-185-106.us-east-2.compute.amazonaws.com/register_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.alert("Registration Successful!");
                } else {
                    window.alert(data.message);
                }
            })
            .catch(err => console.error(err));
    }

    const login = function () {
        const username = document.getElementById("login_username").value; // Get the username from the form
        const password = document.getElementById("login_password").value; // Get the password from the form

        // Make a URL-encoded string for passing POST data:
        const data = {
            'username': username,
            'password': password
        };

        fetch("http://ec2-3-140-185-106.us-east-2.compute.amazonaws.com/login_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.cookie = "token=" + data.token;
                    setStatus("welcome");
                    setUser(username);
                    socketio.emit("login", {username: username});
                    socketio.emit("get_room_list", { username: username });
                } else {
                    window.alert(data.message);
                }
            })
            .catch(err => console.error(err));
    }

    useEffect(
        () => {
            if (status === "register") {
                document.getElementById("login_shell").style.display = "none";
                document.getElementById("register_shell").style.display = "initial";
                document.getElementById("welcome_info_shell").style.display = "none";
            } else if(status === "login") {
                document.getElementById("login_shell").style.display = "initial";
                document.getElementById("register_shell").style.display = "none";
                document.getElementById("welcome_info_shell").style.display = "none";
            } else {
                document.getElementById("login_shell").style.display = "none";
                document.getElementById("register_shell").style.display = "none";
                document.getElementById("welcome_info_shell").style.display = "initial";
            }
        }, [status]);

    return (
        <>
            <section id="user_info">
                <div id="login_shell">
                    <div id="login">
                        <p>Welcome! Please Login</p>
                        <label htmlFor="login_username" className="login_inputs">Username:</label>
                        <input type="text" className="login_inputs" id="login_username" name="fname"
                            placeholder="Type username..." />
                        <label htmlFor="login_password" className="login_inputs">Password:</label>
                        <input type="text" className="login_inputs" id="login_password" name="lname"
                            placeholder="Type password..." />
                        <button type="button" className="login_buttons" id="login_button" onClick={login}>Login</button>
                        <p>No account?</p>
                        <button type="button" className="login_buttons" id="turn_register" onClick={() => { setStatus("register") }}>Register!</button>
                    </div>
                </div>
                <div id="register_shell">
                    <div id="register">
                        <p>Welcome! Please Register</p>
                        <label htmlFor="register_username" className="login_inputs">Username:</label>
                        <input type="text" className="login_inputs" id="register_username" name="fname2"
                            placeholder="Type username..." />
                        <label htmlFor="register_password" className="login_inputs">Password:</label>
                        <input type="text" className="login_inputs" id="register_password" name="lname2"
                            placeholder="Type password..." />
                        <button type="button" className="login_buttons" id="register_button" onClick={register}>Register</button>
                        <p>Have an account?</p>
                        <button type="button" className="login_buttons" id="turn_login" onClick={() => { setStatus("login") }}>Login!</button>
                    </div>
                </div>
                <div id="welcome_info_shell">
                    <div id="welcome_info">
                        <p>Welcome {user}! Let's join a room!</p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Info