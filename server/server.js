
var express = require('express');
var router = express.Router();
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*'
    }
});

server.listen(330, () => {
    console.log('Server is running on port 3000');
});

//user list
const user_list = new Set();
//Data types with example listed
const room_list = new Map();
//room_list: users in rooms
//={"roomname":{"user1","user2","user3"}} 
const room_games = new Map();
//room_games: players in rooms & the place where the game info is placed
//room_games={"room_name":["user1", "user2","1","0"],'room_name":["user3", "user4","2","0"]} 
//player_X username, player_O username, index in player_history, whether the game is over
const player_history = [];//[[0,1,...,1],[2,1,...,3]];  x:0, o:1
function calculate_win(game_board) {
    const combos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < combos.length; i++) {
        const [a, b, c] = combos[i];
        if ((game_board[a] !== -1) && (game_board[a] === game_board[b]) && (game_board[a] === game_board[c])) {
            return game_board[a];
        }
    }
    //No one wins
    return -1;
}
function map_to_array(map) {
    let array = Array.from(map.keys());
    return array;
}

io.on('connection', (socket) => {
    //Login
    socket.on("login", function (data) {
        socket.join(data['username']);
        console.log("User " + data["username"] + " login");
        if (!user_list.has(data['username'])) {
            user_list.add(data['username']);
        }
    })
    //Get Room List
    socket.on("get_room_list", function (data) {
        io.sockets.to(data["username"]).emit("get_room_list", {
            room_list: map_to_array(room_list)
        });
    })

    //Create room
    //data:roomname, username
    socket.on("create_room", function (data) {//data: room_id, room_name, user_id
        if (!room_list.has(data['roomname'])) {
            console.log("User " + data['username'] + " create room " + data['roomname']);
            //Add roomname map to room_list
            room_list.set(data['roomname'], new Set());
            let history_len = player_history.length;
            console.log(history_len);
            //Add array to room_games with key roomname
            room_games.set(data['roomname'], ["", "", history_len.toString(), "0"]);//No players currently
            let empty_arr = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
            player_history.push(empty_arr);
            //Let all users know the room is creates
            for (let user of user_list) {
                io.sockets.to(user).emit("create_room", { success: true, username: data['username'], roomname: data["roomname"] });
            }
        }
        else {
            //Room Exists
            io.sockets.to(data["username"]).emit("create_room", {
                success: false
            });
        }
    })
    //Join room
    //data: roomname, username
    socket.on('join_room', function (data) {//data: room_id, room_name, user_id
        if (room_list.has(data['roomname'])) {
            //let users in the room know a user is here*
            for (let user of room_list.get(data['roomname'])) {
                io.sockets.to(user).emit("a_user_join_room", {
                    username: data['username']
                });
            }
            console.log("User " + data['username'] + " join room " + data['roomname']);
            //Add username to the roomname map
            room_list.get(data['roomname']).add(data['username']);
            //give the new user the current game board status
            io.sockets.to(data["username"]).emit("join_room", {
                current_player_x: room_games.get(data['roomname'])[0], //"user1"
                current_player_o: room_games.get(data['roomname'])[1], //"user2"
                game_board: player_history[parseInt(room_games.get(data['roomname'])[2])],
                game_result: room_games.get(data['roomname'])[3],
                roomname: data['roomname'],
                success: true
            });
            console.log("current player x " + room_games.get(data['roomname'])[0]);
            console.log("current player o " + room_games.get(data['roomname'])[1]);
            console.log("Game board:");
            console.log(parseInt(room_games.get(data['roomname'])[2]));
            console.log(player_history[parseInt(room_games.get(data['roomname'])[2])]);
            console.log("game result " + room_games.get(data['roomname'])[3]);
        }
        else {
            //Room DNE
            io.sockets.to(data["username"]).emit("join_room", {
                success: false
            });
        }
    })

    //Send message
    //data: roomname, username, message_content
    socket.on('message', function (data) {
        console.log(room_list);
        console.log("Find room: " + data['roomname']);
        if (room_list.has(data['roomname'])) {
            //let users in the room know a user is here
            for (let user of room_list.get(data['roomname'])) {
                io.sockets.to(user).emit("message", {
                    success: true,
                    username: data['username'],
                    message_content: data['message_content']
                });
            }
        }
        else {
            //Room DNE
            io.sockets.to(data["username"]).emit("message", {
                success: false
            });
        }
    })
    //Leave room: (probabily not necessary)
    //data: roomname, username
    socket.on('leave', function (data) {
        if (room_list.has(data['roomname'])) {
            console.log("User " + data['username'] + " leave room " + data['roomname']);
            //Add username to the roomname map
            room_list.get(data['roomname']).delete(data['username']);
            //let users in the room know a user is here
            for (let user of room_list.get(data['roomname'])) {
                io.sockets.to(user).emit("a_user_leave_room", {
                    username: data['username']
                });
            }
        }
    })
    //Become Player
    //data: roomname, username, player_position
    socket.on('join_player', function (data) {
        if (room_list.has(data['roomname'])) {
            let available = false;
            let apply_player = "";
            console.log(data["player_position"]);
            console.log(room_games.get(data['roomname']));
            //Apply for player x
            if (data["player_position"] === 0) {
                apply_player = "x";
                //check if player x's username is empty
                if ((room_games.get(data['roomname'])[0] === "" || room_games.get(data['roomname'])[0] === data['username']) && room_games.get(data['roomname'])[1] !== data['username']) {
                    available = true;
                }
            }
            //Apply for player o
            else {
                apply_player = "o";
                //check if player o is empty
                if ((room_games.get(data['roomname'])[1] === "" || room_games.get(data['roomname'])[1] === data['username']) && room_games.get(data['roomname'])[0] !== data['username']) {
                    available = true;
                }
            }
            if (available) {
                console.log("User " + data['username'] + " become player " + apply_player);
                //Add username to the roomname map
                room_games.get(data['roomname'])[data["player_position"]] = data['username'];
                //let users in the room know a user is here
                for (let user of room_list.get(data['roomname'])) {
                    io.sockets.to(user).emit("a_user_become_player", {
                        username: data['username'],
                        player_position: data['player_position'],
                        success: true
                    });
                }
            }
            else {
                console.log("User " + data['username'] + " failed to become player " + apply_player);
                console.log("Current " + apply_player + " is " + room_games.get(data['roomname'])[data["player_position"]]);
                //Send the notice only to the user who are applying for this position           
                io.sockets.to(data["username"]).emit("a_user_become_player", {
                    success: false
                });
            }
        }
    })

    socket.on('start_new_game', function (data) {
        console.log("User " + data['username'] + ' start new game in ' + data['roomname']);
        room_array = Array.from(room_list.get(data['roomname']))
        if (data['username'] == room_array[0]) {
            console.log("User " + data['username'] + " is room owner of " + data['roomname']);
            let index = parseInt(room_games.get(data['roomname'])[2]);
            player_history[index] = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
            room_games.get(data['roomname'])[3] = "0";
            for (user of room_array){
                io.sockets.to(user).emit("start_new_game", { success: true });
            }
            console.log("Room start new game: " + room_games.get(data['roomname']) + player_history[index]);
        }
        else {
            console.log("User " + data['username'] + " is not room owner of " + data['roomname']);
            io.sockets.to(data["username"]).emit("start_new_game", { success: false, message: "You are not room owner" });
        }
    })

    //Place a piece
    //data: roomname, username, player_position, x, y
    socket.on('place_piece', function (data) {
        if (room_list.has(data['roomname'])) {
            //Check if the user is the player
            if (data["username"] === room_games.get(data['roomname'])[data['player_position']]) {
                //check if the game is over
                if (parseInt(room_games.get(data['roomname'])[3]) === 0) {
                    console.log("Game is not over");
                    //check if the current piece is empty
                    let history_index = parseInt(room_games.get(data['roomname'])[2]);
                    let game_board = player_history[history_index];
                    console.log("Player " + data["username"] + "Played a piece at: " + data['x'] + " , " + data['y']);
                    if (game_board[(data['x'] - 1) + (data['y'] - 1) * 3] === -1) {
                        //x
                        if (data['player_position'] === 0) {
                            game_board[(data['x'] - 1) + (data['y'] - 1) * 3] = 0;
                        }
                        //o
                        else {
                            game_board[(data['x'] - 1) + (data['y'] - 1) * 3] = 1;
                        }
                        player_history[history_index] = game_board;
                        //check if any player win
                        let result = calculate_win(game_board);
                        let count = 0;
                        for (let i = 0; i < 9; i++) {
                            if (game_board[i] !== -1) {
                                count++;
                            }
                        }
                        //Game Over:Win
                        if (result === 0 || result === 1) {
                            //Let every one in the room know a player win and game over
                            //Game over: draw: over=1, winner=0 for player x, winner=1 for player o
                            for (let user of room_list.get(data['roomname'])) {
                                io.sockets.to(user).emit("place_a_piece", {
                                    username: data['username'],
                                    over: 1,
                                    game_board: game_board,
                                    winner: result,
                                    success: true
                                });
                            }
                            //Update the game status in room_games
                            room_games.get(data['roomname'])[3] = 1;
                            console.log("Game Over");
                            //Update the game status in room_games
                            room_games.get(data['roomname'])[3] = 1;
                        }
                        else {
                            //game unfinished: over=0
                            if (count < 9) {
                                for (let user of room_list.get(data['roomname'])) {
                                    io.sockets.to(user).emit("place_a_piece", {
                                        username: data['username'],
                                        over: 0,
                                        game_board: game_board,
                                        success: true
                                    });
                                }
                            }
                            //Game over: draw: over=1, winner=-1
                            else {
                                for (let user of room_list.get(data['roomname'])) {
                                    io.sockets.to(user).emit("place_a_piece", {
                                        username: data['username'],
                                        over: 1,
                                        game_board: game_board,
                                        winner: result,
                                        success: true
                                    });
                                }
                                //Update the game status in room_games
                                room_games.get(data['roomname'])[3] = 1;
                            }

                        }
                    }
                    //This place is not empty
                    else {
                        console.log("User " + data["username"] + "failed to place a piece: Place is not Empty (" + data['x'] + " , " + data['y'] + " )");
                        io.sockets.to(data["username"]).emit("place_a_piece", {
                            success: false,
                            error_code: 0
                        });
                    }
                }
                //game is over
                else {
                    console.log("User " + data["username"] + "failed to place a piece: Game is over");
                    io.sockets.to(data["username"]).emit("place_a_piece", {
                        success: false,
                        error_code: 1
                    });
                }
            }
            //user is not a current player
            else {
                console.log("User " + data["username"] + "failed to place a piece: Not current player");
                io.sockets.to(data["username"]).emit("place_a_piece", {
                    success: false,
                    error_code: 2
                });
            }
        }
    })
})
