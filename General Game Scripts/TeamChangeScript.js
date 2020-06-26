let team1 = new Team("Team1","#ff0000")
let team2 = new Team("Team2","#ffffff")

Game.newTeam(team1)
Game.newTeam(team2)

Game.on("playerJoin", (player) => {
    player.setTeam(team2)

player.on("initialSpawn", () => {
    player.setTeam(team2)
})
})

Game.command("team1", (caller) => {
caller.setTeam(team1)
caller.centerPrint("You are now in team1!",10)
})

Game.command("team2", (caller) => {
caller.setTeam(team2)
caller.centerPrint("You are now in team2!",10)
})
