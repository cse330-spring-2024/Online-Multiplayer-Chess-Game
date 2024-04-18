import "./Gameboard.css"

function Gameboard() {
    return (
        <div id="TicTacToe">
            <div id="game_board">
                <div id="piece_1" className="x">
                    <p className="x_piece">X</p>
                </div>
                <div id="piece_2" className="o">
                    <p className="o_piece">O</p>
                </div>
                <div id="piece_3" className="empty"></div>
                <div id="piece_4" className="empty"></div>
                <div id="piece_5" className="empty"></div>
                <div id="piece_6" className="empty"></div>
                <div id="piece_7" className="empty"></div>
                <div id="piece_8" className="empty"></div>
                <div id="piece_9" className="empty"></div>
            </div>
        </div>
    );
}

export default Gameboard