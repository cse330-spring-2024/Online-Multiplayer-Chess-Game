import "./Game.css"
import List from "./List.jsx"
import Play from "./Play.jsx"

function Game({user, setUser}) {
    return (
        <>
            <section id="room_section">
                <List />
                <Play user={user} setUser={(data) => setUser(data)}/>
            </section>
        </>
    );
}

export default Game