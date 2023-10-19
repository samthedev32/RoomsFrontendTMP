import * as express from 'express';
import * as fs from "fs"
import * as logger from "./logger.js"
import { Rooms } from './index.js';
import { Room } from './room.js';

const loaded = []

const redirects = new Map<string, string>()

const accessibleFiles = {
    "/web" : "pages/chat.html",
    "/favicon.ico" : "images/favicon.ico",
    "/saws" : "pages/secret.html",
    "/images/aws-Logo.png" : "images/aws-Logo.png",
    "/debug" : "pages/debug.html" // TODO: REMOVE THIS WHEN IN PRODUCTION
}

export function get(req : express.Request, res : express.Response){
    logger.Log("Get request made", ["From ip: " + req.ip, "to: " + req.path])

    // if the path would redirect then redirects
    if(redirects.has(req.path)){
        res.write("<Script>window.location.replace(window.location.origin + '" + redirects.get(req.path) +"')</Script>")
        res.end()
        return
    }

    // checks if the page is accessible and what file to send then sends that file
    else if(accessibleFiles[req.path] != undefined){
        sendFile(accessibleFiles[req.path], req, res, false)
        return
    }

    // sends all the messages looks like this /room/xxxxxxxx
    else if(req.path.substring(0, 6) == "/room/" && req.path.length == 14){


            if (Rooms.has(req.path.substring(6)) == false){
                res.write("null")
                res.end()
                return
            }

            res.write(JSON.stringify(Rooms.get(req.path.substring(6))))
            res.end()
            return
    }

    // sends 404 if the page is not found
    sendFile("pages/404.html", req, res, false)
    return
}

export function started(){
    logger.Log("Server started", [])
}




function sendFile( path : string, req : express.Request, res : express.Response, stayLoaded : boolean = true ) : void{

    //checks if the path they are trying to send has already been loaded
    if(loaded[path] && stayLoaded){
        res.write(loaded[path])
        res.end()
        return
    }

    // reads and sends a file
    fs.readFile(path, (err, data) =>{

        //if no error is encountered then sends the file and loads it 
        if(err === null){
            loaded[path] = data
            res.write(data)
            res.end()
            return  
        }

        else{
            logger.ErrorHappened(["An error accured while trying to read file", "the error happened when ip: " + req.ip, "Made " + req.method + " request to: " + req.path,"error: ", err])
            return
        }
    })
}


// handles redirects

export function initializeRedirects(toInitialize : redirect[]) : void{
    toInitialize.forEach(redirect => {
        redirect.from.forEach(from => {
            redirects.set(from, redirect.to)
        })
    });
}

export class redirect{
    from : string[]
    to : string

    constructor(tFrom : string[], tTo : string){
        this.from = tFrom
        this.to = tTo
    }
}