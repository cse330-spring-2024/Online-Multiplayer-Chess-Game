import "./Window.css"
import Info from "./Info.jsx"
import Room from "./Room.jsx"
import Game from "./Game.jsx"
import { useState } from "react"

function Window() {
    const [user, setUser] = useState("");
    const [chat_message, setChat_message] = useState([]);
    const [game_board, setGame_board] = useState([]);
    const [chat_room_name, setChat_room_name] = useState("");
    const [room_list, setRoom_list] = useState([]);
    return (
        <section id="main_page">
            <Info user={user} setUser={(data) => setUser(data)} />
            <Room user={user} setUser={(data) => setUser(data)} chat_room_name={chat_room_name} />
            <Game user={user} setUser={(data) => setUser(data)} chat_message={chat_message} setChat_message={(data) => setChat_message(data)} game_board={game_board} setGame_board={(data) => setGame_board(data)} chat_room_name={chat_room_name} setChat_room_name={(data) => setChat_room_name(data)} room_list={room_list} setRoom_list={setRoom_list}/>
        </section>
    );
}

export default Window