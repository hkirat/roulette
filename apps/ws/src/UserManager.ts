import { WebSocket } from "ws"
import { User } from "./User";
import { Number } from "@repo/common/types";

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

    addUser(ws: WebSocket, name: string) {
        let id = ID;
        this._users[id] = new User(
            id,
            name,
            ws,
        );

        ws.on("close", () => this.removeUser(id))
        ID++;
    }

    removeUser(id: number) {
        delete this._users[id];
    }

    /*
     * Broadcast messsage to everyone who has joined
     * If userId is an input, dont send them the message
     */
    // broadcast(message: OutgoingMessages, userId?: number) {
    //     this._users.forEach(({id, ws}) => {
    //         if (userId !== id) {
    //             ws.send(JSON.stringify(message));
    //         }
    //     })
    // }

    won(id: number, amount: number, output: Number) {
       this._users[id]?.won(amount, output);
    }

    lost(id: number, amount: number, output: Number) {
        this._users[id]?.lost(amount, output);
    }

}