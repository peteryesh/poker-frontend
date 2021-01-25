const BettingOptions = (props) => {
    let bettingArea =   <div>
                            <div>not current player betting options</div>
                            <div>
                                <button onClick={props.placeCheckCall}>Check-Call</button>
                                <button onClick={props.placeCheckFold}>Check-Fold</button>
                                <button onClick={() => props.placeFold(true)}>Fold</button>
                                <button onClick={() => props.placeAllIn(true)}>All in</button>
                            </div>
                        </div>

    if(props.isCurrentPlayer()) {
        if(props.position === props.bb && props.currentBet === props.minBet && props.phase === 0) {
            bettingArea =   <div>
                                <div>current player betting options</div>
                                <div>
                                    <button onClick={props.placeCheck}>Check</button>
                                    <button onClick={props.placeBet}>Raise</button>
                                    <button onClick={() => props.placeFold(false)}>Fold</button>
                                    <button onClick={() => props.placeAllIn(false)}>All in</button>
                                </div>
                            </div>
        }
        else if(props.currentBet > 0) {
            bettingArea =   <div>
                                <div>current player betting options</div>
                                <div>
                                    <button onClick={props.placeCall}>Call</button>
                                    <button onClick={props.placeBet}>Raise</button>
                                    <button onClick={() => props.placeFold(false)}>Fold</button>
                                    <button onClick={() => props.placeAllIn(false)}>All in</button>
                                </div>
                            </div>
        }
        else {
            bettingArea =   <div>
                                <div>current player betting options</div>
                                <div>
                                    <button onClick={props.placeCheck}>Check</button>
                                    <button onClick={props.placeBet}>Bet</button>
                                    <button onClick={() => props.placeFold(false)}>Fold</button>
                                    <button onClick={() => props.placeAllIn(false)}>All in</button>
                                </div>
                            </div>
        }   
    }

    if(props.phase == 4) {
        bettingArea = <div>round over</div>
    }

    return (
        <div>
            Bet Size:
            <input type="text" value={props.playerBet} onChange={props.handleBetInput}/>
            {bettingArea}
        </div>
    );
}

export default BettingOptions;