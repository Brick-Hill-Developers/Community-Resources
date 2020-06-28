 /* 
------<=======[ ATERMIS CLAN SYSTEM V1.0 ]=======>------
Programmers: 
	lewd
	SmartLion
	Rares

[HOW TO CONFIGURE]

Set the MoTD:
	Go to line 58, after Game.MOTD, change the string in the quotation marks (""). 
	
Set the TEAM Names & Colour:
	Go to line 64 for the defending team, line 65 for the hostile team. After going to
	the respective line, go to the brackets after new Team & change the team name in the 
	first string (again, in the quotation marks). If you want to change the color get the
	corresponding hexadecimal color code for the team and paste it in the second string,
	after the team name which was defined in the first string.
	
Set up the Terminal location:
	!! IT IS ADVISED YOUR MAP EXISTS BEFOREHAND !! 
	
	Once you have got a location for your terminal in your .brk file in BRICK HILL WORKSHOP, get the terminal 
	brick's location (a vector3) and paste it in the first Vector 3 in line 91.

Set up Group ID Fetching & Moderator Permissions Auto-granting: 
	Go to line 100 then in await player.getRankInGroup() you will have to get your group's 
	ID and paste it in the brackets. This will check if you are in the group on join and
	if you are then it teams you over to defenders. If you  are not in the group, you will join
	hostiles. 
	
	Set up the Mod Auto-granting by going to line 101 and changing the value of minimumModRank to be that of the lowest 
	Rank ID that you wish to be granted Moderator Permissions in-game. 
	
Setting spawnpoints: 
	!! IT IS ADVISED YOUR MAP EXISTS BEFOREHAND !! 

	Because of an issue with spawnPosition due to how this is programmed, you will have to go to line 126 for defenders & go to line 129 for hostiles
	and change the player.setPosition(new Vector3(position)) to that of the spawn point you have set up in your .brk file in BRICK HILL WORKSHOP.

[KNOWN BUGS]

- Sometimes on startup, the moderators will not be automatically set; currently this requires just shutting down and booting up the server until it does
  work. Sorry for the inconvenience!
  
- if a user was created on the day they gained ownership or obtianed the rank that shares the rankId as specified in minimumModRank, they will not be given 
  moderator permissions in game.
  
- Timer will continue even after a team has won.

*/

//---------------------------------------------------------------------------------------------------
// GAME SETTINGS
//---------------------------------------------------------------------------------------------------

Game.assignRandomTeam = false // this will make the teaming over work, do not set this to true or teams WILL break
Game.MOTD = "Welcome To ATERMIS I" //MESSAGE OF THE DAY

//---------------------------------------------------------------------------------------------------
// VARIABLES 
//---------------------------------------------------------------------------------------------------

let defendersteam = new Team("Defenders","#0000ff") // ("First String", "Second String") 
let hostilesteam = new Team("Hostiles","#ff0000")

//---------------------------------------------------------------------------------------------------
// TERMINAL & TIME RELATED
//---------------------------------------------------------------------------------------------------
let officialstatus = false 
let teamholding = "none"
let countdownactive = false 

var counter = 0 
var wincondition = 300 // This is the amount of time the players have to hold the terminal for - change this to configure the terminal
var maximumtime = 1200 // T
var maximumovertime = 600
var overtime = null 

var defendersloop = ""
var hostilesloop = ""

//---------------------------------------------------------------------------------------------------
// MODERATORS 
//---------------------------------------------------------------------------------------------------
var moderator = [335323] // This is an Array. To add Users by hand you will have to separate each UID with a comma.

//---------------------------------------------------------------------------------------------------
// OBJECT CREATION
//---------------------------------------------------------------------------------------------------
let termbrick = new Brick(new Vector3(278,-4,50), new Vector3 (10,10,2), "#ffffff") // (new Vector3(Position), new Vector3 (Size), "HEX Colour Code)

Game.newBrick(termbrick)
Game.newTeam(defendersteam)
Game.newTeam(hostilesteam)

// PLAYER JOIN

Game.on("playerJoin", async(player) => {
	const groupData = await player.getRankInGroup(3564) // change the value in the brackets to YOUR Group's ID
	let minimumModRank = 39 // Change this value to the lowest rank in your group that has moderate group wall permissions - This will give the users permission to officialize raid servers, kick members & team over players.
	console.log(groupData.rank)
	if (groupData) {
		player.setTeam(defendersteam)
	} else {
		player.setTeam(hostilesteam) 
	}
	
	player.on("initialSpawn", () => {
		player.kill()
		createBrick(player) 
		
		if (groupData.rank >= minimumModRank ){
			moderator.push(player.userId)
			console.log(moderator)
			player.message("You are a Moderator! Type /cmds to list the commands!", 5)
		}	
		
		if (officialstatus == false){
			player.bottomPrint("Atermis || UNOFFICAL Raid ||", 10) 
		}
	})
	
	player.on("respawn", async(plr) => {
		if (player.team == defendersteam) {
			player.setPosition(new Vector3(0,60,25)) //defenders team spawn location
		}
		if (player.team == hostilesteam) {
			player.setPosition(new Vector3(0,-60,25)) //hostiles team spawn location
		}
	})
})

//---------------------------------------------------------------------------------------------------
// HITBOX - Thanks SmartLion!
//---------------------------------------------------------------------------------------------------

async function createBrick(p) {
    let brick = new Brick(new Vector3(1, 1, 1), new Vector3(4, 4, 5), "#555555")
	brick.visibility = .1
	
    Game.newBrick(brick)

    await sleep(5000) // packet loss still a thing?
    var lastposition = new Vector3(0,0,0)
    let brickPacket = new PacketBuilder("Brick")
    .write("uint32", brick.netId)
    .write("string", "collide")
    .write("bool", false)

	brickPacket.send(p.socket)
	
    brick.setInterval(() => {
        if (p.destroyed) brick.destroy()
        if (p.position.x !== lastposition.x || p.position.y !== lastposition.y || p.position.z !== lastposition.z) {
            lastposition.x = p.position.x
            lastposition.y = p.position.y
            lastposition.z = p.position.z
            brick.setPosition(new Vector3(p.position.x-2,p.position.y-2,p.position.z))
        }
        if (p.alive == false) {
            brick.setPosition(new Vector3(-999,-999,-999))
        }
    }, 100);
	


    brick.setInterval(() => {
        brickPacket.send(p.socket)
    }, 1000); // de-wackyifyer
}

//---------------------------------------------------------------------------------------------------
// SWORD - Thanks SmartLion! 
//---------------------------------------------------------------------------------------------------
// Settings \\
//---------------------------------------------------------------------------------------------------

swordDamage = 25 // How much damage does the sword deal when clicked?
swordRange = 8 // How far can the sword hit players?
swordModelID = 3441 // The mesh of the sword from the store ID

effectsEnabled = true // Enable or disable particles effects? Note: This will disable all related settings (Disable if your server crashes or lags when this is enabled)
    particleSize = new Vector3(0.5,0.5,0.5) // The size of the particles
    hitParticles = true // If true then particles will emit from damaged players
    redBlood = false // If false then particles will be a random color
    deathExplosion = true // When the player dies they make a big brick explosion

legacyBug = false // Enable the "player can still kill players if dead" bug

//---------------------------------------------------------------------------------------------------

let tool = new Tool("Sword")
tool.model = swordModelID
Game.on("playerJoin", (player) => {
   player.on("initialSpawn", () => {
       player.equipTool(tool)
   })
})
tool.on("activated", (attacker) => {
    if (attacker.alive == false && legacyBug == false) return
    for (let player of Game.players) {
        if (Game.pointDistance3D(attacker.position, player.position) <= swordRange) {
            if (player.username !== attacker.username) {
				if (player.alive == true) { // A check to see if the player is attacking themselfs or their target is already dead
					if (attacker.team == player.team) {
						player.message("You cannot team-kill.")
						return
					}
					if (attacker.team !== player.team) {
                    player.setHealth(player.health - swordDamage) // Damage the player
						if (effectsEnabled == true && hitParticles == true) {
							damagecolor = 0
							if (redBlood == false) {
								damagecolor = randomColor()
							} else {
								damagecolor = "ff0000"
							}
                        playerexplode(player,damagecolor) 
						}
						if (player.alive == false) { // Was the player killed? Award the killer with a point
						attacker.setScore(attacker.score += 1)
						}
					}
                }
            }
        }
    }
})

//---------------------------------------------------------------------------------------------------

function ATERMIS(message){
	    return `[#ff0000][ATERMIS]: [#ffffff]${message}`
		// based on CHEATS COMMANDS V2 - Thanks Cheats! 
}

//---------------------------------------------------------------------------------------------------
function playerexplode(player,color) {
    let brick = new Brick(player.position,particleSize,color)
    Game.newBrick(brick)
    var grav = 0.8
    var time = 0
    var prot = randomIntFromInterval(0,9999)
    brick.setInterval(() => {
        var rotx = brick.position.x += 1 * Math.sin(prot)
        var roty = brick.position.y - 1 * Math.cos(prot)
        var rotz = brick.position.z += grav
        grav -= 0.1
        brick.setPosition(new Vector3(rotx,roty,rotz))
        time++
        if (time > 80 && !brick.destroyed) {
            brick.destroy()
        }
    }, 35)
}

Game.on('playerJoin', (p) => {
    p.on("died", () => {
        if (effectsEnabled == false || deathExplosion == false) return // If effects or explosions are disabled then dont run anything
        deathcolor = 0
        if (redBlood == false) {
            deathcolor = randomColor()
        } else {
            deathcolor = "#ff0000"
        }
        for (i = 0; i < 5; i++) { //repeat 5 times for 5 blocks
            playerexplode(p,deathcolor)
        }
    })
})

function randomColor() {
    return '#' + ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6)
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//---------------------------------------------------------------------------------------------------
// COMMANDS 
//---------------------------------------------------------------------------------------------------

Game.command("mod", (caller, args ) => {
	if (caller.userId !== 6419) return player.message("You are not the owner.") 
	for (let player of Game.players) {
		if (player.username.startsWith(args)) {
			moderator.push(player.userId)
			console.log(moderator)
			player.centerPrint("You are now a Moderator", 5) 
		}
	}
}) 

Game.command("kick", (caller, args ) => {
    if (moderator.includes(caller.userId)){
	    for (let player of Game.players) {
        if (player.username.startsWith(args)) {
			player.kick("Kicked by a Defense Leader")
            }
        }
    }
})

Game.command("cmds", (caller, args ) => {
    if (moderator.includes(caller.userId)){
		caller.message(ATERMIS("| /def [username] - teams player to defenders |"))
		caller.message(ATERMIS("| /hos [username] - teams player to hostiles |"))
		caller.message(ATERMIS("| /kick [username] - kicks player from game |"))
		caller.message(ATERMIS("| /message [message] - sends global message |"))
		caller.message(ATERMIS("| /official - Officialises the Raid |"))
		caller.message(ATERMIS("| /cmds - messages a list of the commands. |"))
	}
})

Game.command("def", (caller, args ) => {
    if (moderator.includes(caller.userId)) {
		for (let player of Game.players) {
			if (player.username.startsWith(args)) {
					player.setTeam(defendersteam)
					player.message("You have been teamed to Defenders.")
				}
			}
		}
	})
    
Game.command("hos", (caller, args ) => {
    if (moderator.includes(caller.userId)){
		for (let player of Game.players) {
			if (player.username.startsWith(args)) {
				player.setTeam(hostilesteam)
				player.message("You have been teamed to Hostiles.") 
			}
        }
	}
 })

Game.command("message", (caller, args ) => {
    if (moderator.includes(caller.userId)){
	Game.centerPrintAll(args, 5)
	}
})
	
Game.command("official", (caller, args ) => {
    if (moderator.includes(caller.userId)){
		Game.bottomPrintAll("Officialized", 3)
		Game.messageAll("The Server is now Officialized.") 
			for (let player of Game.players){	
				player.kill()
			}
		raidended = false
		var t = maximumtime
		var timeloop = setInterval(() => {
			t--
			console.log(t)
			Game.bottomPrintAll("ATERMIS || OFFICIAL Raid || " + `${t}`) // number to string
			overtime = false 
			if (t == 0) { // stop loop
				clearInterval(timeloop) 
				Game.centerPrintAll("OVERTIME", 5) 
				overtime = true
			}
		}, 1000);
		officialstatus = true
		if (overtime == true) {
			var ot = 0
			var overtimeloop = setInterval(()=> {
				ot++
				console.log(ot)
				Game.bottomPrintAll("ATERMIS || OFFICIAL Raid || OVERTIME " + `${ot}`)
				if (ot == maximumovertime) {
					clearInterval(overtimeloop)
				}
			},1000)
		}
		if (raidended == true) {
			clearInterval(timeloop)
			clearInterval(overtimeloop)
			t = 1200 
			ot = 0
		}
	}
})

//---------------------------------------------------------------------------------------------------
// FORTRESS TERMINAL POINT 
//---------------------------------------------------------------------------------------------------

termbrick.touching((async(player) => {
	if (officialstatus == false) {
		setTimeout(() => {player.message("The server is not officialized!");}, 10000)
		return
	}
	if (officialstatus == true) {
		if (player.team == defendersteam) {
			if (countdownactive == true) {
				if (teamholding == "Hostiles") {
					clearInterval(defendersloop)
					counter = 0
					countdownactive = false
					if (overtime == true) {
						Game.centerPrintAll("Defenders have recaptured the terminal during OVERTIME! DEFENDER VICTORY!", 9999) 
					}
				}		
				if (teamholding == "Defenders") {
					setTimeout(() => {player.message("Your team already owns Terminal!");}, 10000)
					return 
				}		
			}
			if (countdownactive == false) {
				termbrick.setColor("#0000ff")
				countdownactive = true 
				teamholding = "Defenders"
				clearInterval(defendersloop)
				clearInterval(hostilesloop)
				defendersloop = setInterval(() => {
				counter++
				console.log(counter)
				console.log(teamholding)
				Game.topPrintAll("Defenders || " + `${counter}`) // number to string // number to string
				if (counter == wincondition) { // stop loop
					clearInterval(defendersloop)
					Game.centerPrintAll("Defenders have saved the day! DEFENDER VICTORY!", 9999) 
					countdownactive = false 
					counter = 0 
					raidended = true 
				}
				}, 1000);
			}
		}
		// IF THE PLAYER IS IN THE HOSTILE TEAM 
		if (player.team == hostilesteam) {
			if (countdownactive == true) {
				if (teamholding == "Defenders") {
					clearInterval(defendersloop)
					counter = 0
					countdownactive = false
				}
				if (teamholding == "Hostiles") {
					setTimeout(() => {player.message("Your team already owns Terminal!");}, 10000)
					return 
				}
			}
			if (countdownactive == false) { 
				termbrick.setColor("#ff0000")
				countdownactive = true
				teamholding = "Hostiles"
				clearInterval(defendersloop)
				clearInterval(hostilesloop)
				hostilesloop = setInterval(() => {
					counter++	
					console.log(counter)
					console.log(teamholding)
					Game.topPrintAll("Hostiles || " + `${counter}`) // number to string
					if (counter == wincondition) { // stop loop
						clearInterval(hostilesloop)
						Game.centerPrintAll("Hostiles have crushed the defenders! HOSTILE VICTORY!", 9999)
						countdownactive = false 
						counter = 0
						raidended = true
					}
				}, 1000);
			}
		}
	}
}))
