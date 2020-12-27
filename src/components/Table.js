import React, { Component } from 'react';
// import { PokerPlayer } from '../types/PokerPlayer';

class Table extends Component {
    constructor() {
        super();
        this.state = {
            tableCards: [],
            opponents: [],
            pot: 0,
            time: 45
        }
    }
    render() {
        return (
            <div>
                table
            </div>
        )
    }
}

export default Table;