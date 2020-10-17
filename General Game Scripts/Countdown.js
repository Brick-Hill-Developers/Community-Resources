Game.on("playerJoin", (player) => {
    player.on("initialSpawn", async () => {
        let VAR = 10
        
        for (let i = 0; i < VAR; i++) {
            player.topPrint(`Game starts in ${VAR - i} seconds.`)
            console.log(VAR)
            console.log(i)
            await sleep(1000)
            if (i == 9) {
                player.centerPrint("Game has started", 2)
            }
        }
    })
})
