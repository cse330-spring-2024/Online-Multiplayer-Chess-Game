import "./Room.css"

function Room({current_room_name, players,game_status,turn}) {
    let display_str=""
    if(current_room_name===""){
        display_str="Please Join a Room!";
    }
    else{
        display_str=current_room_name+" X: ";
        if(players[0]===""){
            display_str=display_str+"None";
        }
        else{
            display_str=display_str+players[0];
        }
        display_str=display_str+" O: "
        if(players[1]===""){
            display_str=display_str+"None";
        }
        else{
            display_str=display_str+players[1]
        }
        if(game_status===1){
            display_str=display_str+" (Game Over)";
        }
        else{
            if(turn===0){
                display_str=display_str+" (Turn X)";
            }
            else{
                display_str=display_str+" (Turn O)";
            }
        }
    }
    return (
        <section id="room_name">
            <h2 id="room_name_word"> {display_str}</h2>
        </section>
    );
}

export default Room