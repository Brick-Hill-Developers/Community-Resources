{// READ BEFORE USING
// For users that share the same folder for all games: It is recommended that you make a separate folder for games with this script if you use the same folder for your games
// On your install folder go to \node_modules\node-hill\dist\class
// Open brick.js with your favorite file manipulator made for editing text files
// Press CTRL + F to find this text "Brick has already been destroyed."
// Comment or delete the line
// Save the file
// Done! Now start the server or change this script's settings
}

{// Created by SmartLion
// No credit is required
// Feel free to distribute!

// SemVer 3.0.1
}
{
// Settings
    {// Core
    defaultStreamingDistance = 100 ///// The default streaming distance bricks will stream
    excludeBrickName = "dns" ///// Bricks will always be visible if they are named that
    }
    {// Commands
    allowStreamCommand = false ///// Should players be allowed to change the max streaming distance with /stream? Note: Setting to false will disable anything related to the command!
        commandStreamChangeMinimum = 75 ///// The minimum distance players can set using /stream
        commandStreamChangeMaxmium = 350 ///// The maximum distance players can set using /stream
        announceCommandUsage = true ///// If true, send messages about the /stream command to players that joined
            announceCommandUsageText = `\\c4[BRICK-STREAM]: \\c7Use "/stream (${commandStreamChangeMinimum}-${commandStreamChangeMaxmium})" to change the streaming distance!` ///// Message for announceCommandUsage if announceCommandUsage is true
    }
}

// Do not change anything beyond this point unless you know what you're doing
if (allowStreamCommand == true) {
Game.command("stream", (p, msg) => {
    if (isNaN(msg) == false) {
        if (msg < commandStreamChangeMinimum) msg = commandStreamChangeMinimum
        if (commandStreamChangeMaxmium < msg) msg = commandStreamChangeMaxmium
        p.streamingSetting = msg
        p.message(`\\c4[BRICK-STREAM]: \\c7Streaming distance set to ${msg}. Please wait if game is frozen`)
    } else {
        p.message(`\\c4[BRICK-STREAM]: \\c7"/stream (${commandStreamChangeMinimum} to ${commandStreamChangeMaxmium})" to set max streaming distance`)
        p.message(`\\c4[BRICK-STREAM]: \\c7"/stream" to see current stream distance`)
        p.message(`\\c4[BRICK-STREAM]: \\c7Streaming distance is currently at ${p.streamingSetting}`)
    }
})}

Game.sendBricks = false
Game.on("playerJoin", (p) => {
    p.centerPrint("\\c4[BRICK-STREAM]: \\c7Game is loading, please wait.",2)
    p.brickArray = []
    if (allowStreamCommand == true) {
    if (announceCommandUsage == true) {
        p.message(announceCommandUsageText)
    }}
    p.on("initialSpawn", () => {
        p.streamingSetting = defaultStreamingDistance
        p.setInterval(() => {
            if (p.brickArray.length > 0) {
                p.loadBricks(p.brickArray)
                p.brickArray = []
        }},500)
        world.bricks.forEach((brick) => {
            // "Clone" the brick
            const localBrick = new Brick(brick.position, brick.scale, brick.color)
            localBrick.shape = brick.shape
            localBrick.lightEnabled = brick.lightEnabled
            localBrick.lightRange = brick.lightRange
            localBrick.visibility = brick.visibility
            localBrick.collision = brick.collision
            localBrick.rotation = brick.rotation

            let brickloadstate = 0

            if (brick.name == excludeBrickName) return p.newBrick(localBrick)
            p.setInterval(() => {
                if (Game.pointDistance3D(localBrick.position, p.position) < p.streamingSetting) {
                    if (brickloadstate == 0) {
                        brickloadstate = 1
                        p.brickArray.push(localBrick)
                    }
                } else {
                    if (brickloadstate == 1) {
                        brickloadstate = 0
                        localBrick.destroy()
                    }
                }
            }, 1000)
        })
    })
})
