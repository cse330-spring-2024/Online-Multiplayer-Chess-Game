import "./List.css"
import { io } from 'socket.io-client'
import { useState } from "react"
function List(user, current_room_name, setCurrent_room_name, userInputRoom, setUserInputRoom) {
    //Create room
    const socketio = io.connect('http://ec2-3-140-185-106.us-east-2.compute.amazonaws.com:330');
    const [room_list, setRoom_list] = useState([]);

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
    socketio.on("get_room_list", function (data) {
        setRoom_list(data['room_list']);
    })
    return (
        <>
            <div id="room_list">
                <div id="create_room">
                    <input type="text" className="create_room_inputs" id="create_room_contnet" name="fname3" value={userInputRoom} onChange={handleRoomContent}
                        placeholder="Type room name..." />
                    <button type="button" className="create_room_buttons" id="create_room_submit" onClick={handleCreateRoom}>Send</button>
                </div>
                {room_list.map((room) =>
                    <button type="button" className="join_room_button" id={room}>Join Room {room}</button>
                )}
            </div>
        </>
    )
}

export default List