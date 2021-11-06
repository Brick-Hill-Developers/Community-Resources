/**
 * 
 * @deprecated This is deprecated.
 */

let position = new Vector3(0,0,0)
let scale = new Vector3(1,1,1)

function message(params) {
    console.log(params)
}

//

function none() {
    //console.log("Funct!")
    return
}

function tru(e) {
    return true
}

function fals(e) {
    return false
}

pCommander = {
    SL: true, // userscript: Check if a player is actually the server issuing the command

    admin: true,
    authenticated: true,
    muted: false,
    userId: 1,
    netId: -1,
    username: "Server",
    sppech: "",
    position: position,
    speed: 4,
    jumpPower: 5,
    scale: scale,
    destroyed: false,
    alive: true,
    score: 0,

    message: message,
    bottomPrint: message,
    topPrint: message,
    centerPrint: message,
    prompt: message,

    ownsAsset: tru,
    setPosition: none,
    setScale: none,
    setSpeed: none,
    setJumpPower: none,
    kill: none,
    kick: none,
    addTool: none,
    setScore: none,
    setAvatar: none,
    getBlockedPlayers: none


}

let serverline = getModule('serverline')

serverline.init()
serverline.setPrompt('> ')
 
serverline.on('line', (msg) => {
    try {
        msg = "/" + msg
        let cmd = msg.split(msg.charAt(0))[1].split(" ")[0] // This is only an temporary solution I swore!
        console.log(cmd)


        let args = msg.split(msg.charAt(0))[1].split(/ (.+)/)[1]
        if (args === undefined) args = cmd
        console.log(args)
        Game.emit('command', cmd, pCommander, args)

    } catch (err) {
        console.error(err)
    }
})

Game.command("say", (caller, args) => {
    if (caller.SL) {
        Game.emit("chatted",caller,args)
        Game.emit("chat",caller,args)
    }
})