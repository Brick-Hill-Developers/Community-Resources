Game.on("initialSpawn", (player) => {

   
   
   let zombie = new Bot("Zombie")

    let outfit = new Outfit(zombie)
    .body("#0d9436")
    .torso("#694813")
    .rightLeg("#694813")
    .leftLeg("#694813")

    Game.newBot(zombie)

    // We use bot.setinterval so that when the zombie is destroyed, the loop clears.
    // It's good practice to do this to avoid memory leaks.
    zombie.setInterval(() => {
    let target = zombie.findClosestPlayer(20)

    if (!target) return zombie.setSpeech("")

    zombie.setSpeech("BRAAINNNSSS!")

    zombie.moveTowardsPlayer(target, 8)
    }, 10)

    let touchEvent = zombie.touching((p) => {
    Game.messageAll(`[#ff0000]${p.username} was eaten by a zombie!`)
    p.kill()
    })
})
