// import { PokerPlayer } from '../types/PokerPlayer';

import { isPropertySignature } from "typescript"

const Table = (props) => {
    return (
        <div>
            <h1>Table</h1>
            <button onClick={props.startTimer}>Start Timer</button>
            <button onClick={props.stopTimer}>Stop Timer</button>
            <div>
                <button onClick={props.startGame}>Start Game</button>
            </div>
        </div>
    )
}

export default Table;