import { WebSocket, getMaxListeners } from "ws";
import { COINS, GameState, IncomingMessages, Number, OutgoingMessages } from "@repo/common/types";
import { GameManager } from "./GameManager";
const MULTIPLIER = 17;

export class User {
    id: number;
    name: string;
    balance: number;
    locked: number;
    ws: WebSocket;
    isAdmin: boolean
    lastWon: number;

    constructor(id: number, name: string, ws: WebSocket, isAdmin: boolean) {
        this.id = id;
        this.name = name;
        this.balance = 2500;
        this.ws = ws;
        this.locked = 0;
        this.isAdmin = isAdmin;
        this.initHandlers()
        this.lastWon = 0;
    }

    initHandlers() {
        this.ws.on("message", (data: string) => {
            try {
                const message: IncomingMessages = JSON.parse(data);
                console.log(message);
                if (message.type === "bet") {
                    console.log("user bet")
                    this.bet(message.clientId, message.amount, message.number);
                }

                if (this.isAdmin && message.type === "start-game") {
                    console.log("start game")
                    if (GameManager.getInstance().state === GameState.GameOver) {
                        GameManager.getInstance().start();
                    }
                }

                if (this.isAdmin && message.type === "end-game") {
                    console.log("end game")
                    if (GameManager.getInstance().state === GameState.CantBet) {
                        GameManager.getInstance().end(message.output);
                    }
                }

                if (this.isAdmin && message.type === "stop-bets") {
                    console.log("stop bets")
                    if (GameManager.getInstance().state === GameState.CanBet) {
                        GameManager.getInstance().stopBets();
                    }
                }
            } catch (e) {
                console.log(e);
            }

        })
    }

    flush(output: Number) {
        if (this.lastWon === 0) {
            this.send({
                type: "lost",
                balance: this.balance,
                locked: this.locked,
                outcome: output
            })
        } else {
            this.send({
                wonAmount: this.lastWon,
                type: "won",
                balance: this.balance,
                locked: this.locked,
                outcome: output
            })
        }
        this.lastWon = 0;
    }

    bet(clientId: string, amount: COINS, betNumber: Number) {
        if (this.balance < amount) {
            this.send({
                clientId,
                type: "bet-undo",
                amount: amount,
                balance: this.balance,
                locked: this.locked,
            });
            return;
        }
        this.balance -= amount;
        this.locked += amount;
        const response = GameManager.getInstance().bet(amount, betNumber, this.id);
        if (response) {
            this.send({
                clientId,
                type: "bet",
                amount: amount,
                balance: this.balance,
                locked: this.locked,
            });
        } else {
            this.send({
                clientId,
                type: "bet-undo",
                amount: amount,
                balance: this.balance,
                locked: this.locked,
            });
        }
    }

    send(payload: OutgoingMessages) {
        this.ws.send(JSON.stringify(payload));
    }

    won(amount: number, output: Number) {
        const wonAmount = amount * (output === Number.Zero ? MULTIPLIER * 2 : MULTIPLIER);
        this.balance += wonAmount;
        this.locked -= amount;
        this.lastWon += wonAmount;
    }

    lost(amount: number, _output: Number) {
        this.locked -= amount;
    }

}