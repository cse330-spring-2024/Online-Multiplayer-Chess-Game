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

    return (
        <section id="main_page">
            <Info user={user} setUser={(data) => setUser(data)} socketio={socketio}/>
            <Room user={user} setUser={(data) => setUser(data)} current_room_name={current_room_name}/>
            <Game user={user} setUser={(data) => setUser(data)}
                current_room_name={current_room_name} setCurrent_room_name={(data) => setCurrent_room_name(data)}
                socketio={socketio}
            />
        </section>
    );
}

export default Window