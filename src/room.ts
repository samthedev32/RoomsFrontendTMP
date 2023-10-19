import { error } from "console";
import { Message } from "./messages.js";

export class Room{
    public name : string

    public messages : Message[]

    public id : string

    constructor (tId : string, tName : string){
        // if the room id isnt 8 lenght 
        if(tId.length != 8){
            throw error
        }

        this.name = tName
        this.id = tId
        this.messages = []
    }

}