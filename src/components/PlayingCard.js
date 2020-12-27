import React, { Component } from 'react';
import { Suit } from '../types/Suit';

const PlayingCard = (props) => {
    const {value, suit, revealed} = props;
    <div>
        <p>Card</p>
        <p>value: {value}</p>
        <p>suit: {suit}</p>
        <p>revealed: {revealed}</p>
    </div>
}

export default Card;