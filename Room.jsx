import "./Room.css"

function Room({current_room_name}) {
    let display_str=""
    if(current_room_name===""){
        display_str="Please Join a Room!";
    }
    else{
        display_str=current_room_name;
    }
    return (
        <section id="room_name">
            <h2 id="room_name_word"> {display_str}</h2>
        </section>
    );
}

export default Room