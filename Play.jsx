import "./Play.css"
import Gameboard from "./Gameboard.jsx"
import Chat from "./Chat.jsx"

function Play_room({ user, setUser, chat_message, setChat_message, game_board, setGame_board, current_room_name, setCurrent_room_name, room_list, setRoom_list, game_status, setGame_status }) {
    return (
        <>
            <div id="play_room">
                <Gameboard user={user} setUser={(data) => setUser(data)}
                    current_room_name={current_room_name} setCurrent_room_name={(data) => setCurrent_room_name(data)}
                    game_board={game_board} setGame_board={(data) => setGame_board(data)}
                    game_status={game_status} setGame_status={(data) => setGame_status(data)} />
                <Chat user={user} setUser={(data) => setUser(data)}
                    chat_message={chat_message} setChat_message={(data) => setChat_message(data)}
                    current_room_name={current_room_name} setCurrent_room_name={(data) => setCurrent_room_name(data)}
                    room_list={room_list} setRoom_list={(data) => setRoom_list(data)} />
            </div>
        </>
    )
}

export default Play_room