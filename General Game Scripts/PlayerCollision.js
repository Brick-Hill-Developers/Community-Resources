Game.on("playerJoin", (player) => {
    player.on("initialSpawn", () => {
        createBrick(player)
    })
})

async function createBrick(p) {
    let brick = new Brick(new Vector3(1, 1, 1), new Vector3(4, 4, 5), "#f54242")
    brick.visibility = 0

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
