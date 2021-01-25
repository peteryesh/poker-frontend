import PlayingCard from './PlayingCard';

const Table = (props) => {
    const {position, status, chips, cards, betSize, rebuys, permissions} = props.player;
    let name = props.player.name;
    if(name === '') {
        name = "Empty Seat"
    }
    return (
        <div>
            <div>name: {name}</div>
            <div>status: {status}</div>
            <div>betSize: {betSize}</div>
            <div>chips: {chips}</div>
            {
                cards.map((card, index) => (
                    <PlayingCard
                        key={name.concat(index)}
                        card={card}
                    />
                ))
            }
        </div>
    )
}

export default Table;
