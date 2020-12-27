const Player = (props) => {
    const {cards, chipCount, status, betSize, placeBet, value, time} = props;
    return (
        <div>
            <h1>PLAYER</h1>
            <div>Cards: {cards}</div>
            <div>Chips: {chipCount}</div>
            <div>Bet Size: {betSize}</div>
            <div>Timer: {time}</div>
            <button onClick={() => placeBet()}>Hit event</button>
            <div>{value}</div>
        </div>
    )
}

export default Player;