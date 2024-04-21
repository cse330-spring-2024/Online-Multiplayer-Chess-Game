import "./Game.css"
import List from "./List.jsx"
import Play from "./Play.jsx"

function Game({ user, setUser, chat_message, setChat_message, game_board, setGame_board, current_room_name, setCurrent_room_name,room_list,setRoom_list, game_status, setGame_status, players,setPlayers,turn,setTurn,handleContent,userInput,userInputRoom,handleCreateRoom,handleRoomContent}) {
    return (
        <>
            <section id="room_section">
                <List user={user} current_room_name={current_room_name} setCurrent_room_name={(data) => setCurrent_room_name(data)} room_list={room_list} setRoom_list={(data) => setRoom_list(data)} userInputRoom={userInputRoom} handleCreateRoom={handleCreateRoom} handleRoomContent={handleRoomContent}/>
                <Play user={user} setUser={(data) => setUser(data)} 
                chat_message={chat_message} setChat_message={(data) => setChat_message(data)}
                current_room_name={current_room_name} setCurrent_room_name={(data) => setCurrent_room_name(data)} 
                game_board={game_board} setGame_board={(data) => setGame_board(data)} 
                room_list={room_list} setRoom_list={(data) => setRoom_list(data)}
                game_status={game_status} setGame_status={(data) => setGame_status(data)}
                players={players} setPlayers={(data) => setPlayers(data)}
                turn={turn} setTurn={(data) => setTurn(data)}
                handleContent={handleContent}
                userInput={userInput}/>
            </section>
        </>
    );
}

export default Game