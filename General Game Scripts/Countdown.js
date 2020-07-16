Game.on("playerJoin", (player) => {
    player.on("initialSpawn", async() => {
        VAR = 10;
        i2= 0;
        for (let i = 0; i < VAR; i++) {
            player.topPrint(`\c4Game Starts in  ${VAR - i} seconds.`);
            console.log(VAR);
            console.log(i);
            await sleep(1000)
        
        if (i == 9){
            player.centerPrint("Game has started!!!", 2)
        }
    }
    })
 })
