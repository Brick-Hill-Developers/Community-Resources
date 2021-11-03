//loadbrk.js, created by bunnynabbit (aka SmartLion on Brick Hill) and pb2007 (Podnf)

// Settings \\
const sets = ["blocky","brkcanyon","house","house2","tower"] // Files to be loaded by the auto selector (ignored if flat-file-db already exists)
const ownerAdminId = 1 // user id goes here (you can find this by looking at the number at the end of the url of your profile page)
const countdownDefault = 600 // autoload time in seconds (default is 600 seconds, so an autoload happens every 10 minutes)
const guiEnable = true
const flatfiledbEnabled = false // (npm i flat-file-db) Uses flat-file-db to save sets added from /add and ports existing data from the sets array. If database already exists then the above hardcoded array wont be used
const consoleOutput = true // if false, there will be no messages in the server console
// Settings \\

let countdown = countdownDefault
if (flatfiledbEnabled == true) { 
flatfile = require('flat-file-db');
db = flatfile('/tmp/loadbrkdata.db'); // This will create a folder called tmp at current drive
let readydb = 2
db.on('open', function() {
    readydb = 1
    let twig = db.has("setdb")
    if (twig == true) {
        twig = db.get("setdb")
        if (consoleOutput) console.log(`Loaded save with ${twig.length} sets`)
        sets = twig 
        autoload()
    } else { 
        if (consoleOutput) console.log(`WARN: Save data not found! Creating save data.`)
        if (consoleOutput) console.log(`${sets.length} sets ported into database`)
        db.put("setdb",sets)
        autoload()
    }
});
} else {
    autoload() // choose a random map to load on server start
}

Game.command("load", async(p,i) => { //TODO: tidy up the code
    if (p.userId !== ownerAdminId) {p.message("\\c6Error: You cannot execute that command as you are not admin!"); return;} else {p.message("\\c5Success! You are an admin, so that command is being executed.");}
    countdown = countdownDefault // reset the countdown
    world.bricks.forEach(async(brick) => {
        await sleep(2000)
        brick.destroy()
    })
    await sleep(2000)
    if (consoleOutput) console.log("loading "+i)
    Game.messageAll(`\\c6Loading ${i}.brk`)
    let data = await Game.loadBrk(`./maps/${i}.brk`)
    Game.setEnvironment(data.environment)
    Game.players.forEach((player) => {
        player.respawn()
    })
    world.bricks.forEach(async(brick) => {
        if (brick.name == "sb1") { //Gives 10 points
            spawnscorebubble(brick.position,1)
            await sleep (4000)
            brick.destroy()
        } else if (brick.name == "sb2") { //Gives 50 points
            spawnscorebubble(brick.position,2)
            await sleep (4000)
            brick.destroy()
        } else if (brick.name == "sb3") { //Gives 100 points
            spawnscorebubble(brick.position,3)
            await sleep (4000)
            brick.destroy()
        }
    })
if (consoleOutput) console.log("loaded "+i)
})

Game.command("add", (p,i) => {
    if (p.userId !== ownerAdminId) {p.message("\\c6Error: You cannot execute that command as you are not admin!"); return;} else {p.message("\\c5Success! You are an admin, so that command is being executed.");}
    sets.push(i)
    Game.messageAll(`\\c6${i}.brk has been added!`)
    if (flatfiledbEnabled == true) {
        db.put("setdb",sets)
    }
})

Game.command("pop", (p,i) => {
    if (p.userId !== ownerAdminId) {p.message("\\c6Error: You cannot execute that command as you are not admin!"); return;} else {p.message("\\c5Success! You are an admin, so that command is being executed.");}
    var i = sets.pop()
    Game.messageAll(`\\c6${i}.brk has been removed!`)
    if (flatfiledbEnabled == true) {
        db.put("setdb",sets)
    }
})

Game.command("remove", (p,i) => {
    if (p.userId !== ownerAdminId) {p.message("\\c6Error: You cannot execute that command as you are not admin!"); return;} else {p.message("\\c5Success! You are an admin, so that command is being executed.");}
    x = sets.indexOf(i)
    if (x == -1) return p.message(`\\c6Unable to find ${i}`)
    sets.splice(x,1);
    Game.messageAll(`\\c6${i}.brk has been removed!`)
    if (flatfiledbEnabled == true) {
        db.put("setdb",sets)
    }
})

Game.command("guitoggle", (p,i) => {
    // TODO: make it so that this command doesn't require admin and only affects you (so gui is only disabled for you)
    if (p.userId !== ownerAdminId) {p.message("\\c6Error: You cannot execute that command as you are not admin!"); return;} else {p.message("\\c5Success! You are an admin, so that command is being executed.");}
    guiEnable = !guiEnable;
})

Game.command("skip", async(p,i) => {
    if (p.userId !== ownerAdminId) {p.message("\\c6Error: You cannot execute that command as you are not admin!"); return;} else {p.message("\\c5Success! You are an admin, so that command is being executed.");}
    countdown = countdownDefault
    autoload()
})

Game.command("sets", (p,i) => {
    let x = []
    for (let name of sets) {
        x.push(` ${name}`)
    }
    p.message(`\\c5Sets:\\c0${String(x)}`)
})

// TODO: make a voteskip command that doesnt require admin and casts a vote if this map should be skipped
// only act on the autoload if there is a majority of yes

async function autoload() {
    do {
        if (consoleOutput) console.log("Rolling die for a new map...")
        i = sets[randynumber(0,sets.length - 1)]
        currentMap = Game.mapName
        newMap = i+'.brk'
        if (consoleOutput) console.log("Rolled "+newMap+" as our new map.")
        if (consoleOutput) console.log(currentMap+" is the current map.")
    }
    while (newMap == currentMap); // keep rolling until we get a different map than what we had previously

    world.bricks.forEach(async(brick) => {
        await sleep(2000)
        brick.destroy()
    })
    await sleep(2000)
    if (consoleOutput) console.log("autoloading "+i)
    Game.messageAll(`\\c6Autoloading ${i}.brk`)
    let data = await Game.loadBrk(`./maps/${i}.brk`)
    Game.setEnvironment(data.environment)
    Game.players.forEach((player) => {
        player.respawn()
    })
    world.bricks.forEach(async(brick) => {
        if (brick.name == "sb1") { //Gives 10 points
            spawnscorebubble(brick.position,1)
            await sleep (4000)
            brick.destroy()
        } else if (brick.name == "sb2") { //Gives 50 points
            spawnscorebubble(brick.position,2)
            await sleep (4000)
            brick.destroy()
        } else if (brick.name == "sb3") { //Gives 100 points
            spawnscorebubble(brick.position,3)
            await sleep (4000)
            brick.destroy()
        }
    })
if (consoleOutput) console.log("autoloaded "+i) 
}

function randynumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function spawnscorebubble(pos,type){
    if (type == 1) { // Normal bubble gives 10
        var brick = new Brick(pos, new Vector3(1, 1, 1), "#00ff00")
        Game.newBrick(brick)
    } else if (type == 2) { // Medium bubble gives 50 
        var brick = new Brick(pos, new Vector3(1, 1, 1), "#ffff00")
        Game.newBrick(brick)
    } else if (type == 3) {  // Huge bubble gives 100 
        var brick = new Brick(pos, new Vector3(1, 1, 1), "#ff0000")
        Game.newBrick(brick)
    }

    brick.touching(debounce(p => {
        if (type == 1) {
            p.bubblescore += 10
            p.bubblemut++
            p.bubblecooldown = 3
            //brick-streamstuuf line
            p.centerPrint(`${p.bubblescore}`,3)
            bubbleexplode(brick.position.x,brick.position.y,brick.position.z,"#00ff00",)
            brick.destroy()
        } else if (type == 2) {
            p.bubblescore += 50
            p.bubblemut++
            p.bubblecooldown = 3
            //brick-streamstuuf line
            p.centerPrint(`${p.bubblescore}`,3)
            bubbleexplode(brick.position.x,brick.position.y,brick.position.z,"#ffff00",)
            brick.destroy()
        } else if (type == 3) {
            p.bubblescore += 100
            p.bubblemut++
            p.bubblecooldown = 3
            //brick-streamstuuf line
            p.centerPrint(`${p.bubblescore}`,3)
            bubbleexplode(brick.position.x,brick.position.y,brick.position.z,"#ff0000",)
            brick.destroy()
        }
    }, 800)) // this probably didn't have to be 2000 so i'm changing it back to 800
}

Game.on('playerJoin', (p) => {
    p.bubblescore = 0
    p.newbubblescore
    p.bubblemut = 0
    p.bubblecooldown = 0
    p.mut = 0

    p.setInterval(() => {
        p.bubblecooldown--
        if (p.bubblecooldown == 0) {
            if (p.bubblemut > 4) {
                p.mut = 1
                p.mut += Math.floor(p.bubblemut / 5)
                p.newbubblescore = Math.floor(p.bubblescore * p.mut)
                p.centerPrint(`\\c5X${p.mut}! ${p.newbubblescore}+ (${p.bubblescore})`,2)
                p.setScore(p.score += p.newbubblescore)
                p.bubblescore = 0
                p.bubblemut = 0
            } else {
                p.centerPrint(`\\c5${p.bubblescore}+`,2)
                p.setScore(p.score += p.bubblescore)
                p.bubblescore = 0
                p.bubblemut = 0
            }
        }
    },1000)
})



function bubbleexplode(px,py,pz,color) {
    let brick = new Brick(new Vector3(px,py,pz+3),new Vector3(0.35,0.35,0.35),color)
    Game.newBrick(brick)
    const grav = 1
    const time = 0
    const sped = 1
    const prot = randynumber(0,9999)
    brick.setInterval(() => {
        let rotx = brick.position.x += 1 * Math.sin(prot)
        let roty = brick.position.y -+ 1 * Math.cos(prot)
        let rotz = brick.position.z += grav
        brick.setPosition(new Vector3(rotx,roty,rotz))
        time++
        if (time > 1) {
            grav -= 0.1
            sped -= 0.05
            time++
            rotx = brick.position.x += sped * Math.sin(prot)
            roty = brick.position.y -+ sped * Math.cos(prot)
            rotz = brick.position.z += grav
            if (time > 80 && !brick.destroyed)
            brick.destroy()
        }
    }, 35)
}

setInterval(async() => {
    countdown--
    //if (consoleOutput) console.log("countdown: "+countdown)
    if (guiEnable) {
        Game.topPrintAll("[#FFDE0A]Current map: [#FFFFFF]"+Game.mapName,1000)
        Game.bottomPrintAll("[#FFDE0A]Time until next map: [#FFFFFF]"+countdown+" seconds.",1000)
    }
    if (countdown < 1) {
        countdown = countdownDefault
        autoload()
    }
},1000)
