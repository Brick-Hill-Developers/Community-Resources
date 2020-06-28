// reuseHandler by SmartLion
// PM SmartLion for more info and docs
// Credit not required
// Example: https://www.brick-hill.com/play/839/


// Handler for reusing existing bricks to reduse lag spikes + disc usage because Brick Hill Legacy TM
// the disc usage thing is no longer the case in this new version now but it still lag spikes which is :(
// Bricks should always be reused and NEVER deleted or added when you use this
//queue = []

console.log("loaded requireHandler.js")

function initqueue() {
    let i = 0
    for (i = 0; i < 50; i++) { // Create the 50 bricks and queue
        let brick = new Brick(new Vector3(0, 0, -100), new Vector3(1, 1, 1), "#f54242")
        Game.newBrick(brick)
        brick.queueID = i
        brick.collision = false
        queue.push({object: brick, canUse: true})
    }
    console.log("Created queue")
}

function reuseBrick() {
    var id = queue.findIndex(object => object.canUse === true)
    if (id !== -1) {
        var objects = queue[id]
        objects.canUse = false
        return objects.object
    } else {
        return -1 // i simply cannot
    }
}

function deleteBrick(brick) { // TODO check if object is used or not OR maybe check if brick is even in the queue at all
    brick.setPosition(new Vector3(-99,-99,-99))
    var object = queue[brick.queueID]
    object.canUse = true
}

module.exports = { reuseBrick, deleteBrick, initqueue }
