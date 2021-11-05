/**
 * Author: 
 * Description: Vanish command for node-hill. Makes you vanish from the game for other players.
 * Modules: none
 */

Game.command("vanish", (player) => {
    // Make the player disappear
    player._removePlayer()
    // Say goodbye to the player
    Game.messageAll(`\\c6[SERVER]: \\c0${player.username} has left the server!`)
})
Game.command("novanish", (player) => {
    // Make the player re-appear
    new PacketBuilder(3)
        .write("uint8", 1)
        .write("uint32", player.netId)
        .write("string", player.username)
        .write("uint32", player.userId)
        .write("uint8", player.admin)
        .write("uint8", player.membershipType)
        .broadcastExcept([player]);
    // Greet the player
    player._greet()
    // Load the outfit
    player.setAvatar(player.userId)
})