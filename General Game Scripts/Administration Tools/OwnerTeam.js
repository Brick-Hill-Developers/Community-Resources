Game.assignRandomTeam = false // so teams arent assigned to random people
let teamAlreadyMade = false
let ownerTeam = new Team("Owner", "00ccff");
let playerTeam = new Team("Players", "ffffff");

const ownerId = 0; // YOUR ID HERE!

Game.newTeam(playerTeam);
Game.newTeam(ownerTeam);

Game.on("playerJoin", (player) => {

    player.on("initialSpawn", () => {
        if (player.id === ownerId) {
            checkTeamAlreadyMade()
            player.setTeam(ownerTeam);
            return;
        }

        player.setTeam(playerTeam)

    })
})

