import * as fs from "fs"

export function ErrorHappened(errors : any[]){
    Log("E R R O R", errors)
}

export function Log(header : string, message : any[] = []) {
    // logs an event

    console.log("")
    console.log("----------- " + header + " ------------")

    // loops over each element of the and prints them
    message.forEach(element => {
        console.log(element)
    });


    if(message.length > 0){
        console.log("----------- " + header + "   E N D ------------")
        console.log("")
    }
}