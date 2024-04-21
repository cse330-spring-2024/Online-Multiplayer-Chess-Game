import "./Play.css"
import Gameboard from "./Gameboard.jsx"
import Chat from "./Chat.jsx"

function Play_room({user, setUser}) {
    return (
        <>
            <div id="play_room">
                <Gameboard />
                <Chat user={user} setUser={(data) => setUser(data)} chat_message={chat_message} setChat_message={(data) => setChat_message(data)}/>
            </div>
        </>
    )
}

export default Play_room