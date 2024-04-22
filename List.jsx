import "./List.css"

function List({ userInputRoom, handleCreateRoom, handleContentRoom, room_list,handleJoinRoom }) {
    return (
        <>
            <div id="room_list">
                <div id="create_room">
                    <input type="text" className="create_room_inputs" id="create_room_contnet" name="fname3" value={userInputRoom} onChange={handleContentRoom}
                        placeholder="Type room name..." />
                    <button type="button" className="create_room_buttons" id="create_room_submit" onClick={handleCreateRoom}>Send</button>
                </div>
                {room_list.map((room) =>
                    <button type="button" className="join_room_button" key={room} id={room} onClick={handleJoinRoom}>Join Room {room}</button>
                )}

            </div>
        </>
    )
}

export default List