import "./Info.css"

function Info() {
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
                        <button type="button" className="login_buttons" id="login_button">Login</button>
                        <p>No account?</p>
                        <button type="button" className="login_buttons" id="turn_register">Register!</button>
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
                        <button type="button" className="login_buttons" id="register_button">Register</button>
                        <p>Have an account?</p>
                        <button type="button" className="login_buttons" id="turn_login">Login!</button>
                    </div>
                </div>
                <div id="welcome_info_shell">
                    <div id="welcome_info">
                        <p>Welcome! User XXX. Let's join a room!</p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Info