const PlayerNameInput = (props) => {
    const {playerName, handlePlayerNameInput, submitName} = props;
    return (
        <form onSubmit={submitName}>
            Name:
            <input type="text" value={playerName} onChange={handlePlayerNameInput}/>
            
        </form>
    )
}

export default PlayerNameInput;