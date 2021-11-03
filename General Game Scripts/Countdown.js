async function Countdown(sec, p){
    let countDown = sec;
        
        for (let i = 0; i < countDown; i++) {
            player.topPrint(`Game starts in ${countDown - i} seconds.`)
            await sleep(1000)
            if (i == p) {
                player.centerPrint("Game has started", 2)
            }
}
       
