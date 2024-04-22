import "./Game.css"
import List from "./List.jsx"
import Play from "./Play.jsx"
import { useState } from "react"
function Game({ user, setUser, current_room_name, setCurrent_room_name, socketio }) {
    //Message
    const [chat_message, setChat_message] = useState([]);
    const [userInput, setUserInput] = useState('');
    //User Input
    const [userInputRoom, setUserInputRoom] = useState('');
    //Game info
    const [game_board, setGame_board] = useState([-1, -1, -1, -1, -1, -1, -1, -1, -1]);
    const [game_status, setGame_status] = useState(0);
    const [players, setPlayers] = useState(["", ""]);
    const [turn, setTurn] = useState(0);
    const [room_list, setRoom_list] = useState([]);

    // //Initialization:Get Room List
    // const handleInitialization = (e) => {
    //     e.preventDefault();
    //     socketio.emit("get_room_list", { username: user });

    // }

    //Join Room
    const handleJoinRoom = (e) => {
        e.preventDefault();
        alert("Try to join room "+ e.currentTarget.id);
        socketio.emit("join_room", { username: user, roomname: e.currentTarget.id });
    }
    socketio.on("join_room", function (data) {
        if (data['success'] === true) {
            setCurrent_room_name(data['roomname']);
            setPlayers([data['current_player_x'], data['current_player_o']]);
            setGame_board(data['game_board']);
            setGame_status(data['game_result']);
            setChat_message([]);
            alert("You entered room " + data['roomname']);
        }
        else {
            alert("Failed to entered room ");
        }
    })
    // //Send Message
    const handleContent = (e) => {
        setUserInput(e.currentTarget.value)
    }
    // const handleSendMessage = (e) => {
    //     e.preventDefault();
    //     socketio.emit("message", { username: user, roomname: current_room_name, message_content: userInput });
    // }
    // socketio.on("message", function (data) {
    //     if (data['success'] === true) {
    //         let temp_chat_message = chat_message;
    //         temp_chat_message.push([data["username"], data["message_content"]]);
    //         setChat_message(temp_chat_message);
    //         alert("New Message");
    //     }
    //     else {
    //         alert("Failed to send message.");
    //     }
    // })
    // //Leave room: (probabily not necessary)
    // //Become Player
    // const handleBecomePlayer = (e, roomname, username, player_position) => {
    //     e.preventDefault();
    //     socketio.emit("join_player", { username: username, roomname: roomname, player_position: player_position });
    // }
    // socketio.on("a_user_become_player", function (data) {
    //     if (data['success'] === true) {
    //         let temp_players = players;
    //         temp_players[data["player_position"]] = data["username"];
    //         setPlayers(temp_players);
    //         alert("User " + data['username'] + " becomes a player");
    //     }
    //     else {
    //         alert("Failed to apply for player.");
    //     }
    // })
    // //Place a piece
    // const handlePlacePiece = (e, roomname, username, player_position, x, y) => {
    //     e.preventDefault();
    //     socketio.emit("place_piece", { username: username, roomname: roomname, player_position: player_position, x: x, y: y });
    // }
    // socketio.on("place_piece", function (data) {
    //     if (data['success'] === true) {
    //         setGame_board(data['game_board']);
    //         //Over
    //         if (data['over'] === 1) {
    //             setGame_status(1);
    //             if (data['winner'] === 0) {
    //                 alert("Player X " + data['username'] + "Win!");
    //             }
    //             else if (data['winner'] === 1) {
    //                 alert("Player O " + data['username'] + "Win!");
    //             }
    //         }
    //         else {
    //             alert("You placed a piece");
    //         }
    //     }
    //     else {
    //         if (data['error_code'] === 0) {
    //             alert("failed to place a piece: Place is not Empty");
    //         }
    //         else if (data['error_code'] === 1) {
    //             alert("failed to place a piece: Game is over");
    //         }
    //         else {
    //             alert("failed to place a piece: Not current player");
    //         }
    //     }
    // })
    const handleContentRoom = (e) =>{
        setUserInputRoom(e.currentTarget.value)
    }
    const handleCreateRoom = (e) =>  {
        e.preventDefault();
        socketio.emit("create_room", { username: user, roomname: userInputRoom });
    }

    // socketio.on("get_room_list", function (data) {
    //     setRoom_list(data['room_list']);
    // })

    //Create room
    socketio.on("create_room", function (data) {
        if (data['success'] === true) {
            let temp_room_list = room_list;
            temp_room_list.push(data["roomname"]);
            setRoom_list(temp_room_list);
            alert("You create room ");
            setUserInputRoom("");
        }
        else {
            alert("Failed to create room.");
        }
    })

    return (
        <>
            <section id="room_section">
                <List userInputRoom={userInputRoom}
                    handleCreateRoom={handleCreateRoom}
                    handleContentRoom={handleContentRoom}
                    room_list={room_list}
                    handleJoinRoom={handleJoinRoom}
                />
                <Play user={user} setUser={(data) => setUser(data)}
                    chat_message={chat_message} setChat_message={(data) => setChat_message(data)}
                    current_room_name={current_room_name} setCurrent_room_name={(data) => setCurrent_room_name(data)}
                    game_board={game_board} setGame_board={(data) => setGame_board(data)}
                    game_status={game_status} setGame_status={(data) => setGame_status(data)}
                    players={players} setPlayers={(data) => setPlayers(data)}
                    turn={turn} setTurn={(data) => setTurn(data)}
                    handleContent={() => handleContent()}
                    
                    userInput={userInput}
                />
            </section>
        </>
    );
}

export default Game