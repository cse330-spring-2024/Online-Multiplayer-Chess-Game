import "./Chat.css"

function Chat() {
    return (
        <>
            <div id="chat">
                <div id="chat_contnet">
                    <ul id="chat_list">
                        <li>
                            <p className="chat_list_username">User1</p>
                            <p className="chat_list_word">wow</p>
                        </li>
                        <li>
                            <p className="chat_list_username">User1</p>
                            <p className="chat_list_word">wow!</p>
                        </li>
                    </ul>
                </div>
                <div id="chat_input">
                    <input type="text" className="login_inputs" id="chat_input_content" name="fname3"
                        placeholder="Type chat message..." />
                    <button type="button" className="login_buttons" id="chat_input_submit">Send</button>
                </div>
            </div>
        </>
    )
}

export default Chat