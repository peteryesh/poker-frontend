import { Suit } from './Suit';

export interface Card {
    value: number,
    suit: Suit,
    revealed: boolean
}
