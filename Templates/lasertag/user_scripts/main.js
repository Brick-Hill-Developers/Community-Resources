

function torad(deg) {
    return deg / 180 * Math.PI
}
function todeg(rad) {
    return rad * 180 / Math.PI
}
function add(v1, v2) {
    return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
}
function sub(v1, v2) {
    return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z)
}
function move(vector, rot, mult) {
    return new Vector3(vector.x + (Math.sin(torad(rot)) * mult), vector.y + (Math.cos(torad(rot)) * mult), vector.z)
}
function sincos(vector, rot, mult) {
    return new Vector3(Math.sin(torad(rot) * mult), Math.cos(torad(rot) * mult), vector.z)
}
function v(x, y, z) {
    return new Vector3(x, y, z)
}
async function assignTeam(player) {
    if (red) {
        console.log("Assign red")
        await player.setTeam(world.teams[0])
    } else {
        console.log("Assign blue")
        await player.setTeam(world.teams[1])
    }
    red = !red
}
function rndmel(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}
// TODO: was working on tping the player to its corresponding spawnlocation
console.log(world.teams)
var bricklist = []
var red = true
var speed = 1
var interval = 2
var lifespan = 5000
var mode = "lobby"
var redscore = 0
var bluescore = 0
var countdown = 5
// Player join event
Game.on("playerJoin", p => {
    p.lock = false
    p.bullets = []
    p.on("mouseclick", async () => {
        if (!p.alive) return
        if (mode != "match") return
        //var brick = new Brick(new Vector3(x,y,z),new Vector3(2,1,1))
        var brick = new Brick(v(p.position.x - 0.5, p.position.y - 0.5, 2.5 + p.position.z), new Vector3(1, 1, 1), "#00ff00")
        brick.rotation = p.rotation.z
        brick.collision = false
        brick.lifespan = lifespan
        brick.hitbox = p.hitbox
        brick.owner = p
        await Game.newBrick(brick)
        bricklist.push(brick)
        p.bullets.push(brick)
    })
    p.on("initialSpawn", async ()=> {
        if(mode == "match") {
            await assignTeam(p)
            await p.kill()
        }
    })
    p.on("respawn", async () => {
        console.log("respawn")
        if(mode != "match") return
        if(p.team.name == "Red") {
            
            p.setPosition(rndmel(world.spawns.filter(val => {return val.color != "#0057a9"})).position)
        } else {
            
            p.setPosition(rndmel(world.spawns.filter(val => {return val.color == "#0057a9"})).position)
        }
        
        
        var hitbox = new Brick(p.position, new Vector3(1, 4, 5))
        hitbox.name = "hitbox"
        hitbox.rotation = p.rotation.z
        hitbox.collision = false
        hitbox.visibility = 0.25
        hitbox.owner = p
        await Game.newBrick(hitbox)
        p.hitbox = hitbox
    })
    p.on("keypress", key => {
        if (key != "enter") return
        p.lock = !p.lock
    })
})

// Hitbox loop
setInterval(() => {
    
    for (let index = 0; index < Game.players.length; index++) {
        const player = Game.players[index];
        if (!player.hitbox) return
        player.hitbox.setPosition(v(player.position.x - 0.5, player.position.y - 2, player.position.z))
        player.hitbox.setRotation(player.rotation.z)
    }
}, 10)

// Camera lock loop
setInterval(() => {
    for (let index = 0; index < Game.players.length; index++) {
        const player = Game.players[index];
        if (!player.lock) return
        player.setCameraDistance(0)
    }
}, 100)

// Bullet loop
setInterval(() => {

    for (let index = 0; index < bricklist.length; index++) {
        const brick = bricklist[index];

        brick.setPosition(move(brick.position, brick.rotation - 181, speed))
        for (let indexo = 0; indexo < world.bricks.length; indexo++) {
            const bricko = world.bricks[indexo];
            if (bricko != brick) {

                var brickoaabb = aabb([bricko.position.x, bricko.position.y, bricko.position.z], [bricko.scale.x, bricko.scale.y, bricko.scale.z])
                var brickaabb = aabb([brick.position.x, brick.position.y, brick.position.z], [brick.scale.x, brick.scale.y, brick.scale.z])

                if (brickoaabb.intersects(brickaabb) && !brick.destroyed && brick.hitbox != bricko) {
                    if (bricko.name == "hitbox" && bricko.owner.alive && !brick.destroyed) {
                        if (bricko.owner.team == brick.owner.team) return
                        if (brick.owner.team.name == "Red") {
                            redscore += 1
                        } else {
                            bluescore += 1
                        }
                        bricko.owner.kill()
                        bricko.owner.topPrint(`You were killed by ${brick.owner.team.name == "Red" ? "\\c6" : "\\c4"}${brick.owner.username}`, 5)
                        brick.owner.topPrint(`You killed ${brick.owner.team.name == "Red" ? "\\c4" : "\\c6"}${bricko.owner.username}`, 2)
                        bricko.owner.hitbox = null
                        bricko.setCollision(true)
                        bricko.destroy()
                        console.log("Killed someone")
                        brick.owner.setScore(brick.owner.score + 1)
                        bricko.owner.bullets.forEach(bricky => { bricky.setCollision(true); bricky.destroy() })
                    }
                    brick.setCollision(true)
                    brick.destroy()

                    //brick.setVisibility(0)
                    console.log("Brick destroyo")
                    break
                }

            } else {

            }
        }
        brick.lifespan -= interval
        if (brick.lifespan <= 0) {
            brick.setCollision(true)
            brick.destroy()
            console.log("Ded bcuz lifespan")
        }

    }

    bricklist = bricklist.filter(el => { return !el.destroyed })
}, interval);

// Hitbox clear loop
setInterval(() => {
    if(mode == "match") return
    for (let index = 0; index < world.bricks.length; index++) {
        const brick = world.bricks[index];
        if (brick.name == "hitbox") {
            brick.setCollision(true)
            brick.destroy()
        }
    }
    //console.log("Hitbox clear")
}, 5000);

// Main gamemode switch loop
setInterval(async () => {
    if (mode == "match") {
        if (bluescore == 30 || redscore == 30) {
            mode = "lobby"
            bluescore = 0
            redscore = 0
            await Game.loadBrk("./lobby2.brk")
            for (let index = 0; index < Game.players.length; index++) {
                const player = Game.players[index];
                //await assignTeam(player)
                await player.kill()
            }
            countdown = 30
        } else {
            Game.bottomPrintAll(`Red ${30 - redscore} - First to 30 - Blue ${30 - bluescore}`,2)
        }
    } else if (mode == "countdown") {
        countdown -= 1
        Game.bottomPrintAll("Game is starting in "+countdown)
        if (countdown == 0 && Game.playerCount > 1) {
            mode = "match"
            await Game.loadBrk("./laser_gun.brk")
            for (let index = 0; index < Game.players.length; index++) {
                const player = Game.players[index];
                await assignTeam(player)
                await player.setScore(0)
                await player.kill()
            }
            // The client has the gay
            
            
            
        } else if(countdown == 0) {
            mode = "lobby"
            countdown = 30
        }
    } else if (mode == "lobby") {
        if(Game.playerCount > 1) {
            mode = "countdown"
        }
    }
}, 1000)