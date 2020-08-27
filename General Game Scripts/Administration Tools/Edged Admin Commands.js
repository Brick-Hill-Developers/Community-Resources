const Ver = "V1.4.2.x"
const Developer = "Edge, Dragonian and Talveka"


// ------------------ SETTINGS -------------//

const Admins = ["Edge.", "simulated_1", "Player1"] // Put here Mafia bosses
const BannedUsers = [] // Put here dummy people
const IPBANS = [] // Put here IP's that you know are spicy af
const SAFEIPS = ["127.0.0.1"] // Put here Ip's that are safe form the IPBan command.
const Message = "This game uses Edged's Administration Utilities."
Game.MOTD = Message
// *--------------------- ON / OFF SETTINGS ----------------------* //
const AntiBot = false // Set this to true if you want to protect your game from bottings.
const ChatLogs = true
const ChatToConsole = true
const Debug = true
const Executor = false
const Time = 10
const Extensions = true
var TypeOfPrint = "bottomPrint"
// Messages Array && MaxEvenListeners
const MessageLog = [];
Game.setMaxListeners(50)
if (Extensions === true){
    console.log("Importing extensions...")
    require("./extensions")
}
if (ChatLogs === true) {
    Game.on("playerJoin", (player) => {
        player.on("chatted", (message) => {
            MessageLog.push(`${player.username}: ${message}`)
            if (ChatToConsole === true) { console.log(MessageLog) }
            var filename = 'messagelog.txt';
            var str = JSON.stringify(MessageLog, null, 4);

            fs.writeFile(filename, str, function (err) {
                if (err) {
                    console.log(err)
                } else {
                }
            });
        })
    })
}

// mAKING THE VALIDATOR FUNCTION FOR IS ADMIN
function isAdmin(p, args, next) {
    if (Admins.includes(p.username)) return next(p, args)

    p.topPrint(`${p.username} you're not an administrator!`, 5)
}




// Validating the executor for extra security
//
// yes


function isExEnabled(p, args, next) {
    if (Executor === true) return next(p, args)
    p.topPrint("Script Execution is disabled. Change 'Executor' to true!");

}


// unipban 
Game.command("execute", isAdmin, (p, args) => {
    child_process.exec(`node -e "${args}`)

})

// Let me help you.
let Help = `Help Commands!\n
/ban Player || Bans the user from the server.\n
/kick Player || Kicks the player from the server.\n
/to Player || Teleports yourself to the player position\n
\n
Made by Edged. More Coming Soon.
`

// Function to get player from the player array. Useful and made by Cheats (thx man)
function getPlayer(name) {
    for (let player of Game.players) {
        if (player.username.toLowerCase().indexOf(String(name).toLowerCase()) == 0) {
            const victim = Array.from(Game.players).find(p => p.username === player.username)
            return victim
        }
    }
}


// Function to easily remove values from arrays
function removeA(arr) {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}





// First Ban check, making sure the user is not on the IPBAN list, if he is he gets kicked.

Game.on("playerJoin", (p) => {
    if (IPBANS.includes(p.socket.IPV4)) return p.kick("You are IP banned")
})


// IPban command, made by Enderspearl, adapted for Eded admin commands.
Game.command("ipban", (p, m) => {
    if (Admins.includes(p.username)) {
        const v = getPlayer(m);
        if (!v) return p.prompt("Player not found!");

        if (v.socket.IPV4 == p.socket.IPV4 || SAFEIPS.includes(v.socket.IPV4)) return p.message("Unable to IP ban. This IP is in the SAFEIPS array, or is your own IP.")

        IPBANS.push(v.socket.IPV4);
        BannedUsers.push(v.username)
        console.log(`You ip banned ${v.socket.IPV4}.`)
        for (let player of Game.players) {
            if (IPBANS.includes(player.socket.IPV4)) player.kick("You have been IP banned.")
        }
    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})
// unipban 
Game.command("unipban", isAdmin, (p, ip) => {

    if (IPBANS.includes(ip)) {
        IPBANS.splice(IPBANS.indexOf(ip), 1)
        console.log(`Unbanned IP: ${ip}`)
    }

})
// Setavatar command.

Game.command("setavatar", isAdmin, (p, m) => {
    p.setAvatar(m)
    p.topPrint(`User: ${p.username} avatar is now ${m}`)

})

// Credits and information.
Game.command("info", (p, m) => {
    p.setAvatar(m)
    p.prompt(`Current Admin Version: ${Ver}\nDeveloper: ${Developer}\nThanks for using Edged Admin Commands!`)

})


// Change User size
Game.command("size", isAdmin, (caller, args) => {
    args = args.split(" ")
    let P = getPlayer(args[0])
    console.log(caller.username + " is changing " + args[0] + " size to " + args[1])
    return P.setScale(new Vector3(P.scale.x = args[1], P.scale.y = args[1], P.scale.z = args[1]))

})
Game.command("hat1", isAdmin, (caller, args) => {
    args = args.split(" ")
    let P = getPlayer(args[0])
    let outfit = new Outfit(P)
        .hat1(args[1])
        .set()



})

Game.command("hat2", isAdmin, (caller, args) => {
    args = args.split(" ")
    let P = getPlayer(args[0])
    let outfit = new Outfit(P)
        .hat2(args[1])
        .set()



})

Game.command("hat3", isAdmin, (caller, args) => {
    args = args.split(" ")
    let P = getPlayer(args[0])
    let outfit = new Outfit(P)
        .hat3(args[1])
        .set()



})


Game.command("fov", isAdmin, (caller, args) => {
    args = args.split(" ")
    let P = getPlayer(args[0])
    caller.topPrint(`Player ${P.username} Fov has been set to ${args[1]}`)
    return P.setCameraFOV(args[1])

})

Game.command("jumpforce", isAdmin, (caller, args) => {
    args = args.split(" ")
    let P = getPlayer(args[0])
    caller.topPrint(`Player ${P.username} jumpforce is now ${P.jumpPower}`, 3)
    return P.setJumpPower(args[1])

})
// /tool PlayerName ToolName ToolID
Game.command("tool", isAdmin, (caller, args) => {
    args = args.split(" ")
    let P = getPlayer(args[0])
    let tool = new Tool(args[1])
    tool.model = args[2]
    caller.topPrint(`Tool ${args[1]} with the id ${args[2]} created.`)
    return P.equipTool(tool)

})

Game.command("speed", isAdmin, (caller, args) => {

    args = args.split(" ")
    let P = getPlayer(args[0])
    if (P == undefined || P === " ") return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`, 3)
    caller.topPrint(`Player ${P.username} speed set to ${args[1]}`)
    console.log(caller.username + " is changing " + args[0] + " speed to " + args[1])
    return P.setSpeed(args[1])

})

// Help information

// kick a user, soontm will use getplayer() instead of the old dragonian method

Game.command("kick", isAdmin, (caller, args) => {
    let P = getPlayer(args)
    if (P == undefined || P === " ") return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`, 3)
    caller.topPrint(`${P.username} was kicked!`)
    return P.kick(`You've been kicked by ${caller.username}`)

})

// Spectate Command
Game.command("spectate", isAdmin, (caller, args) => {
    let P = getPlayer(args)
    if (P == undefined || P === " ") return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`, 3)
    console.log(`${caller.username} is spectacting ${P.username}`)
    caller.topPrint(`You're now spectating ${P.username} to return do /unspectate`)
    return caller.setCameraObject(P)
})

// Unespectate command
Game.command("unspectate", isAdmin, (caller, args) => {
    let P = getPlayer(args)
    if (P == undefined || P === " ") return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`, 3)
    console.log(`${caller.username} stopped spectating`)
    caller.topPrint(`You've stopped spectating.`)

    return caller.setCameraObject(caller)
})

// Help Print
Game.command("commands", isAdmin, (caller, args) => {
    caller.prompt(Help)
})

// Change values from the score
Game.command("change", isAdmin, (caller, args) => {
    args = args.split(" ")
    let P = getPlayer(args[0])
    if (P == undefined || P === " ") return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`, 3)

    console.log(caller.username + " is changing " + args[0] + " Score to " + args[1])
    return P.setScore(args[1])


})

// Shitty prompt to everyone idk why i made this
Game.command("alertall", isAdmin, (caller, args) => {
    for (let P of Game.players) {
        P.prompt(args)
    }

})

// Kill command with support for "kill all" argument.
Game.command("kill", isAdmin, (caller, args) => {
    args = args.split(" ")
    let P = getPlayer(args[0])
    if (P == undefined || P === " ") return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`, 3)

    if (args[0] === "all") {
        for (let player of Game.players) {
            player.setHealth(0)
            console.log(player.username + " has died")
        }
    } else return P.setHealth(0)


})


// Admin command, simply push the user to admin.

Game.command("admin", isAdmin, (caller, args) => {
    if (caller.username === args) return caller.topPrint("You cant admin yourself again lol.")
    let P = getPlayer(args)
    if (P == undefined || P === " ") return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`, 3)

    caller.topPrint(`User ${P.username} is now an Administrator.`, 5)
    P.topPrint(`${caller.username} gave you Administrator privileges`, 5)
    return Admins.push(P.username)

})

// Unadmin command simply takes the value off the array.
Game.command("unadmin", isAdmin, (caller, args) => {
    if (caller.username === args) return caller.topPrint("You cant unadmin yourself.")
    let P = getPlayer(args)
    if (P == undefined || P === " ") return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`, 3)

    caller.topPrint(`User ${P.username} is no longer an administrator.`, 5)
    P.topPrint(`${caller.username} took away your admin privileges.`, 5)
    return Admins.splice(Admins.indexOf(P.username), 1)

})

// TopPrint, CenterPrint and BottomPrint embedded into commands.
Game.command("m", isAdmin, (caller, args) => {
    Game.topPrintAll(`${args}`, 5)

})
Game.command("n", isAdmin, (caller, args) => {
    Game.centerPrintAll(`${args}`, 5)

})

Game.command("b", isAdmin, (caller, args) => {
    Game.bottomPrintAll(`${args}`, 5)

})


// Fun command to skydive lol

Game.command("skydive", isAdmin, (caller, args) => {
    let P = getPlayer(args);
    if (P == undefined || P === " ") return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`, 3)

    if (args === "all") {
        for (let P of Game.players) {
            P.setPosition(new Vector3(P.position.x, P.position.y, P.position.z + 100))

        }
    }
    caller.topPrint(`Skydiving`, 3);
    CallerPos = caller.position;
    P.setPosition(new Vector3(P.position.x, P.position.y, P.position.z + 100))

})



// Teleport Command

Game.command("to", isAdmin, (caller, args) => {
    let P = getPlayer(args);
    if (P == undefined || P == " ") return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`, 3) //If the user doesnt exist....
    caller.topPrint(`Teleporting to ${P.username}`, 3);
    CallerPos = caller.position;
    caller.setPosition(new Vector3(P.position.x, P.position.y, P.position.z))

})



// Bring the user command
Game.command("bring", isAdmin, (caller, args) => {
    let CallerPos = caller.position;
    let P = getPlayer(args);
    if (P == undefined || P === " ") return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`, 3)
    if (P.username == caller.username) return caller.topPrint("You cant Bring yourself!", 3)
    caller.topPrint(`Bringing Player ${P.username}`, 5)
    P.setPosition(new Vector3(CallerPos.x, CallerPos.y, CallerPos.z))


})
Game.command("tp", isAdmin, (caller, args) => {
    let CallerPos = caller.position;
    args = args.split(" ", 2)
    if (args[0] === "all") {
        for (Pl of Game.players) {
            let P2 = getPlayer(args[1])
            Pl.setPosition(new Vector3(P2.position.x, P2.position.y, P2.position.z))
        }
    }
    else {
        let P = getPlayer(args[0])
        let P2 = getPlayer(args[1])
        if (P == undefined || P == " ") return caller.bottomPrint("Player not found", 3)
        P.setPosition(P2.position.x, P2.position.y, P2.position.z)
    }


})




// Ban the user, it pushes the username of the user to the banned list.
Game.command("ban", isAdmin, (caller, args) => {

    args = args.split(" ", 2)
    let P = getPlayer(args[0])
    if (P == undefined || P == " ") return caller.bottomPrint("Player not found", 3)

    if (caller.username == P.username) {
        return caller.topPrint("You cant ban yourself!")
    } else {
        caller.topPrint(`Banning user ${P.username}...`, 3)
        BannedUsers.push(P.username)
        P.kick(`You've been banned by ${caller.username}\nReason of Ban: ${args[1]} `)
    }
})
// Mute command, mute those who should shut up
Game.command("mute", isAdmin, (caller, args) => {
    let VICTIM = getPlayer(args)
    if (VICTIM == undefined || VICTIM == " ") return caller.bottomPrint("Player not found", 3)

    VICTIM.muted = true
    return caller.topPrint(`Player ${VICTIM.username} is now muted.`)


})
// Unmute the user
Game.command("unmute", isAdmin, (caller, args) => {
    let VICTIM = getPlayer(args)
    if (VICTIM == undefined || VICTIM == " ") return caller.bottomPrint("Player not found", 3)

    VICTIM.muted = false
    return caller.topPrint(`Player ${VICTIM.username} is now unmuted.`)


})

// Unban someone
Game.command("unban", isAdmin, (caller, args) => {
    if (BannedUsers.includes(args)) {
        removeA(BannedUsers, args)
        return caller.topPrint(`User ${args} is now Unbanned!`, 5)

    }

})



// shut down the game. Somehow it doesnt work wtf
Game.command("shutdown", isAdmin, (caller, args) => {

    return Game.shutdown()
})



// Ban filters
Game.on("playerJoin", (player) => {
    if (BannedUsers.includes(player.username)) {
        return player.kick("You're banned")
    }

    let sameIPs = Game.players.filter(p => p.socket.IPV4 === player.socket.IPV4)

    if (sameIPs.length > 1 && AntiBot == true) {
        return player.kick("Your player IP is doubled. Please leave the game and rejoin in one single account.")
    }

})


Game.on("playerJoin", (player) => {

    if (Admins.includes(player.username)) {
        player.on("avatarLoaded", () => {
            switch (TypeOfPrint) {
                case "topPrint":
                    player.topPrint(`Welcome ${player.username} you're an administrator.`, Time)
                    break;
                case "bottomPrint":
                    player.bottomPrint(`Welcome ${player.username} you're an administrator.`, Time)
                    break;
                case "centerPrint":
                    player.centerPrint(`Welcome ${Player.username} You're an administrator.`,Time)
                    break;
                default:
                    console.log("Invalid Configuration for PrintTypes Detected. Using Defualt (TopPrint)")
                    TypeOfPrint = "topPrint"
            }


        })
}})


        console.log(`\x1b[31mThanks for using Edged Admin Commands!\n\x1b[37m//Current Version: ${Ver}//\n\x1b[46m\x1b[44mSettings:\x1b[44m\nAntiBotting: ${AntiBot}\nChat Logging: ${ChatLogs}\nChat to console: ${ChatToConsole}\nServerProfiler: ${Debug}\nAdministrators: ${Admins}\x1b[0m`)
