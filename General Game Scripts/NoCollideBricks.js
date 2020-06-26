function ConvertBlock(brick) { // The function that was called above.

     brick.collision = false // Turns collision off to the brick that was named "collide".

}

world.bricks.forEach(async(brick) => { // Finds all brick possible in the map.
    if (brick.name == "Wood2") { // Is the specific brick currently on named "collide"?
        ConvertBlock(brick) // If it is, call the "ConvertBlock" function.
    }
})
