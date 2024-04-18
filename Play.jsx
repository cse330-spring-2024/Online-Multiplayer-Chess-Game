import "./Play.css"
import Gameboard from "./Gameboard.jsx"
import Chat from "./Chat.jsx"

function Play_room() {
    return (
        <>
            <div id="play_room">
                <Gameboard />
                <Chat />
            </div>
        </>
    )
}

export default Play_room