import "./Gameboard.css"

function Gameboard({game_board, handleBecomePlayer,handlePlacePiece}) {
    let empty = <></>;
    let x = <><p className="x_piece">X</p></>
    let o = <><p className="o_piece">O</p></>
    let piece_name = [];
    let piece_items = [];
    
    for (let i = 0; i < 9; i++) {
        if(game_board === undefined) {
            piece_name.push("empty");
            piece_items.push(empty);
        }
        else if (game_board[i] === 0) {
            piece_name.push("x");
            piece_items.push(x);
        }
        else if (game_board[i] === 1) {
            piece_name.push("o");
            piece_items.push(o);
        } else{
            piece_name.push("empty");
            piece_items.push(empty);
        }
    }
    return (
        <div id="TicTacToe">
            <div id="game_board">
                <div id="piece_1_1" className={piece_name[0]} onClick={handlePlacePiece}>
                    {piece_items[0]}
                </div>
                <div id="piece_1_2" className={piece_name[1]} onClick={handlePlacePiece}>
                    {piece_items[1]}
                </div>
                <div id="piece_1_3" className={piece_name[2]} onClick={handlePlacePiece}>
                    {piece_items[2]}
                </div>
                <div id="piece_2_1" className={piece_name[3]} onClick={handlePlacePiece}>
                    {piece_items[3]}
                </div>
                <div id="piece_2_2" className={piece_name[4]} onClick={handlePlacePiece}>
                    {piece_items[4]}
                </div>
                <div id="piece_2_3" className={piece_name[5]} onClick={handlePlacePiece}>
                    {piece_items[5]}
                </div>
                <div id="piece_3_1" className={piece_name[6]} onClick={handlePlacePiece}>
                    {piece_items[6]}
                </div>
                <div id="piece_3_2" className={piece_name[7]} onClick={handlePlacePiece}>
                    {piece_items[7]}
                </div>
                <div id="piece_3_3" className={piece_name[8]} onClick={handlePlacePiece}>
                    {piece_items[8]}
                </div>
            </div>
            <button type="button" className="apply_player_buttons" id="apply_submit_0" onClick={handleBecomePlayer}>Become Player X</button>
            <button type="button" className="apply_player_buttons" id="apply_submit_1" onClick={handleBecomePlayer}>Become Player O</button>
        </div>
    );
}

export default Gameboard