// discord-chat v2 by pb2007 (podnf)

// This script requires discord.js to be installed and be in the sandbox. (npm i discord.js@latest)
// This script requires process to be in the sandbox for shutdown notifications

// sandbox: {
//     Discord: require("discord.js"),
//     process: require("process")
// }

// Settings \\
const gamename = ""      // The name of your game.

const guildid = ""       // The ID of your server (called guilds internally). Used for nicknames and such
const channelid = ""     // The ID of your channel. Used for sending to the channel, duh!
const prefix = "p!"      // The prefix used for some chat commands in Discord.

const showInvite = false // Whether or not to show an invite to your server on join.
const invite = ""        // An invite to your server.

const tkn = ""           // The token for your bot.
// Settings end \\

const client = new Discord.Client()

// Functions \\

function prettycount() {
	return (Game.playerCount === 1 ? "1 player" : `${Game.playerCount} players`)
}

async function exitHandler(code) {
	console.log(`[discord-chat] About to exit because of signal ${code}`)
	Game.messageAll("\\c6[SERVER]: [#ffffff]The server is now shutting down.")

	let brkch = await client.channels.cache.get(channelid)
	await brkch.send(`${gamename} is shutting down.`)
	await client.setStatus("idle")
	await client.user.setActivity("Shutting down...")
	console.log("[discord-chat] Finished all tasks; shutting down.")
	Game.shutdown()
}

// Processes chat commands
function cmdProcess(msg,cmd) {
	switch (cmd) {
		case 'count':
			msg.reply((Game.playerCount === 1 ? "1 player is" : `${Game.playerCount} players are`) + " in the game right now.")
			break
		case 'list':
			// formulate the list
			let plist = "```\n"
			Game.players.forEach(v => {
				plist += `${v.username}\n`
			})
			plist += "```"
			// reply
			msg.reply("The player list is as follows:\n"+plist)
			break
		case 'version':
			msg.reply("This game is currently using discord-chat v2.")
			break
	}
}

// Functions end \\

console.log("[discord-chat] Connecting...")

// Events \\

// the game started
client.once("ready", async() => {
	console.log(`Ready! Logged in as ${client.user.tag}.`)

	let brkch = await client.channels.cache.get(channelid)
	await brkch.send(`${gamename} started.`)
	await client.user.setStatus("online")
	await client.user.setActivity(prettycount() + " | " + gamename)
})

// discord -> brick hill
client.on("message", async(message) => {
	if (message.channel.id === channelid) {
		if (message.author.bot) return;
		// Process commands
		switch (message.content) {
			case `${prefix}count`:
				cmdProcess(message,"count")
				return
			case `${prefix}list`:
			case `${prefix}players`:
				cmdProcess(message,"list")
				return
			case `${prefix}version`:
				cmdProcess(message,"version")
				return
		}

		// Transmit message
		let nickname = client.guilds.cache.get(guildid).member(message.author).displayName
		let username = message.author.username
		if (nickname === username) {
			Game.messageAll(`[#0000ff][discord-chat] [#ffffff]${nickname}: ${message.content}`)
			console.log(`[discord-chat] ${nickname}: ${message.content}`)
		} else {
			Game.messageAll(`[#0000ff][discord-chat] [#ffffff]${nickname} (${username}): ${message.content}`)
			console.log(`[discord-chat] ${nickname} (${username}): ${message.content}`)
		}
	}
})

// brick hill -> discord
Game.on("chatted", async(p,message) => {
	message = message.replace(/@/g, "(@)") // Prevent pinging
	
	let brkch = await client.channels.cache.get(channelid)
	brkch.send(`${gamename} | ${p.username}: ${message}`)
})

// join
Game.on("playerJoin", p => {
	let brkch = client.channels.cache.get(channelid)
	brkch.send(`${p.username} joined ${gamename}.`)
	client.user.setActivity(prettycount() + " | " + gamename)

	if (showInvite) {
		p.message(`[#0000ff][discord-chat] [#ffffff]Join my Discord server to talk to this game! ${invite}`)
	}
})

// leave
Game.on("playerLeave", p => {
	let brkch = client.channels.cache.get(channelid)
	brkch.send(`${p.username} left ${gamename}.`)
	client.user.setActivity(prettycount() + " | " + gamename)
})

// Shutdown notification
process.on("SIGINT", exitHandler)
process.on("SIGTERM", exitHandler)

// Events end \\

client.login(tkn)
