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
    const [chat_message, setChat_message] = useState([]);
    const [current_room_name, setCurrent_room_name] = useState("");
    const [room_list, setRoom_list] = useState([]);
    //User Input
    const [userInputRoom, setUserInputRoom] = useState('');
    const [userInput, setUserInput] = useState('');
    //Game info
    const [game_board, setGame_board] = useState([-1, -1, -1, -1, -1, -1, -1, -1, -1]);
    const [game_status, setGame_status] = useState(0);
    const [players, setPlayers] = useState(["", ""]);
    const [turn, setTurn] = useState(0);
    //Initialization:Get Room List
    const handleInitialization = (e) => {
        e.preventDefault();
        socketio.emit("get_room_list", { username: user });

    }
    socketio.on("get_room_list", function (data) {
        setRoom_list(data['room_list']);
    })
    //Join Room
    const handleJoiniRoom = (e) => {
        e.preventDefault();
        socketio.emit("join_room", { username: user, roomname: current_room_name });
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
    //Create room
    const handleRoomContent = (e) => {
        setUserInputRoom(e.currentTarget.value)
    }
    const handleCreateRoom = (e) => {
        e.preventDefault();
        if (userInputRoom.length == 0) {
            alert("Empty room name, please type in a room name");
        }
        else {
            alert("Creating room " + userInputRoom);
            socketio.emit("create_room", { username: user, roomname: userInputRoom });
        }
    }
    socketio.on("create_room", function (data) {
        if (data['success'] === true) {
            let temp_room_list = room_list;
            temp_room_list.push(data["roomname"]);
            setRoom_list(temp_room_list);
            alert("You create room ");
        }
        else {
            alert("Failed to create room.");
        }
    })
    //Send Message
    const handleContent = (e) => {
        setUserInput(e.currentTarget.value)
    }
    const handleSendMessage = (e) => {
        e.preventDefault();
        socketio.emit("message", { username: user, roomname: current_room_name, message_content: userInput });
    }
    socketio.on("message", function (data) {
        if (data['success'] === true) {
            let temp_chat_message = chat_message;
            temp_chat_message.push([data["username"], data["message_content"]]);
            setChat_message(temp_chat_message);
            alert("New Message");
        }
        else {
            alert("Failed to send message.");
        }
    })
    //Leave room: (probabily not necessary)
    //Become Player
    const handleBecomePlayer = (e, roomname, username, player_position) => {
        e.preventDefault();
        socketio.emit("join_player", { username: username, roomname: roomname, player_position: player_position });
    }
    socketio.on("a_user_become_player", function (data) {
        if (data['success'] === true) {
            let temp_players = players;
            temp_players[data["player_position"]] = data["username"];
            setPlayers(temp_players);
            alert("User " + data['username'] + " becomes a player");
        }
        else {
            alert("Failed to apply for player.");
        }
    })
    //Place a piece
    const handlePlacePiece = (e, roomname, username, player_position, x, y) => {
        e.preventDefault();
        socketio.emit("place_piece", { username: username, roomname: roomname, player_position: player_position, x: x, y: y });
    }
    socketio.on("place_piece", function (data) {
        if (data['success'] === true) {
            setGame_board(data['game_board']);
            //Over
            if (data['over'] === 1) {
                setGame_status(1);
                if (data['winner'] === 0) {
                    alert("Player X " + data['username'] + "Win!");
                }
                else if (data['winner'] === 1) {
                    alert("Player O " + data['username'] + "Win!");
                }
            }
            else {
                alert("You placed a piece");
            }
        }
        else {
            if (data['error_code'] === 0) {
                alert("failed to place a piece: Place is not Empty");
            }
            else if (data['error_code'] === 1) {
                alert("failed to place a piece: Game is over");
            }
            else {
                alert("failed to place a piece: Not current player");
            }
        }
    })
    return (
        <section id="main_page">
            <Info user={user} setUser={(data) => setUser(data)} socketio={socketio}/>
            <Room user={user} setUser={(data) => setUser(data)} current_room_name={current_room_name} />
            <Game user={user} setUser={(data) => setUser(data)}
                chat_message={chat_message} setChat_message={(data) => setChat_message(data)}
                current_room_name={current_room_name} setCurrent_room_name={(data) => setCurrent_room_name(data)}
                game_board={game_board} setGame_board={(data) => setGame_board(data)}
                room_list={room_list} setRoom_list={(data) => setRoom_list(data)}
                game_status={game_status} setGame_status={(data) => setGame_status(data)}
                players={players} setPlayers={(data) => setPlayers(data)}
                turn={turn} setTurn={(data) => setTurn(data)}
                userInput={userInput}
                handleContent={handleContent}
                userInputRoom={userInputRoom}
                handleCreateRoom={handleCreateRoom}
                handleRoomContent={handleRoomContent}
            />
        </section>
    );
}

export default Window