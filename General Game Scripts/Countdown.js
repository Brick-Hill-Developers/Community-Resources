Game.on("playerJoin", (player) => {
    player.on("initialSpawn", () => {
        VAR = 50;
        for (let i = 0; i < VAR; i++) {
            p.topPrint(`Game Starts in  ${VAR - i} seconds.`);
            yield sleep(1000);
        } 
    })
 })
