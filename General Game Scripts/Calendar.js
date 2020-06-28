// DATASYSTEM DONT TOUCH UNLESS YOU KNOW WHAT YOU'RE DOING
// REQUIRES ENMAP TO BEI NSTALLED (visit the enmap site for a tutorial) AND BE ADDED TO THE SANDBOX VM (in start.js)

const enmap_db = new Enmap({
    name: "playerlevelstesting",
    autoFetch: true,
    fetchAll: false
})

function getPlayerPlaytime(p) {
    const key = `${p.userId}-data`
    let data = enmap_db.ensure(key, {"score": 1})
    return data.score
}

function updatePlaytime(p) {
    const key = `${p.userId}-data`
    enmap_db.inc(key, "score")
}

// end of datasystem

let day = 1
let minutesaday = 20
let currentminutes = 0

function showDate(){
	Game.bottomPrintAll("2025/8/"+day,100)
	Game.topPrintAll("Lore: https://www.brick-hill.com/forum/thread/625620/",100)
}

function recalculateLevelAndShowDate(player,type){
	let playtime = getPlayerPlaytime(player)
	let playtimebefore = playtime - 1
	let playtimedivided = playtime / 20
	let playtimedividedbefore = playtimebefore / 20
	let levelafter = Math.floor(playtimedivided + 1)
	let levelbefore = Math.floor(playtimedividedbefore + 1)
	if(levelafter > levelbefore){
		if(type == "ingame"){
			player.centerPrint("You leveled up! Lvl."+ levelbefore +" -> Lvl."+ levelafter,10)
			console.log("Player "+ player.username +" leveled up")
		}
	}
	let forthepercentagecounter = playtimedivided - Math.floor(playtimedivided)
	let forthepercentagecounter2 = forthepercentagecounter * 100
	let percentageToNextLevel = Math.round(forthepercentagecounter2)
	
	//125.5 125  
	
	Game.bottomPrintAll("Date: 2025/8/"+ day +" | Level "+ levelafter +" "+ percentageToNextLevel +"% to the next Level.",100)
	Game.topPrintAll("Lore: https://www.brick-hill.com/forum/thread/625620/",100)
}


async function loop1(){
	setTimeout(loop2,30000)
}

async function loop2(){
	setTimeout(loop2,30000)
	++currentminutes
	if(currentminutes > 19){
		day = day + 1
		currentminutes = 0
		if(day > 31){
			day = 1
		}
	}
	console.log(currentminutes)
	showDate()
	for (let player of Game.players) {
		updatePlaytime(player)
		recalculateLevelAndShowDate(player,"ingame")
	}
}

Game.on("playerJoin",(player) =>{
	showDate()
	recalculateLevelAndShowDate(player,"join")
})

Game.command("playtime", async(caller) => {
	let playtime = await getPlayerPlaytime(caller)
	caller.message("---")
	caller.message("You have been playing for about "+ playtime+" minutes.")
	caller.message("Dates & Levels script by ggnoobgamingdeutsch")
	caller.message("---")
})

loop1()
