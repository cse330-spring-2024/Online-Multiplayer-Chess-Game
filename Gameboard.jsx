import "./Gameboard.css"

function Gameboard(user, setUser, game_board, setGame_board, current_room_name, setCurrent_room_name, game_status, setGame_status, players, setPlayers, turn, setTurn) {
    let empty=<></>;
    let x=<><p className="x_piece">X</p></>
    let o=<><p className="o_piece">O</p></>
    let piece_name=[];
    let piece_items=[];
    for(let i=0;i<9;i++){
        if(game_board[i]==0){
            piece_name.push("x");
            piece_items.push(x);
        }
        else if(game_board[i]==1){
            piece_name.push("o");
            piece_items.push(o);
        }
        else{
            piece_name.push("empty");
            piece_items.push(empty);
        }
    }
    return (
        <div id="TicTacToe">
            <div id="game_board">
                <div id="piece_1" className={piece_name[0]}>
                    {piece_items[0]}
                </div>
                <div id="piece_2" className={piece_name[1]}>
                    {piece_items[1]}
                </div>
                <div id="piece_3" className={piece_name[2]}>
                    {piece_items[2]}
                </div>
                <div id="piece_4" className={piece_name[3]}>
                    {piece_items[3]}
                </div>
                <div id="piece_5" className={piece_name[4]}>
                    {piece_items[4]}
                </div>
                <div id="piece_6" className={piece_name[5]}>
                    {piece_items[5]}
                </div>
                <div id="piece_7" className={piece_name[6]}>
                    {piece_items[6]}
                </div>
                <div id="piece_8" className={piece_name[7]}>
                    {piece_items[7]}
                </div>
                <div id="piece_9" className={piece_name[8]}>
                    {piece_items[8]}
                </div>
            </div>
        </div>
    );
}

export default Gameboard