// Anti-AFK - Make AFKers "hoes mad" (such as "isaac hymer halo account" and others)

/*
   {
     afkTime: 2, // *Minutes* left to get kicked.
     message: "You've been away for 2 minutes", // Message for AFKers.
     autoAway: true // It will reset the timer when player touches keys.
   } 
*/

// player.away - This will be useful to stop the timer when it sets to false.
// player.awayTime - How much their timer left to get kicked.

if (!Game.serverSettings.antiafk) return;

const antiafkConfig = Game.serverSettings.antiafk;
const antiafk = {};
antiafk.afkTime = antiafkConfig.afkTime || 3;
antiafk.message = antiafkConfig.message || "You've been away.";
antiafk.autoAway = antiafkConfig.autoAway || true;

antiafk.tick = function() {
    for (let player of Game.players) {
        if (player.away) {
            player.awayTime -= 1;
            // console.log(player.awayTime);
            if (player.awayTime < 1)
                player.kick(antiafk.message);
        }
    }
};

Game.on("playerJoin", (player) => {
    player.on("initialSpawn", () => {
        player.away = true;
        player.awayTime = antiafk.afkTime * 60;
    });

    if (antiafk.autoAway) {
        player.keypress(async() => {
            player.awayTime = antiafk.afkTime * 60;
        });
    }
});

antiafk.tickInterval = setInterval(antiafk.tick, 1000);
