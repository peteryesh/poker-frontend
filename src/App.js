import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import Table from './components/Table';
import Player from './components/Player';
import PlayerNameInput from './components/PlayerNameInput';
import BettingOptions from './components/BettingOptions';

import { PlayerStatus } from './types/PlayerStatus';
import { PokerOptions } from './types/PokerOptions';
import { PlayerInfo } from './components/PlayerInfo';

import socket from './socket';

class App extends Component {
  constructor() {
    super();
    this.state = {
      // player info
      playerName: '',
      playerBet: '',
      position: 0,
      currentTime: 0,
      cards: [],
      option: PokerOptions.NONE,
      loaded: 0,

      // table
      pot: 0,
      minBet: 20,
      currentBet: 50,
      dealer: 0,
      sb: 0,
      bb: 0,
      currentPlayer: 0,
      action: 0,
      playerCount: 0,
      folded: 0,
      eliminated: 0,
      phase: 0,
      tableCards: [],
      winners: [],

      players: PlayerInfo

      // settings

    }

    // timer if player is currently active
    this.timer = 0;
    this._isMounted = false;
  }

  // --- Class methods for mounting/unmounting ---
  componentDidMount() {
    this._isMounted = true;

    // SOCKET FUNCTIONS

    // update live game time of current player
    socket.on("game_time", (data) => {
      if(this.state.players[this.state.position].status < 4) {
        this.setState({
          currentTime: data.time
        })
      }
    });

    socket.on("player_info", (data) => {
      if(data.accepted) {
        console.log("welcome to the game");
        this.setState({
          position: data.position,
          loaded: 1,
        })
      }
      else {
        console.log("please choose a different name");
      }
    });

    socket.on("deal_cards", (data) => {
      console.log(data.cards);
      this.setState({
        cards: data.cards
      })
    });

    socket.on("game_state", (data) => {
      console.log("game state");
      for(let i = 0; i < data.players.length; i++) {
        const newPlayers = [
          ...this.state.players.slice(0, i),
          data.players[i],
          ...this.state.players.slice(i + 1)
        ]
        this.setState({
          players: newPlayers
        });
      }
      this.setState({
        pot: data.table.pot,
        minBet: data.table.minBet,
        currentBet: data.table.currentBet,
        dealer: data.table.dealer,
        bb: data.table.bb,
        sb: data.table.sb,
        utg: data.table.utg,
        currentPlayer: data.table.currentPlayer,
        action: data.table.action,
        playerCount: data.table.playerCount,
        folded: data.table.folded,
        eliminated: data.table.eliminated,
        phase: data.table.phase,
        tableCards: data.table.tableCards
      })
    });

    socket.on("start_turn", (data) => {
      console.log("turn started");
      this.setState({
        currentTime: data.time
      }, () => this.startTimer());
    });

    socket.on("reset_option", () => {
      console.log("resetting option")
      this.setState({
        option: PokerOptions.NONE,
        playerBet: '',
        winners: []
      }, () => console.log(this.state.option))
    });

    // NEED TO FIX HOW CHIPS ARE DISTRIBUTED TO WINNERS IN THE CASE OF A TIE
    socket.on("declare_winners", (data) => {
      this.setState({
        winners: data.winners
      }, () => {
        this.stopTimer();
        console.log("winners: ", this.state.winners);
      }) 
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    socket.disconnect();
  }

  // --- Player timer functions ---
  startTimer = () => {
    if(this.timer === 0 && this.state.currentTime > 0) {
      this.timer = setInterval(this.timerTick, 1000);
    }
  }

  timerTick = () => {
    let time = this.state.currentTime;
    time = time - 1;

    if(time < 0) {
      clearInterval(this.timer);
      this.timer = 0;
      this.placeFold(false);
    }
    else {
      socket.emit("current_time", JSON.stringify({playerTime: time}));
      this.setState({
        currentTime: time
      });
    }
  }

  stopTimer = () => {
    clearInterval(this.timer);
    this.timer = 0;
  }

  // --- Input functions ---
  handlePlayerNameInput = (event) => {
    this.setState({playerName: event.target.value});
  }

  submitName = (event) => {
    event.preventDefault();
    console.log("submit name: ", this.state.playerName);
    const data = JSON.stringify({name: this.state.playerName});
    socket.emit("set_player_name", data);
  }

  handleBetInput = (event) => {
    if(/^-?\d+$/.test(event.target.value) || event.target.value === '') {
      this.setState({playerBet: event.target.value});
    }
  }

  // --- Game Phase functions ---
  startGame = () => {
    console.log(this.state.playerCount)
    if(this.state.playerCount >= 2) {
      socket.emit("start_game")
    }
  }

  checkWin = () => {
    if(this.state.playerCount - this.state.eliminated === 1) {
      console.log("won the game");
      return 2;
    }
    else if(this.state.playerCount - this.state.folded === 1) {
      console.log("won the hand");
      return 1;
    }
    console.log("no win");
    return 0;
  }

  isCurrentPlayer = () => {
    return this.state.currentPlayer === this.state.position;
  }

  preSelectOption = () => {
    let optionSelected = this.state.option > PokerOptions.BET;
    switch(this.state.option) {
      case PokerOptions.FOLD:
        console.log("fold");
        this.placeFold(false);
        break;
      case PokerOptions.CHECKCALL:
        if(this.state.currentBet <= 0) {
          this.placeCheck();
        }
        else {
          this.placeCall();
        }
        break;
      case PokerOptions.CHECKFOLD:
        if(this.state.currentBet <= 0) {
          this.placeCheck();
        }
        else {
          this.placeFold();
        }
        break;
      case PokerOptions.ALLIN:
        this.placeAllIn(false);
        break;
      default:
        console.log("no option selected")
        break;
    }
    return optionSelected;
  }

  // --- Betting functions ---
  placeCheck = () => {
    // push game state forward
    console.log("check");
    if(this.state.currentBet === 0 || this.state.phase === 0 && this.state.position === this.state.bb && this.state.currentBet === this.state.minBet) {
      this.setState({
        option: PokerOptions.CHECK
      }, () => {
        this.stopTimer();
        socket.emit("next_turn", JSON.stringify({option: this.state.option, betSize: this.state.currentBet, position: this.state.position}));
      });
    }
    else {
      console.log("please match the bet or fold");
    }
  }

  placeCall = () => {
    // update chips, push chips to pot, push game state forward
    console.log("call");
    let player = this.state.players[this.state.position];
    this.setState({
      option: PokerOptions.CALL
    }, () => {
      this.stopTimer();
      socket.emit("next_turn", JSON.stringify({option: this.state.option, betSize: this.state.currentBet, position: this.state.position}));
    });
  }

  placeBet = () => {
    // update chips, push chips to pot, push game state forward
    console.log("bet");
    let bet = parseInt(this.state.playerBet);
    const player = this.state.players[this.state.position];
    if(this.state.playerBet === '') {
      console.log("please enter bet");
    }
    else if(bet > player.chips) {
      console.log("bet is too high");
    }
    else if(bet === player.chips) {
      this.placeAllIn(false)
    }
    else if(bet === this.state.currentBet) {
      this.placeCall();
    }
    else if(bet < this.state.currentBet || bet - this.state.currentBet < this.state.minBet) {
      console.log("please choose a higher bet");
    }
    else {
      this.setState({
        option: PokerOptions.BET
      }, () => {
        this.stopTimer();
        socket.emit("next_turn", JSON.stringify({option: this.state.option, betSize: bet, position: this.state.position}));
      });
    }
  }

  placeFold = (preselect) => {
    // enable preselect and ability to push game state forward
    if(preselect) {
      this.setState({
        option: PokerOptions.FOLD
      });  
    }
    else {
      console.log("fold");
      this.setState({
        option: PokerOptions.FOLD
      }, () => {
        this.stopTimer();
        socket.emit("next_turn", JSON.stringify({option: this.state.option, betSize: 0, position: this.state.position}));
      });
    }
  }

  placeCheckCall = () => {
    // enable preselect
    console.log("check-call");
    this.setState({
      option: PokerOptions.CHECKCALL
    });
  }

  placeCheckFold = () => {
    // enable preselect
    console.log("check-fold");
    this.setState({
      option: PokerOptions.CHECKFOLD
    });
  }

  placeAllIn = (preselect) => {
    // enable preselect and ability to push game state forward
    if(preselect) {
      this.setState({
        option: PokerOptions.ALLIN
      });
    }
    else {
      console.log("all-in");
      const player = this.state.players[this.state.position]
      this.setState({
        option: PokerOptions.ALLIN
      }, () => {
        this.stopTimer();
        socket.emit("next_turn", JSON.stringify({option: this.state.option, betSize: player.chips + player.betSize, position: this.state.position}));
      });
    }
  }

  render() {
    const {players, position} = this.state;
    if(!this.state.loaded) {
      return (
        <div className="App">
          <PlayerNameInput
            playerName={this.state.playerName}
            handlePlayerNameInput={this.handlePlayerNameInput}
            submitName={this.submitName}
          />
        </div>
      );
    }
    return (
      <div className="App">
        <Table
          startTimer={this.startTimer}
          stopTimer={this.stopTimer}
          startGame={this.startGame}
          players={players}
          pot={this.state.pot}
          dealer={this.state.dealer}
          currentPlayer={this.state.currentPlayer}
          phase={this.state.phase}
          cards={this.state.tableCards}
          position={position}
        />
        <Player
          player={players[position]}
          cards={this.state.cards}
          currentOption={this.state.option}
          time={this.state.currentTime}
          dealer={this.state.dealer}
          sb={this.state.sb}
          bb={this.state.bb}
          position={this.state.position}

        />
        <BettingOptions
          isCurrentPlayer={this.isCurrentPlayer}
          currentBet={this.state.currentBet}
          playerBet={this.state.playerBet}
          handleBetInput={this.handleBetInput}
          position={this.state.position}
          bb={this.state.bb}
          minBet={this.state.minBet}
          phase={this.state.phase}

          placeCheck={this.placeCheck}
          placeCall={this.placeCall}
          placeBet={this.placeBet}
          placeFold={this.placeFold}
          placeCheckCall={this.placeCheckCall}
          placeCheckFold={this.placeCheckFold}
          placeAllIn={this.placeAllIn}
          stopTimer={this.stopTimer}
        />
      </div>
    );
  }
}

export default App;