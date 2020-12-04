// Made by SmartLion

Game.sendBricks = false

const settings = {
	defaultStreamingDistance: 100,
	excludeBrickName: "dns",
	allowStreamCommand: false,
	commandStreamChangeMinimum: 75,
	commandStreamChangeMaxmium: 350,
	announceCommandUsage: true,
}

settings.announceCommandUsageText = `\\c4[BRICK-STREAM]: \\c7Use "/stream (${settings.commandStreamChangeMinimum}-${settings.commandStreamChangeMaxmium})" to change the streaming distance!`

// Do not change anything beyond this point unless you know what you're doing
if (settings.allowStreamCommand) {
	Game.command("stream", (p, msg) => {
		if (!isNaN(msg)) {
			if (msg < settings.commandStreamChangeMinimum) msg = settings.commandStreamChangeMinimum
			if (settings.commandStreamChangeMaxmium < msg) msg = settings.commandStreamChangeMaxmium
			p.streamingSetting = msg
			p.message(`\\c4[BRICK-STREAM]: \\c7Streaming distance set to ${msg}. Please wait if game is frozen`)
		} else {
			p.message(`\\c4[BRICK-STREAM]: \\c7"/stream (${settings.commandStreamChangeMinimum} to ${settings.commandStreamChangeMaxmium})" to set max streaming distance`)
			p.message(`\\c4[BRICK-STREAM]: \\c7"/stream" to see current stream distance`)
			p.message(`\\c4[BRICK-STREAM]: \\c7Streaming distance is currently at ${p.streamingSetting}`)
		}
	})
}

Game.on("playerJoin", (p) => {
	p.centerPrint("\\c4[BRICK-STREAM]: \\c7Game is loading, please wait.", 2)
	p.brickArray = []
	
	if (settings.allowStreamCommand && settings.announceCommandUsage)
		p.message(settings.announceCommandUsageText)

	p.on("initialSpawn", () => {
		p.streamingSetting = settings.defaultStreamingDistance
		p.setInterval(() => {
			if (p.brickArray.length) {
				p.loadBricks(p.brickArray)
				p.brickArray = []
			}
		}, 500)

		for (let brick of world.bricks) {
			const localBrick = new Brick(brick.position, brick.scale, brick.color)
				localBrick.shape = brick.shape
				localBrick.lightEnabled = brick.lightEnabled
				localBrick.lightRange = brick.lightRange
				localBrick.visibility = brick.visibility
				localBrick.collision = brick.collision
				localBrick.rotation = brick.rotation
				localBrick.streamable = true
				localBrick.streamed = false

			if (brick.name === settings.excludeBrickName) {
				localBrick.streamable = false
				p.newBrick(localBrick)
				continue
            }

			p.localBricks.push(localBrick)
		}

		p.setInterval(() => {
			let deleteBricks = []

			for (let localBrick of p.localBricks) {
				if (!localBrick.streamable) continue
				
				if (Game.pointDistance3D(localBrick.position, p.position) < p.streamingSetting) {
					if (!localBrick.streamed) {
						p.brickArray.push(localBrick)
						localBrick.streamed = true
					}
				} else if (localBrick.streamed && !localBrick.destroyed) {
					localBrick.streamed = false
					deleteBricks.push(localBrick)
				}
			}

			if (deleteBricks.length) p.deleteBricks(deleteBricks)

			deleteBricks = []
		}, 1000)

		/*
		world.bricks.forEach((brick) => {
			// "Clone" the brick
			const localBrick = new Brick(brick.position, brick.scale, brick.color)
			localBrick.shape = brick.shape
			localBrick.lightEnabled = brick.lightEnabled
			localBrick.lightRange = brick.lightRange
			localBrick.visibility = brick.visibility
			localBrick.collision = brick.collision
			localBrick.rotation = brick.rotation

			let brickloadstate = 0

			if (brick.name === excludeBrickName) return p.newBrick(localBrick)
			
			p.setInterval(() => {
				if (Game.pointDistance3D(localBrick.position, p.position) < p.streamingSetting) {
					if (brickloadstate === 0) {
						brickloadstate = 1
						p.brickArray.push(localBrick)
					}
				} else {
					if (brickloadstate === 1) {
						brickloadstate = 0
						return !localBrick.destroyed && localBrick.destroy()
					}
				}
			}, 1000)
		})
		*/
	})
})
