import React, { Component } from 'react';
import { Suit } from '../types/Suit';

const PlayingCard = (props) => {
    const {value, suit, revealed} = props.card;
    return (
        <div>
        <p>Card</p>
        <div>value: {value}</div>
        <div>suit: {suit}</div>
        <div>revealed: {revealed}</div>
        </div>
    ) 
}

export default PlayingCard;