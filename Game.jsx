import "./Game.css"
import List from "./List.jsx"
import Play from "./Play.jsx"

function Game({ user, setUser, chat_message, setChat_message, game_board, setGame_board, chat_room_name, setChat_room_name,room_list,setRoom_list }) {
    return (
        <>
            <section id="room_section">
                <List chat_room_name={chat_room_name} setChat_room_name={(data) => setChat_room_name(data)} room_list={room_list} setRoom_list={(data) => setRoom_list(data)}/>
                <Play user={user} setUser={(data) => setUser(data)} chat_message={chat_message} setChat_message={(data) => setChat_message(data)} game_board={game_board} setGame_board={setGame_board} chat_room_name={chat_room_name} setChat_room_name={setChat_room_name} />
            </section>
        </>
    );
}

export default Game