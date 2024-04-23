import "./Chat.css"

function Chat({chat_message,handleContent,userInput,handleSendMessage }) {
    return (
        <>
            <div id="chat">
                <div id="chat_contnet">
                    <ul id="chat_list">
                    </ul>
                </div>
                <div id="chat_input">
                    <input type="text" className="login_inputs" id="chat_input_content" name="fname3" value={userInput} onChange={handleContent}
                        placeholder="Type chat message..." />
                </div>
            </div>
        </>
    )
}

export default Chat