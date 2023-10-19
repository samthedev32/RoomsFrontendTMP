import * as ws from "ws"
import { Message } from "./messages.js"
import { Room } from "./room.js"
import { connection} from './websocket.js';
import  express  from "express";
import { get, initializeRedirects, redirect, started } from "./express.js";

// PORTS the server uses
const WebSocketPort = 443
const Port = 80

// initiates the servers
const app = express()
const wss = new ws.WebSocketServer({port: WebSocketPort})

const Rooms = new Map<string, Room>()
Rooms.set("00000000", new Room("00000000", "Main"))

// redirects
initializeRedirects([
    new redirect(["/", "/chat"], "/web"),
    new redirect(["/sam", "/aws"], "/saws")
]);

//websocket
wss.on("connection", connection)

//express server
app.get("*", get)
app.listen(Port, started)


export {Rooms, wss, app}