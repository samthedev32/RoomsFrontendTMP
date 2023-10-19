import * as websocket from "ws"
import { Message } from "./messages.js"
import { Rooms, wss } from "./index.js"
import { Room } from "./room.js"
import * as logger from "./logger.js"

export function connection(ws : websocket.WebSocket){
    logger.Log("Someone connected to the websocket")
    
    
    //on message
    ws.on("message", (data, isBinary) => {
        
        var tMessage : Message
        try {
            tMessage = JSON.parse(data.toString())
            
            // creates the room if a room with that id doesnt exist
            if (!Rooms.has(tMessage.room.id)){
                Rooms.set(tMessage.room.id, new Room(tMessage.room.id, tMessage.data))
                
                logger.Log("Room created", ["someone created a room with id: "+ tMessage.room.id, "and name: " + tMessage.data])
            }
            //if the room exists then sends the message out to every client
            else{
                
                // adds the newly sent message to the messages of that room
                Rooms.get(tMessage.room.id).messages.push(new Message(tMessage.data, tMessage.author, tMessage.room, tMessage.date))
                
                let t = 0
                
                //sending the message to each client connected
                wss.clients.forEach((client) => {
                    
                    if(client.readyState == ws.OPEN){
                        
                        t++
                        
                        var Send = JSON.stringify(Rooms.get(tMessage.room.id).messages[Rooms.get(tMessage.room.id).messages.length - 1 ])
                        
                        client.send(Send)
                    }
                    
                })
                
                //logs message
                logger.Log("Message Receveice", ["The message was: " + tMessage.data, "From user: " + tMessage.author.name + " " + tMessage.author.id, "And was sent out to: " + t + " amount of clients"])
            }

            // if there is an error terminates websocket connection
        } catch (error) {
            ws.terminate()
            
            logger.Log("Bad request")
            return
        }
    })
}