import "./List.css"

function List(user, current_room_name, setCurrent_room_name, room_list, setRoom_list,userInputRoom,handleRoomContent) {
    return (
        <>
            <div id="room_list">
                <button type="button" className="join_room_button" id="join_room1">Join Room 1</button>
            </div>
            <div id="create_room">
                <input type="text" className="create_room_inputs" id="create_room_contnet" name="fname3" value={userInputRoom} onChange={handleRoomContent}
                    placeholder="Type room name..." />
                <button type="button" className="create_room_buttons" id="create_room_submit" onClick={send}>Send</button>
            </div>
        </>
    )
}

export default List