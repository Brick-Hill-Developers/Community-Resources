Admins = ["Edge.", "simulated_1", "Player1"] // put here random users for admin lol
BannedUsers = []

function getPlayer(name) {
    //totally not copied from cheats admin v2 because it works.
    for (let player of Game.players) {
        if (player.username.toLowerCase().indexOf(String(name).toLowerCase()) == 0) {
            const victim = Array.from(Game.players).find(p => p.username === player.username)
            return victim
        }
    }
}



function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}
// Check if the user is admin

function CheckAdmin(User) {
    if (Admins.includes(User)) {

        console.log(`${User} Is an administrator.`)
        return true;

    }
    else if (!Admins.includes(User)) {
        console.log(`${User} Is not an administrator`)
        return false;
    }

}

CheckAdmin("Talveka")

// Commands:

function Admin(user) {
    Admins.push(user)
}
function UnAdmin(user) {
    removeA(Admins, user)
}



// Kick command

Game.command("kick", (caller, args) => {
    if (Admins.includes(caller.username)) {
        for (let player of Game.players) {
            if (player.username.startsWith(args)) {
                return player.kick(`You were kicked by ${caller.username}`, 5)

            }

        }
    }
    else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})


let Help = `Help Commands!\n
/ban Player || Bans the user from the server.\n
/kick Player || Kicks the player from the server.\n
/to Player || Teleports yourself to the player position\n
\n
Made by Edged. More Coming Soon.
`

// Teleport Command ez ez ez 
Game.command("commands", (caller, args) => {
    if (Admins.includes(caller.username)) {
        caller.message(Help)

    }
})

Game.command("admin", (caller, args) => {
    if (Admin.includes(caller.username)) {
        caller.topPrint(`User ${args} is now an Administrator.`, 5)
        return Admin(args.username)
    }
    else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})
Game.command("unadmin", (caller, args) => {
    if (Admin.includes(caller.username)) {
        caller.topPrint(`User ${args} is no longer an administrator.`, 5)
        return UnAdmin(args.username)
    }
    else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})
Game.command("to", (caller, args) => {
    if (Admins.includes(caller.username)) {
        P = getPlayer(args);
        if (!P) return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`)
        caller.topPrint(`Teleporting to ${P.username}`);
        CallerPos = caller.position;
        caller.setPosition(new Vector3(P.position.x, P.position.y, P.position.z)) //Offsets work for god sake
    }

})

// Ban Command


Game.command("ban", (caller, args) => {
    if (Admins.includes(caller.username)) {
        for (let player of Game.players) {
            if (player.username.startsWith(args)) {

                if (!player) return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`)

                player.kick(`You've been banned by ${caller.username}`)
                caller.topPrint(`Banned user ${player.username}.`, 5)
                return BannedUsers.push(player)

            }

        }
    }
    else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})

Game.command("unban", (caller, args) => {
    if (Admins.includes(caller.username)) {
        if (BannedUsers.includes(args)) {
            removeA(args)
            return caller.topPrint(`User ${args} is now Unbanned!`, 5)

        }
        else return caller.topPrint(`No user with the name ${args} was found. Make sure to type all their name.`)
    }
    else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})


Game.on("playerJoin", (player) => {
    if (BannedUsers.includes(player.username)) {
        return player.kick("You're banned")
    }
})

Game.on("playerJoin", (player) => {
    if (Admins.includes(player.username)) {
        player.on("avatarLoaded", () => {
            return player.topPrint(`Welcome ${player.username} You're an administrator.`, 10)

            // The outfit is now loaded.
        })


    }
})

