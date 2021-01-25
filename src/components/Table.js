import Opponent from './Opponent'
import PlayingCard from './PlayingCard';

const Table = (props) => {
    return (
        <div>
            <h1>Table</h1>
            <div>Pot: {props.pot}</div>
            <div>Dealer: {props.dealer}</div>
            <div>currentPlayer: {props.currentPlayer}</div>
            <div>Phase: {props.phase}</div>
            <div>
                <button onClick={props.startGame}>Start Game</button>
                <button onClick={props.startTimer}>Start Timer</button>
                <button onClick={props.stopTimer}>Stop Timer</button>
            </div>
            {
                props.cards.map(card => (
                    <PlayingCard
                        key={card.value.toString().concat(card.suit.toString())}
                        card={card}
                    />
                ))
            }
            {/* {
                props.players.map(player => (
                    <Opponent
                        key={player.position}
                        player={player}
                    />
                ))
            } */}
        </div>
    )
}

export default Table;