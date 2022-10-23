let tool = new Tool("Gun")
tool.model = 6929

const range = 100

tool.on("activated", async(player) => {

    let brick = new Brick(player.position, new Vector3(.75, .75, .75), "#5e5756")
    brick.collision = false
    Game.newBrick(brick)

    brick.touching(debounce((p) => {

        if (p.alive && p !== player) { //check if the target is alive and isnt the player shooting
            p.kill()
            player.setScore(player.score++)
        }

    }), 500)

    const pos = new Vector3().fromVector(player.position)//save the current position of the player
    let prot = player.rotation.z + 180

    for (let x = 0; x < range; x++) {
        let rotx = pos.x + x * Math.sin(prot / 180 * Math.PI)
        let roty = pos.y + x* Math.cos(prot / 180 * Math.PI)
        let rotz = pos.z + 3
        brick.setPosition(new Vector3(rotx, roty, rotz))

        await sleep(10) //you can change this if you want the bullet to go slower/faster
    }

    brick.destroy()

})

Game.on("playerJoin", (p) => {
    p.equipTool(tool)
})
