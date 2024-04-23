import "./Play.css"
import Gameboard from "./Gameboard.jsx"
import Chat from "./Chat.jsx"

function Play({ user, setUser, chat_message, setChat_message, current_room_name, setCurrent_room_name, game_board, setGame_board, game_status, setGame_status, players, setPlayers, turn, handleContent, handleSendMessage, userInput, handleBecomePlayer, handlePlacePiece, handleStartNewGame }) {
    return (
        <>
            <div id="play_room">
                <Gameboard
                    user={user}
                    game_board={game_board}
                    handleBecomePlayer={handleBecomePlayer}
                    handlePlacePiece={handlePlacePiece}
                    handleStartNewGame={handleStartNewGame}
                />
                <Chat
                    chat_message={chat_message} setChat_message={(data) => setChat_message(data)}
                    handleContent={handleContent}
                    handleSendMessage={handleSendMessage}
                    userInput={userInput} />
            </div>
        </>
    )
}

export default Play