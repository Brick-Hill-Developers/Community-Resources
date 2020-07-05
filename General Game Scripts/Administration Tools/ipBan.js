const IPBANS=[] //put ips to automatically ipban here
const SAFEIPS=["127.0.0.1"]//put your IP in here. 127.0.0.1 is localhost so keep it there so you don't accidentally ipban yourself.

Game.on("playerJoin", (p) => {
	if (IPBANS.includes(p.socket.IPV4)) return p.kick("You are IP banned")
})

Game.command("ipban", (p,m) => {
    if (p.userId!==YOURUSERID && !Game.local) return// Change YOURUSERID with your user id.
    const v = getPlayer(m);
    if (!v) return;
	
    if (v.socket.IPV4==p.socket.IPV4 || SAFEIPS.includes(v.socket.IPV4)) return p.message("Unable to IP ban. This IP is in the SAFEIPS array, or is your own IP.")

    IPBANS.push(v.socket.IPV4);
    console.log(`You ip banned ${v.socket.IPV4}.`)
    for (let player of Game.players) {
	if (IPBANS.includes(player.socket.IPV4)) player.kick("You have been IP banned.")
    }
})

Game.command("unipban", (p,ip) => {
	if (p.userId!==USERID && !Game.local) return //Change USERID with your respective id.
	if (IPBANS.includes(ip)) {
		IPBANS.splice(IPBANS.indexOf(ip), 1)
		console.log
	}
})

Game.command("listipbans", (p, args) => {
	console.log(IPBANS)
})


//copied from cheats commands v2 because it works
function getPlayer(name) {
    for (let player of Game.players) {
        if (player.username.toLowerCase().indexOf(String(name).toLowerCase()) == 0) {
            const victim = Array.from(Game.players).find(p => p.username === player.username)
            return victim
        }
    }
}
