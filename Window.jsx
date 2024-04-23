import "./Window.css"
import Info from "./Info.jsx"
import Room from "./Room.jsx"
import Game from "./Game.jsx"
import { useState } from "react"
import { io } from 'socket.io-client'
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://ec2-3-140-185-106.us-east-2.compute.amazonaws.com:330';

function Window() {
    const socketio = io.connect(URL);
    const [user, setUser] = useState("");
    const [current_room_name, setCurrent_room_name] = useState("");
    const [players, setPlayers] = useState(["", ""]);
    const [game_status, setGame_status] = useState(0);
    const [turn, setTurn] = useState(0);
    return (
        <section id="main_page">
            <Info user={user} setUser={(data) => setUser(data)} socketio={socketio} current_room_name={current_room_name}/>
            <Room current_room_name={current_room_name}
                players={players}
                game_status={game_status}
                turn={turn} />
            <Game user={user} setUser={(data) => setUser(data)}
                current_room_name={current_room_name} setCurrent_room_name={(data) => setCurrent_room_name(data)}
                socketio={socketio}
                players={players} setPlayers={(data) => setPlayers(data)}
                game_status={game_status} setGame_status={(data) => setGame_status(data)}
                turn={turn} setTurn={(data) => setTurn(data)}
            />
        </section>
    );
}

export default Window