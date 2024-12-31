import { WebSocket } from "ws"
import { User } from "./User";
import { Number, OutgoingMessages } from "@repo/common/types";
import { GameManager } from "./GameManager";

let ID = 1;

export class UserManager {
    private _users: {[key: string]: User} = {}; 
    private static _instance: UserManager;

    private constructor() {

    }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new UserManager();
        }
        return this._instance;
    }

    addUser(ws: WebSocket, name: string, isAdmin: boolean) {
        let id = ID;
        const user =  new User(
            id,
            name,
            ws,
            isAdmin
        );
        this._users[id] = user;
        user.send({
            type: "current-state",
            state: GameManager.getInstance().state,
        })

        ws.on("close", () => this.removeUser(id))
        ID++;;
    }

    removeUser(id: number) {
        delete this._users[id];
    }

    /*
     * Broadcast messsage to everyone who has joined
     * If userId is an input, dont send them the message
     */
    broadcast(message: OutgoingMessages, id?: number) {
        Object.keys(this._users).forEach((userId) => {
            const user = this._users[userId] as User;
            if (id !== user.id) {
                user.send(message);
            }
        })
    }

    won(id: number, amount: number, output: Number) {
        console.log("won");
       this._users[id]?.won(amount, output);
    }

    lost(id: number, amount: number, output: Number) {
        console.log("lost");
        this._users[id]?.lost(amount, output);
    }

    flush(output: Number) {
        Object.keys(this._users).forEach((userId) => {
            const user = this._users[userId] as User;
            user.flush(output);
        });
    }

}