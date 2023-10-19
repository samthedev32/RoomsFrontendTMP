import { error } from "console";
import { user } from "./user.js";
import { Room } from "./room.js";

export class Message { 
    public data : string;

    public author : user;

    public room : Room

    public date : number;

    constructor (tData : string, tAuthor : user, tRoom : Room, tDate : number){
        // if id isnt lenght 8
        if(tRoom.id.length != 8){
            throw error
        }

        this.data = tData
        this.author = tAuthor
        this.room = tRoom
        this.date = tDate
    }
}