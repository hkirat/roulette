import { UserManager } from "./UserManager";
import { Bet, GameState, Number } from "@repo/common/types";

export class GameManager {
    state: GameState = GameState.GameOver;
    bets: Bet[] = [];
    private static _instance: GameManager;
    private _lastWinner: Number = Number.Zero;

    private constructor() {}

    public static getInstance() {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    // end users will call this
    public bet(amount: number, betNumber: Number, id: number): boolean {
        if (this.state === GameState.CanBet) {
            this.bets.push({ id, amount, number: betNumber });
            return true;
        }
        return false
    }

    // admin will call this
    public start() {
        this.state = GameState.CanBet;
        UserManager.getInstance().broadcast({
            type: "start-game",
        });
    }

    stopBets() {
        this.state = GameState.CantBet;
        UserManager.getInstance().broadcast({
            type: "stop-bets",
        });
    }

    public end(output: Number) {
        this._lastWinner = output;
        console.log(this.bets);
        this.bets.forEach(bet => {
            if (bet.number === output) {
                UserManager.getInstance().won(bet.id, bet.amount, output);
            } else {
                UserManager.getInstance().lost(bet.id, bet.amount, output);
            }
        });

        this.state = GameState.GameOver;
        this._lastWinner = output;
        UserManager.getInstance().flush(output);
    }

}