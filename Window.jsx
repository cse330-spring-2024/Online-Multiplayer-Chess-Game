import "./Window.css"
import Info from "./Info.jsx"
import Room from "./Room.jsx"
import Game from "./Game.jsx"
import { useState } from "react"

function Window(){
    const [user, setUser] = useState("");
    
    return(
            <section id="main_page">
                <Info user={user} setUser={(data) => setUser(data)}/>
                <Room user={user} setUser={(data) => setUser(data)}/>
                <Game user={user} setUser={(data) => setUser(data)}/>
            </section>
    );
}

export default Window