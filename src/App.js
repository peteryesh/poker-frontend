import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import Table from './components/Table.js';
import Player from './components/Player.js';
import PlayerNameInput from './components/PlayerNameInput';

import { PlayerStatus } from './types/PlayerStatus';
import { OpponentInfo } from './components/OpponentInfo';

import socket from './socket';

class App extends Component {
  constructor() {
    super();
    this.state = {
      // player info
      playerName: '',
      chips: 0,
      cards: [],
      position: 0,
      status: -1,
      betSize: 0,
      rebuys: 0,
      permissions: [],

      currentTime: 10,

      // table

      // settings

    }

    // timer if player is currently active
    this.timer = 0;
    this._isMounted = false;
  }

  // --- Class methods for mounting/unmounting ---
  componentDidMount() {
    this._isMounted = true;

    // set parameters based on current game settings

    // update live game time of current player
    socket.on("game_time", (data) => {
      if(this.state.status < 10) {
        this.setState({
          currentTime: data.time
        })
      }
    });

    socket.on("player_info", (data) => {
      if(data.accepted) {
        this.setState({
          chips: data.chips,
          position: data.position,
          status: PlayerStatus.INACTIVE,
          permissions: data.permissions
        });
        console.log("welcome to the game");
      }
      else {
        console.log("please choose a different name");
      }
    });

    socket.on("deal_cards", (data) => {
      console.log(data.gamestate);
      console.log("LETS GOOOO");
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    socket.disconnect();
  }

  // --- Testing functions ---
  // Test http post request
  postData = () => {
    console.log("sending post");
    const data = JSON.stringify({name: "peter"});
    axios.post('http://localhost:5000/player_name', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
  // Test http get request
  getData = () => {
    console.log("pressed get data")
    axios.get('http://localhost:5000/get_slow_data')
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.log(error)
        })
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

    if(time <= 0) {
      clearInterval(this.timer);
    }
    socket.emit("current_time", JSON.stringify({playerTime: time}));

    this.setState({
      currentTime: time
    });
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
    this.setState({playerName: event.target.value});
  }

  // --- General functions ---

  startGame = () => {
    socket.emit("start_game")
  }

  placeBet = () => {
    this.setState((prevState) => ({
      betSize: prevState.betSize + 10
    }));
  }

  render() {
    const {response} = this.state;
    return (
      <div className="App">
        <PlayerNameInput
          playerName={this.state.playerName}
          handlePlayerNameInput={this.handlePlayerNameInput}
          submitName={this.submitName}
        />
        <Table
          startTimer={this.startTimer}
          stopTimer={this.stopTimer}
          startGame={this.startGame}
        />
        <Player
          cards={this.state.cards}
          chipCount={this.state.chips}
          status={this.state.status}
          betSize={this.state.betSize}
          placeBet={this.placeBet}
          value={response}
          time={this.state.currentTime}
        />
      </div>
    );
  }
}

export default App;
