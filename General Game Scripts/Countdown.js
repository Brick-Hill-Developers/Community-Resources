async function Countdown(sec, p){
    let VAR = sec
        
        for (let i = 0; i < VAR; i++) {
            player.topPrint(`Game starts in ${VAR - i} seconds.`)
            console.log(VAR)
            console.log(i)
            await sleep(1000)
            if (i == 9) {
                player.centerPrint("Game has started", 2)
            }
}
       
