import "./Window.css"
import Info from "./Info.jsx"
import Room from "./Room.jsx"
import Game from "./Game.jsx"
import { useState } from "react"

function Window(){
    return(
            <section id="main_page">
                <Info/>
                <Room />
                <Game />
            </section>
    );
}

export default Window