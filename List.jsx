import "./List.css"
import { io } from 'socket.io-client'
import { useState } from "react"
function List(userInputRoom, handleCreateRoom, handleContentRoom) {
    return (
        <>
            <div id="room_list">
                <div id="create_room">
                    <input type="text" className="create_room_inputs" id="create_room_contnet" name="fname3" onChange={handleContentRoom}
                        placeholder="Type room name..." />
                    <button type="button" className="create_room_buttons" id="create_room_submit" onClick={handleCreateRoom}>Send</button>
                </div>
            </div>
        </>
    )
}

export default List