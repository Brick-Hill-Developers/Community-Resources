let zombie = new Bot("Zombie")

let outfit = new Outfit(zombie) // zombie outfit
    .body("#0d9436")
    .torso("#694813")
    .rightLeg("#694813")
    .leftLeg("#694813")

Game.newBot(zombie) // crete the bot instance 

// We use bot.setinterval so that when the zombie is destroyed, the loop clears.
// It's good practice to do this to avoid memory leaks.
zombie.setInterval(() => {
    let target = zombie.findClosestPlayer(20)

    if (!target) return zombie.setSpeech("") // if there isnt a player nearby do 

    zombie.setSpeech("BRAAINNNSSS!")  // if there is a player nearby do 

    zombie.moveTowardsPlayer(target, 8) // move to the player
}, 10)

let touchEvent = zombie.touching((p) => { // Bot touches Player
    Game.messageAll(`[#ff0000]${p.username} was eaten by a zombie!`)
    // p.kill() to kill a player intantly 
   // p.setHealth(p.health-5) to reduce the player health by 5
})
