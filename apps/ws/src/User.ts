import { WebSocket } from "ws";
import { COINS } from "./types";

export class User {
    id: number;
    name: string;
    balance: number;
    locked: number;
    ws: WebSocket;

    constructor(id: number, name: string, ws: WebSocket) {
        this.id = id;
        this.name = name;
        this.balance = 2500;
        this.ws = ws;
    }

    bet(amount: COINS) {

    }


}