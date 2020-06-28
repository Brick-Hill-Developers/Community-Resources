[//Created by SmartLion
//Credit not required
// WARNING: this may cause issues if used with other weapon scripts

// Data saving if needed
/*in sandbox add flatfile: require("flat-file-db")
var db = flatfile('/tmp/SepraGame.db');
let readydb = 0
db.on('open', function() {
    readydb = 1
});*/ //flat-file-db used for saving data
// npm i flat-file-db
// works fine for me okay?
]

function getPlayer(name) {
    for (let player of Game.players) {
        if (player.username.toLowerCase().indexOf(String(name).toLowerCase()) == 0) {
            const victim = Array.from(Game.players).find(p => p.username === player.username)
            return victim
        }
    }
}

function randomColor() {
    return '#' + ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6)
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function crimsontool(px,py,pz,prot,attackid) {
    let brick = new Brick(new Vector3(px,py,pz+3),new Vector3(1,1,1),"#FF0000")
    Game.newBrick(brick)
    let grav = 0
    let time = 0
    let sped = 1
    brick.setInterval(() => {
        let rotx = brick.position.x += sped * Math.sin(prot / debug)
        let roty = brick.position.y -+ sped * Math.cos(prot / debug)
        let rotz = brick.position.z
        //???????
        brick.setPosition(new Vector3(rotx,roty,rotz))
        time++
        if (time > 40) {
            grav -= 0.2
            sped -= 0.05
            time++
            let rotz = brick.position.z += grav
            //???????
            if (time > 80 && !brick.destroyed)
            brick.destroy()
        }
    }, 15)
    brick.touching(async(p) => {
        let attacker = getPlayer(attackid)
        if(p.username !== attacker.username) {
        p.setHealth(p.health - 20)
        if (!p.alive) {
        Game.messageAll(`\\c6${attackid} killed ${p.username}`)

        attacker.setScore(attacker.score += 1)
        //db.put(attacker.userId,attacker.score)
        }
        brick.destroy()
    }
  })
}

function deathani(px,py,pz,color) {
    let brick = new Brick(new Vector3(px,py,pz+3),new Vector3(1,1,1),color)
    Game.newBrick(brick)
    var grav = 1.3
    var time = 0
    var sped = 1
    var prot = randomIntFromInterval(0,9999)
    brick.setInterval(() => {
        var rotx = brick.position.x += sped * Math.sin(prot / -60)
        var roty = brick.position.y - sped * Math.cos(prot / -60)
        var rotz = brick.position.z += grav
        brick.setPosition(new Vector3(rotx,roty,rotz))
        time++
        if (time > 1) {
            grav -= 0.1
            sped -= 0.1
            time++
            if (time > 80 && !brick.destroyed)
            brick.destroy()
        }
    }, 35)
}

Game.on('playerJoin', (p) => {
    /*if (readydb == 0) {
        p.kick(`Database is not ready!`)
    }
    p.on("initialSpawn", () => {
        let thing = db.has(p.userId)
        if (thing == true) {
            thing = db.get(p.userId)
            p.message(`\\c5Loaded save data with ${thing} kills`)
            p.message(`is data loaded? please confirm`)
            p.setScore(thing) 
        } else { 
            p.message(`\\c5WARN: \\c0Save data not found! Creating save data.`)
            db.put(p.userId,0)
        }
    })*/
    var energy = 0
    p.loadTool = false
    let deathblocks = 0
    let deathcolor = 0

    p.on('mouseclick', () => {
        if (!p.alive) return
        if (energy < 5) return
            energy -= 3
            crimsontool(p.position.x,p.position.y,p.position.z,p.rotation.z,p.username)
    })

    p.on("died", () => {
        energy = 100
        deathcolor = randomColor()
        for (i = 0; i < 5; i++) {
            deathani(p.position.x,p.position.y,p.position.z,deathcolor,)  // wag! X_X
        }
    })
    p.setInterval(() => {
        if (energy < 100) {
            energy++
        }
        p.bottomPrint(`\\c4ENERGY: \\c7${energy}%`, 1)
    }, 100)
})
let debug = -57.7
/*Game.command("update", (p,m) => {
    debug = m
})*/
//this script is used for changing the shooting angle if needed
