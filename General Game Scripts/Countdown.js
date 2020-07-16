Game.on("playerJoin", (player) => {
    player.on("initialSpawn", async() => {
        VAR = 10;
        for (let i = 0; i < VAR; i++) {
            player.topPrint(`\c4Game Starts in  ${VAR - i} seconds.`);
            console.log(VAR);
            console.log(i);
            await sleep(1000)
        i2 = i+1;
        if (i2 == VAR){
            player.centerPrint("Game has started!!!", 2)
        }
    }
    })
 })
