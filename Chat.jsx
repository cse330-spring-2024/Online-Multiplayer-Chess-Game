import "./Chat.css"

function Chat({ user, setUser, chat_message, setChat_message,current_room_name, setCurrent_room_name,room_list,setRoom_list}) {
    const send = function () {
        if (undefined === user) {
            window.alert("Please Log in to Send Chat!");
        }
    }

    return (
        <>
            <div id="chat">
                <div id="chat_contnet">
                    <ul id="chat_list">
                        {chat_message.map((message) =>
                            <>
                                <p className="chat_list_username">{message[0]}</p>
                                <p className="chat_list_word">{message[1]}</p>
                            </>
                        )}
                    </ul>
                </div>
                <div id="chat_input">
                    <input type="text" className="login_inputs" id="chat_input_content" name="fname3"
                        placeholder="Type chat message..." />
                    <button type="button" className="login_buttons" id="chat_input_submit" onClick={send}>Send</button>
                </div>
            </div>
        </>
    )
}

export default Chat