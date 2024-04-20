import "./Window.css"
import Info from "./Info.jsx"
import Room from "./Room.jsx"
import Game from "./Game.jsx"
import { useState } from "react"

function Window(){
    const [id, setID] = useState(null);

    return(
            <section id="main_page">
                <Info id={id}/>
                <Room />
                <Game />
            </section>
    );
}

export default Window