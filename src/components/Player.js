import PlayingCard from './PlayingCard';
import PokerOptions from '../types/PokerOptions';

const Player = (props) => {
    const {name, chips, status, betSize} = props.player;
    const {cards, placeBet, time} = props;

    let playerHeader = <h1>{name}</h1>;
    if(props.position === props.dealer) {
        playerHeader = <h1>{name} (dealer)</h1>;
    }
    else if(props.position === props.sb) {
        playerHeader = <h1>{name} (sb)</h1>;
    }
    else if(props.position === props.bb) {
        playerHeader = <h1>{name} (bb)</h1>;
    }
    return (
        <div>
            {playerHeader}
            {
                cards.map((card, index) => (
                    <PlayingCard
                        key={name.concat(index)}
                        card={card}
                    />
                ))
            }
            <div>Name: {name}</div>
            <div>Bet Size: {betSize}</div>
            <div>Chips: {chips}</div>
            <div>Timer: {time}</div>
        </div>
    )
}

export default Player;