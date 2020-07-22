const adminUserIds = [1, 2760] // Your user id's

const mapDirectory = "./maps/"

function isAdmin(p, args, next) {
    if (adminUserIds.includes(p.userId)) 
        return next(p, args)
}

Game.command("selectmap", isAdmin, (p, args) => {
    Game.loadBrk(mapDirectory + args)
        .then((map) => {
            Game.setEnvironment(map.environment)
            Game.players.forEach((player) => {
                player.respawn()
            })
        })
        .catch((err) => {
            console.log(err)
            p.message("Failure loading map.")
        })
})

