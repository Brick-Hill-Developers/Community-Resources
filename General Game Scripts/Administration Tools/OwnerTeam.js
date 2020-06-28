Game.assignRandomTeam = false // so teams arent assigned to random people
var teamAlreadyMade = false
var ownerTeam = new Team("Owner","00ccff")
var playerTeam = new Team("Players","ffffff")
Game.newTeam(playerTeam)

Game.on("playerJoin", (player) => {
    player.on("initialSpawn", () => {
        if (player.username === "Your Username") {
            checkTeamAlreadyMade()
            player.setTeam(ownerTeam)
        } else {
            player.setTeam(playerTeam)
        }
    })
})

function checkTeamAlreadyMade() {
    if (teamAlreadyMade == false) {
        Game.newTeam(ownerTeam)
        teamAlreadyMade = true
    }
}
