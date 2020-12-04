// Made by SmartLion


const ang = -57.7 // For angles

Game.on("initialSpawn", (player) => {
	player.camera = new Vector3(0, 0, 0)
	new PacketBuilder(3) // Create local figure
		.write("uint8", 1)
		.write("uint32", 123123123)
		.write("string", "")
		.write("uint32", 1)
		.write("uint8", false)
		.write("uint8", 1)
		.send(player.socket)
	player.setCameraObject({ netId: 123123123 })
	new PacketBuilder("Figure") // Scale
		.write("uint32", 123123123)
		.write("string", "GHI")
		.write("float", 0)
		.write("float", 0)
		.write("float", 1)
		.send(player.socket)

	player.setInterval(() => {
		if (Game.pointDistance3D(player.position, new Vector3(player.camera.x, player.camera.y, player.camera.z)) > 0.1) {
			player.camera = movePositionToAngle(player.camera, Game.pointDistance3D(player.position, new Vector3(player.camera.x, player.camera.y, player.position.z)) / 10, lookAtPoint(player.position, player.camera), player.position.z)

			new PacketBuilder("Figure") // Update local figure position
				.write("uint32", 123123123)
				.write("string", "ABC")
				.write("float", player.camera.x)
				.write("float", player.camera.y)
				.write("float", player.camera.z)
				.send(player.socket)
		}
	}, 10);
	player.on("respawn", () => {
		player.setCameraObject({ netId: 123123123 })
	})
})

function lookAtPoint(player, camera) {
	let angle = Math.atan2(player.y - camera.y, player.x - camera.x);
	angle = -(angle * (180 / Math.PI)) + 270;
	return angle;
}

function movePositionToAngle(position, speed, angle, targetZ) {
	var x = position.x + speed * Math.sin(angle / ang)
	var y = position.y - + speed * Math.cos(angle / ang) // dunmby.
	let t = 0.1
	var z = (1 - t) * position.z + t * targetZ
	return new Vector3(x, y, z)
}
