const app = require('express')()
const https = require('https').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')
const PORT = 3457
app.use(cors())
//Data types with example listed
const room_list = new Map();
//room_list: users in rooms
//={"roomname":{"user1","user2","user3"}} 
const room_games = new Map();
//room_games: players in rooms & the place where the game info is placed
//room_games={"room_name":["user1", "user2","1","0"],'room_name":["user3", "user4","2","0"]} 
//player_X username, player_Y username, index in player_X_history_x player_X_history_y,index in player_Y_history_x player_Y_history_y
const player_X_history = [];//[[0,1,],[2,1,3]];  player_position=0
const player_O_history = [];//[[1,1,2],[2,1,3]];  player_position=1
io.on('connection', (socket) => {
    //Create room
    //data:roomname, username
    socket.on("create_room", function (data) {//data: room_id, room_name, user_id
        if (!room_list.has(data['roomname'])) {
            console.log("User " + data + " create room " + data['roomname']);
            //Add roomname map to room_list
            room_list.set(data['roomname'], new Set());
            let history_len = player_X_history.length;
            //Add array to room_games with key roomname
            room_games.set(data['roomname'], ["", "", history_len.toString, "0"]);//No players currently
            let empty_arr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            player_X_history.push(empty_arr);
            player_O_history.push(empty_arr);
            //Let all users know the room is creates
            io.sockets.emit("create_room", { success: true, username: data['username'], roomname: data["roomname"] });
        }
        else {
            //Room DNE
            io.sockets.to(data["username"]).emit("create_room", {
                success: false
            });
        }
    })
    //Join room
    //data: roomname, username
    socket.on('join', function (data) {//data: room_id, room_name, user_id
        if (room_list.has(data['roomname'])) {
            //let users in the room know a user is here
            for (let user of room_list.get(data['roomname'])) {
                socketio.to(user).emit("a_user_join_room", {
                    username: data['username']
                });
            }
            console.log("User " + data['username'] + " join room " + data['roomname']);
            //Add username to the roomname map
            room_list.get(data['roomname']).add(data['username']);
            //give the new user the current game board status
            io.sockets.to(data["username"]).emit("join_room", {
                current_player_x: room_games.get(data['roomname'])[0], //"user1"
                current_player_y: room_games.get(data['roomname'])[1], //"user2"
                player_X_history: player_X_history[parseInt(room_games.get(data['roomname'])[2])],
                player_O_history: player_O_history[parseInt(room_games.get(data['roomname'])[2])],
                game_result: room_games.get(data['roomname'])[3],
                success: true
            });
        }
        else {
            //Room DNE
            io.sockets.to(data["username"]).emit("join_room", {
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
                socketio.to(user).emit("a_user_leave_room", {
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
            //Apply for player x
            if (data["player_position"] = 0) {
                apply_playet = "x";
                //check if player x's username is empty
                if (room_games.get(data['roomname'])[0] === "" || room_games.get(data['roomname'])[0] === data['username']) {
                    available = true;
                }
            }
            //Apply for player o
            else {
                apply_playet = "o";
                //check if player o is empty
                if (room_games.get(data['roomname'])[1] === "" || room_games.get(data['roomname'])[1] === data['username']) {
                    available = true;
                }
            }
            if (available) {
                console.log("User " + data['username'] + " become player " + apply_player);
                //Add username to the roomname map
                room_games.get(data['roomname'])[data["player_position"]] = data['username'];
                //let users in the room know a user is here
                for (let user of room_list.get(data['roomname'])) {
                    socketio.to(user).emit("a_user_become_player", {
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
                socketio.to(data["username"]).emit("a_user_become_player", {
                    success: false
                });
            }
        }
    })
    //Place a piece
    //data: roomname, username, player_position, x, y
    socket.on('place_piece', function (data) {
        if (room_list.has(data['roomname'])) {
            //Check if the user is the player
            if (data["username"] === room_games.get(data['roomname'])[data['player_position']]) {
                //check if the game is over
                if (parseInt(room_games.get(data['roomname'])[3]) == 0) {
                    //check if the current piece is empty
                    let history_index = parseInt(room_games.get(data['roomname'])[2]);
                    let game_board_x = player_X_history[history_index];
                    let game_board_o = player_O_history[history_index];
                    if (game_board_x[(data['x'] - 1) + (data['y'] - 1) * 3] == 0 && game_board_o[(data['x'] - 1) + (data['y'] - 1) * 3] == 0) {
                        //x
                        if(data['player_position']==0){
                            game_board_x[(data['x'] - 1) + (data['y'] - 1) * 3]=1;
                            player_X_history[history_index]=game_board_x;
                        }
                        //o
                        else{
                            game_board_o[(data['x'] - 1) + (data['y'] - 1) * 3]=1;
                            player_O_history[history_index]=game_board_o;
                        }

                    }
                    //this place is not empty
                    else {
                        console.log("User " + data["username"] + "failed to place a piece: Place is not Empty ("+data['x']+" , "+data['y']+" )");
                        socketio.to(data["username"]).emit("place_a_piece", {
                            success: false,
                            error_code: 0
                        });
                    }
                }
                //game is over
                else {
                    console.log("User " + data["username"] + "failed to place a piece: Game is over");
                    socketio.to(data["username"]).emit("place_a_piece", {
                        success: false,
                        error_code: 1
                    });
                }
            }
            //user is not a current player
            else {
                console.log("User " + data["username"] + "failed to place a piece: Not current player");
                socketio.to(data["username"]).emit("place_a_piece", {
                    success: false,
                    error_code: 2
                });
            }
        }
    })
})
app.get('/', (req, res) => {
    res.send("Server is up and running")
})

https.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
})