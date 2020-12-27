import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import Table from './components/Table.js';
import Player from './components/Player.js';

import { PlayerStatus } from './types/PlayerStatus';
import { OpponentInfo } from './components/OpponentInfo';

import socket from './socket';

class App extends Component {
  constructor() {
    super();
    this.state = {
      // player
      cards: [],
      chipCount: 5000,
      status: PlayerStatus.ACTIVE,
      betSize: 0,
      position: 0,
      currentTime: -1,

      // table
      pot: 0,
      opponents: OpponentInfo,

      // settings
      minBet: 200,
      timer: 10,
    }
  }

  componentDidMount() {
      // set parameters based on current game settings
      socket.on("timer", (data) => this.setState({
        currentTime: data.time
      }))
  }

  getData = () => {
    axios.get('http://localhost:5000')
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.log(error)
        })
  }

  postData = () => {
      const data = JSON.stringify({hello: "there"});
      axios.post('http://localhost:5000/insert', data, {
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => {
          console.log(response.data)
      })
      .catch(error => {
          console.log(error)
      })
  }

  startTimer = () => {
    socket.emit("start_timer", {time: this.state.timer})
  }

  placeBet = () => {
    socket.emit("my event", {"msg":"message"});
    this.setState((prevState) => ({
      betSize: prevState.betSize + 50
    }))
  }

  render() {
    const {response} = this.state;
    return (
      <div className="App">
        <Table/>
        <Player
          cards={this.state.cards}
          chipCount={this.state.chipCount}
          status={this.state.status}
          betSize={this.state.betSize}
          placeBet={this.startTimer}
          value={response}
          time={this.state.currentTime}
        />
      </div>
    );
  }
}

export default App;
