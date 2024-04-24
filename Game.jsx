import "./Game.css"
import List from "./List.jsx"
import Play from "./Play.jsx"
import { useState, useEffect } from "react"
function Game({ user, setUser, current_room_name, setCurrent_room_name, socketio, players, setPlayers, game_status, setGame_status, turn, setTurn }) {
    //Message
    const [userInput, setUserInput] = useState('');
    //User Input
    const [userInputRoom, setUserInputRoom] = useState('');
    //Game info
    const [game_board, setGame_board] = useState([-1, -1, -1, -1, -1, -1, -1, -1, -1]);
    const [room_list, setRoom_list] = useState([]);

    //Join Room
    const handleJoinRoom = (e) => {
        e.preventDefault();
        socketio.emit("leave", {username: user, roomname: current_room_name});
        socketio.emit("join_room", { username: user, roomname: e.currentTarget.id });
    }
    socketio.on("join_room", function (data) {
        if (data['success'] === true) {
            setCurrent_room_name(data['roomname']);
            setPlayers([data['current_player_x'], data['current_player_o']]);
            setGame_board(data['game_board']);
            setGame_status(data['game_result']);
            // alert("You entered room " + data['roomname']);

            document.getElementById("chat_list").innerHTML = "";
            document.getElementById("chat_input_content").setAttribute("room", data['roomname']);
            document.getElementById("chat_input_content").setAttribute("user", data['username']);
        }
        else {
            alert("Failed to entered room ");
        }
    })
    // //Send Message
    const handleContent = (e) => {
        setUserInput(e.currentTarget.value)
    }
    const handleSendMessage = function() {
        if (user === "" || user === undefined) {
            alert("Please Login to Send a Message!");
        }
        else {
            socketio.emit("message", { username: user, roomname: current_room_name, message_content: userInput });
        }
        setUserInput("");
    }

    socketio.on("message", function (data) {
        if (data['success'] === true) {
            window.alert("1");
            let single_chat = document.createElement("li");
            let single_user = document.createElement("p");
            let chat_word = document.createElement("p");
            single_user.classList.add('chat_list_username');
            chat_word.classList.add('chat_list_word');
            single_user.innerHTML = data['username'];
            chat_word.innerHTML = data['message_content'];
            single_chat.appendChild(single_user);
            single_chat.appendChild(chat_word);
            document.getElementById("chat_list").appendChild(single_chat);
        }
        else {
            alert("Failed to send message.");
        }
    })
    // //Leave room: (probabily not necessary)
    //Become Player
    const handleBecomePlayer = (e) => {
        let position = parseInt(e.currentTarget.id.split('_')[2]);
        e.preventDefault();
        socketio.emit("join_player", { username: user, roomname: current_room_name, player_position: position });
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
    const handlePlacePiece = (e) => {
        e.preventDefault();
        if (players[turn] === user) {
            let x = e.currentTarget.id.split('_')[2];
            let y = e.currentTarget.id.split('_')[1];
            socketio.emit("place_piece", { username: user, roomname: current_room_name, player_position: turn, x: x, y: y });
        }
        else {
            alert("Not Your Turn!");
        }
    }
    socketio.on("place_a_piece", function (data) {
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
                setTurn(0);
            }
            else {
                setTurn((prevState, props) => { return (1 - prevState) }, () => {
                    this.props.updateItem(this.turn)
                });
                // alert("You placed a piece, now turn: " + (1 - turn));
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
    const handleContentRoom = (e) => {
        setUserInputRoom(e.currentTarget.value)
    }
    const handleCreateRoom = (e) => {
        e.preventDefault();
        socketio.emit("create_room", { username: user, roomname: userInputRoom });
    }

    const handleStartNewGame = (e) => {
        e.preventDefault();
        if (user === "" || current_room_name === "") {
            window.alert("Please log in and join a room");
        } else {
            socketio.emit("start_new_game", { username: user, roomname: current_room_name });
        }
    }

    socketio.on("get_room_list", function (data) {
        setRoom_list(data['room_list']);
    })

    //Create room
    socketio.on("create_room", function (data) {
        if (data['success'] === true) {
            socketio.emit("get_room_list", { username: user });
        }
        else {
            alert("Failed to create room.");
        }
    })

    //start new game
    socketio.on("start_new_game", function(data){
        if(data['success']){
            setGame_board([-1, -1, -1, -1, -1, -1, -1, -1, -1]);
        }
        else{
            window.alert(data['message']);
        }
    });

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
                    current_room_name={current_room_name} setCurrent_room_name={(data) => setCurrent_room_name(data)}
                    game_board={game_board} setGame_board={(data) => setGame_board(data)}
                    game_status={game_status} setGame_status={(data) => setGame_status(data)}
                    players={players} setPlayers={(data) => setPlayers(data)}
                    handleContent={handleContent}
                    handleSendMessage={handleSendMessage}
                    userInput={userInput}
                    handleBecomePlayer={handleBecomePlayer}
                    handlePlacePiece={handlePlacePiece}
                    handleStartNewGame={handleStartNewGame}
                />
            </section>
        </>
    );
}

export default Game