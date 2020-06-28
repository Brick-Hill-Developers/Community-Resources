Game.command("infjump", (caller, args) => {
    const player = getPlayer(args)
    if (!player) return
    ToggleInfJump(player)
})

Game.on("initialSpawn", (p) => {
    p.keypress(async (key) => {
        if (key === "space") {
            if (!p.infjump) return
            // adds a brick beneath where the server thinks the player is, teleports the player to where the server thinks the player is (prevents clipping through block)
            let jumpbrick = new Brick(new Vector3(p.position.x - 1, p.position.y - 1, p.position.z - 1), new Vector3(2, 2, 1))
            p.setPosition(p.position)
            jumpbrick.visibility = 0
            Game.newBrick(jumpbrick)
            //waits 250ms (cause latency exists) then deletes the brick
            await sleep(250)
            jumpbrick.destroy()
        }
    })
})

function ToggleInfJump(p) {
    if (p.infjump) {
        p.infjump = false
        return
    }
    p.infjump = true
}

function getPlayer(name) {
    //totally not copied from cheats admin v2 because it works.
    for (let player of Game.players) {
        if (player.username.toLowerCase().indexOf(String(name).toLowerCase()) == 0) {
            const victim = Array.from(Game.players).find(p => p.username === player.username)
            return victim
        }
    }
}
