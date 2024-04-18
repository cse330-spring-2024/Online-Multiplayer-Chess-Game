import "./Game.css"
import List from "./List.jsx"
import Play from "./Play.jsx"

function Game() {
    return (
        <>
            <section id="room_section">
                <List />
                <Play />
            </section>
        </>
    );
}

export default Game